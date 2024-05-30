import { createContext, useContext, useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useFieldsData } from './fields-data-context';
import getFieldDetailsEndpoint from '~/utils/endpoints/get-field-details';
import { useAuth } from './auth-context';
import getCachedFilePathByKey from '~/utils/storage/cache-file-by-key';
import { fieldDetailsImageParser } from '~/utils/parser/field-details-image';
import { Field, NewFieldsMapInfo, fieldsDetailsSchema, fieldsMapInfoSchema } from '../db/schemas';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { fieldDetailsInfoParser } from '~/utils/parser/field-details-info';
import { scoutPointsParser } from '~/utils/parser/field-scout-point';
import {
  FieldsScoutPoints,
  fieldsScoutPointsSchema,
} from '../db/schemas/fields-scout-points.schema';
import * as FileSystem from 'expo-file-system';
import uploadStorage from '~/utils/endpoints/upload-storage';
import createUpdateScoutPointEndpoint from '~/utils/endpoints/post-scout-point';
import useCacheTracker from '../hooks/use-cache-tracker';
import NetInfo from '@react-native-community/netinfo';

interface FieldsDetailContextType {
  getIsFieldLoading: (index: number) => boolean;
  getFieldQueryState: (index: number) => {
    status: string;
    isFetching: boolean;
    error: any;
  };
}

const FieldsDetailContext = createContext<FieldsDetailContextType | undefined>(undefined);

export const FieldsDetailProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const fields = useFieldsData();
  const auth = useAuth();
  const cache = useCacheTracker();
  const [completedQueries, setCompletedQueries] = useState(0);
  const fieldsQueries = useQueries({
    queries:
      fields.data?.map((field) => ({
        queryKey: ['field', field.id],
        retry: 1,
        queryFn: async () => {
          // Fake Timeout with Randoms to Simulate Loading
          const { isConnected } = await NetInfo.fetch();

          // User is Guaranteed to be logged in Override the type
          const user = auth.user as UserData;

          if (!isConnected && cache.cacheTimestamp === null) {
            throw new Error('No internet connection and no data in cache');
          }

          if (cache.cacheTimeHasPassed(240) === false) {
            console.log('Cache time has not passed, fetching from cache Details');
            return { status: 'ok' };
          }

          console.log('Cache time has passed, fetching new data');

          console.log('Getting Field Details', field.id);
          const fields = await getFieldDetailsEndpoint(field.id, user.accountId);

          if (!fields) {
            throw new Error('No Fields Found');
          }

          const scoutPoints = await db.query.fieldsScoutPointsSchema.findMany({
            where(fields, operators) {
              return operators.eq(fields.isDirty, true);
            },
          });

          await Promise.all(
            scoutPoints.map(async (point) => {
              await syncScoutPoints(point as FieldsScoutPoints, field.id, user, !point.isNew);
            })
          );

          //Run Function without Await
          //A heavy function.

          await Promise.all([
            detailsProcessor(fields, field, user),
            mapProcessor(fields, field, user),
          ]);

          await scoutPointsProcessor(fields, field, user);

          setCompletedQueries((prev) => prev + 1);
          return { status: 'ok' };
        },
        refetch: false,
      })) || [], // Add an empty array as the default value if fields.data is undefined
  });

  useEffect(() => {
    // Check if all queries have reached a 'success' or 'error' state

    if (completedQueries === fieldsQueries.length) {
      // Run your caching function here
      console.log('All queries are completed. Taking a snapshot of the cache.');
      cache.cacheTimeTrack();
    }
  }, [completedQueries]); // Dependency on the array of query results

  const getIsFieldLoading = (index: number) => fieldsQueries[index]?.isLoading;

  const getFieldQueryState = (
    index: number
  ): {
    status: string;
    isFetching: boolean;
    error: any;
  } => {
    const result = fieldsQueries[index];
    return {
      status: result.status,
      isFetching: result.isFetching,
      error: result.error,
    };
  };
  return (
    <FieldsDetailContext.Provider
      value={{
        getIsFieldLoading,
        getFieldQueryState,
      }}>
      {children}
    </FieldsDetailContext.Provider>
  );
};

export const useFieldsDetail = () => {
  const context = useContext(FieldsDetailContext);
  if (!context) {
    throw new Error('useFieldsDetail must be used within a FieldsDetailProvider');
  }
  return context;
};

async function mapProcessor(fields: FarmFieldData, field: Field, user: UserData) {
  const parsedFieldsImages = fieldDetailsImageParser(fields);

  const fieldMapInfo: NewFieldsMapInfo = {
    id: field.id,
  };

  await Promise.all(
    Object.entries(parsedFieldsImages).map(async ([key, value]) => {
      const localUri = await getCachedFilePathByKey(user.accountId, value);
      //@ts-ignore
      fieldMapInfo[`${key}OverlayImgKey`] = value;
      //@ts-ignore
      fieldMapInfo[`${key}OverlayImgPath`] = localUri;
    })
  );

  await db.delete(fieldsMapInfoSchema).where(eq(fieldsMapInfoSchema.id, field.id));

  try {
    const res = await db.insert(fieldsMapInfoSchema).values(fieldMapInfo).returning();

    console.group(`Map Inserted: ${res[0].id}`);
    console.log(
      `Default Overlay: %c${res[0].defaultOverlayImgPath ? 'Yes' : 'No'}`,
      'color: green;'
    );
    console.log(`Growth Overlay: %c${res[0].growthOverlayImgPath ? 'Yes' : 'No'}`, 'color: blue;');
    console.log(
      `Nitrogen Overlay: %c${res[0].nitrogenOverlayImgPath ? 'Yes' : 'No'}`,
      'color: red;'
    );
    console.log(
      `Anomaly Overlay: %c${res[0].anomalyOverlayImgPath ? 'Yes' : 'No'}`,
      'color: purple;'
    );
    console.log(
      `Irrigation Overlay: %c${res[0].irrigationOverlayImgPath ? 'Yes' : 'No'}`,
      'color: orange;'
    );
    console.groupEnd();
  } catch (error) {
    console.error('Error Inserting Map', error);
  }
}

async function scoutPointsProcessor(fields: FarmFieldData, field: Field, user: UserData) {
  const parsedScoutPoints = scoutPointsParser(fields.markersList);

  await Promise.allSettled(
    parsedScoutPoints.map(async (p) => {
      // Ensure photosFiles is initialized
      if (!p.photosFiles) p.photosFiles = [];

      const photoPromises = p.photosKeys
        ? p.photosKeys.map((value) => getCachedFilePathByKey(user.accountId, value))
        : [];
      const photoFiles = await Promise.allSettled(photoPromises);
      photoFiles.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) p.photosFiles?.push(result.value);
      });

      const voiceNotePromise = p.voiceNoteKey
        ? getCachedFilePathByKey(user.accountId, p.voiceNoteKey)
        : Promise.resolve(null);
      const voiceReplyPromise = p.voiceReplyKey
        ? getCachedFilePathByKey(user.accountId, p.voiceReplyKey)
        : Promise.resolve(null);

      const [voiceNoteResult, voiceReplyResult] = await Promise.allSettled([
        voiceNotePromise,
        voiceReplyPromise,
      ]);

      if (voiceNoteResult.status === 'fulfilled') p.voiceNoteFile = voiceNoteResult.value;
      if (voiceReplyResult.status === 'fulfilled') p.voiceReplyFile = voiceReplyResult.value;

      // Perform database operations only if all required files are successfully retrieved
      try {
        await db.delete(fieldsScoutPointsSchema).where(eq(fieldsScoutPointsSchema.id, p.id));
        const res = await db.insert(fieldsScoutPointsSchema).values(p).returning();
        console.log(`Scout Points Inserted ${res[0].id}`);
      } catch (error) {
        console.error('Error Inserting Scout Points', error);
      }
    })
  );
}

async function detailsProcessor(fields: FarmFieldData, field: Field, user: UserData) {
  const parsedFiledDetails = fieldDetailsInfoParser(fields);

  await db.delete(fieldsDetailsSchema).where(eq(fieldsDetailsSchema.id, field.id));

  try {
    const res = await db.insert(fieldsDetailsSchema).values(parsedFiledDetails).returning();

    console.log(`Details Inserted ${res[0].id}`);
  } catch (error) {
    console.error('Error Inserting Details', error);
  }
}

export async function syncScoutPoints(
  data: FieldsScoutPoints,
  fieldId: string,
  user: UserData,
  isNew: boolean
) {
  const dataToSync = data;

  if (dataToSync.photosFiles?.length !== 0) {
    const file = dataToSync.photosFiles?.[0];

    if (file) {
      const base64 = await FileSystem.readAsStringAsync(file);
      const fileExtension = file.split('.').pop();

      if (base64 && fileExtension) {
        const key = await uploadStorage(base64, user.accountId, fileExtension);
        if (key) dataToSync.photosKeys = [key];
      }
    }
  }

  if (dataToSync.voiceNoteFile) {
    const base64 = await FileSystem.readAsStringAsync(dataToSync.voiceNoteFile);
    const fileExtension = dataToSync.voiceNoteFile.split('.').pop();

    if (base64 && fileExtension) {
      const key = await uploadStorage(base64, user.accountId, fileExtension);
      if (key) dataToSync.voiceNoteKey = key;
    }
  }

  try {
    const res = await createUpdateScoutPointEndpoint({
      ActionMaker: user.accountId,
      Date: new Date(dataToSync.date).toISOString(),
      MarkerId: !isNew ? dataToSync.id : undefined,
      Status: 'New',
      FieldId: fieldId,
      IssueCategory: dataToSync.category,
      IssueSeverity: dataToSync.severity,
      Location: dataToSync.location,
      Notes: dataToSync.notes ?? '',
      Photos: dataToSync.photosKeys ?? [''],
      VoiceNotes: dataToSync.voiceNoteKey ?? '',
    });

    console.log('Scout Point Synced, Sync Type', !isNew ? 'Update' : 'Create');
    await db
      .update(fieldsScoutPointsSchema)
      .set({
        ...res,
        isDirty: false,
        isNew: false,
      })
      .where(eq(fieldsScoutPointsSchema.id, data.id));

    return res;
  } catch (error) {
    console.error('Error Syncing Scout Point', error);
  }
}
