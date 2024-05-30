import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import FieldsSharedMap from '~/components/FieldsSharedMap';
import useGetFieldMapQuery from '~/lib/query/useGetFieldMap';
import useGetFieldQuery from '~/lib/query/useGetField';
import { Marker, Overlay } from 'react-native-maps';
import FieldBottomSheet from '~/components/FieldBottomSheet';
import FieldBottomSheetGeneralDetails from '~/components/FieldBottomSheetGeneralDetails';
import useGetFieldDetailsQuery from '~/lib/query/useGetFieldDetails';
import React, { useRef } from 'react';
import { FlashList } from '@shopify/flash-list';
import useGetFieldScoutPointsQuery from '~/lib/query/useGetFieldScoutPoints';
import ScoutPointListItem from '~/components/ScoutPointListItem';
import Button from '~/components/Button';
import { Text } from '~/theme';
import ScoutFormModal, { ScoutFormModalHandles } from '~/components/modals/ScoutFormModal';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';

export default function Scout() {
  const params = useGlobalSearchParams();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const modalRef = useRef<ScoutFormModalHandles>(null);

  const router = useRouter();

  const { data: fieldData } = useGetFieldQuery(params.fid as string);
  const { data: mapData } = useGetFieldMapQuery(params.fid as string);
  const { data: fieldDetails } = useGetFieldDetailsQuery(params.fid as string);
  const { data: scoutPoints } = useGetFieldScoutPointsQuery(params.fid as string);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Crop',
        }}
      />
      <FieldsSharedMap>
        {mapData?.defaultOverlayImgPath && fieldData?.bounds ? (
          <Overlay bounds={fieldData?.bounds} image={{ uri: mapData.defaultOverlayImgPath }} />
        ) : (
          <></>
        )}

        {scoutPoints?.map((point) => {
          const latlng = point.location;

          return (
            <Marker
              key={point.id}
              coordinate={{
                latitude: latlng[0],
                longitude: latlng[1],
              }}
              onPress={() => {
                router.navigate(`(drawer)/(tabs)/${params.fid}/scout/${point.id}`);
                // setShow(true);
                // setSelectedPoint(point as FieldScoutPointSchema);
                console.log('Marker Pressed', point.id);
              }}
            />
          );
        })}
      </FieldsSharedMap>
      <FieldBottomSheet ref={bottomSheetRef}>
        <FieldBottomSheetGeneralDetails data={fieldDetails} screen="SCOUT" />
        <Button
          onPress={() => modalRef.current?.openModal()}
          variant="primary"
          marginBottom="sm_12">
          <Text>Add Points</Text>
        </Button>
        <FlashList
          data={scoutPoints}
          renderItem={({ item }) => {
            return (
              <ScoutPointListItem
                point={item}
                onPress={() => router.navigate(`(drawer)/(tabs)/${params.fid}/scout/${item.id}`)}
              />
            );
          }}
          estimatedItemSize={20}
        />
      </FieldBottomSheet>

      <ScoutFormModal ref={modalRef} fid={params.fid as string} />
    </>
  );
}
