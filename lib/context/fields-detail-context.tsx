import { createContext, useContext, useState } from 'react';
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

interface FieldsDetailContextType {
  getIsFieldLoading: (index: number) => boolean;
}

const FieldsDetailContext = createContext<FieldsDetailContextType | undefined>(undefined);

export const FieldsDetailProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const fields = useFieldsData();
  const auth = useAuth();

  const fieldsQueries = useQueries({
    queries:
      fields.data?.map((field) => ({
        queryKey: ['field', field.id],
        retry: 1,
        queryFn: async () => {
          // Fake Timeout with Randoms to Simulate Loading

          // User is Guaranteed to be logged in Override the type
          const user = auth.user as UserData;

          console.log('Getting Field Details', field.id);
          const fields = await getFieldDetailsEndpoint(field.id, user.accountId);

          if (!fields) {
            throw new Error('No Fields Found');
          }

          await detailsProcessor(fields, field, user);
          await mapProcessor(fields, field, user);

          return { status: 'ok' };
        },
        refetch: false,
      })) || [], // Add an empty array as the default value if fields.data is undefined
  });

  const getIsFieldLoading = (index: number) => fieldsQueries[index].isLoading;

  return (
    <FieldsDetailContext.Provider
      value={{
        getIsFieldLoading,
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
