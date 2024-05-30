import { Stack, useGlobalSearchParams } from 'expo-router';
import FieldsSharedMap from '~/components/FieldsSharedMap';
import useGetFieldMapQuery from '~/lib/query/useGetFieldMap';
import useGetFieldQuery from '~/lib/query/useGetField';
import { Overlay } from 'react-native-maps';
import FieldBottomSheet from '~/components/FieldBottomSheet';
import FieldBottomSheetGeneralDetails from '~/components/FieldBottomSheetGeneralDetails';
import useGetFieldDetailsQuery from '~/lib/query/useGetFieldDetails';
import { Box, Text } from '~/theme';
import React, { useState } from 'react';
import Button from '~/components/Button';
import { Dimensions } from 'react-native';
import FieldPercentages from '~/components/FieldPercentages';
import Dropdown from '~/components/Dropdown';
import { ScrollView } from 'react-native-gesture-handler';

type MapTypes = 'anomaly' | 'nitrogen' | 'growth';

const map = [
  { label: 'Stress', value: 'anomaly' },
  { label: 'Nutrients', value: 'nitrogen' },
  { label: 'Growth', value: 'growth' },
];

export default function Crop() {
  const params = useGlobalSearchParams();
  const { data: fieldData } = useGetFieldQuery(params.fid as string);
  const { data: mapData } = useGetFieldMapQuery(params.fid as string);
  const { data: fieldDetails } = useGetFieldDetailsQuery(params.fid as string);

  const [selected, setSelected] = useState<MapTypes>('nitrogen');

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Crop',
        }}
      />
      <FieldsSharedMap>
        {mapData?.[`${selected}OverlayImgPath`] && fieldData?.bounds ? (
          <Overlay
            bounds={fieldData?.bounds}
            image={{ uri: mapData[`${selected}OverlayImgPath`] as string }}
          />
        ) : (
          <></>
        )}
      </FieldsSharedMap>
      <Box
        position="absolute"
        flexDirection="row"
        backgroundColor="background"
        top={0}
        // zIndex={1}
        margin="s_8"
        justifyContent="center"
        alignContent="center"
        gap="l_32"
        borderRadius="m_6"
        maxWidth={Dimensions.get('screen').width}>
        <Dropdown item={map} onValueChange={(v) => setSelected(v as MapTypes)} value={selected} />
      </Box>
      <FieldBottomSheet>
        <FieldBottomSheetGeneralDetails data={fieldDetails} screen="CROP" />

        <ScrollView>
          <Box rowGap="ml_24">
            <FieldPercentages
              label="Nutrients"
              percentages={fieldDetails?.nutrientsPercentage ?? undefined}
            />
            <FieldPercentages
              label="Growth"
              percentages={fieldDetails?.growthPercentage ?? undefined}
            />
            <FieldPercentages
              label="Stress"
              percentages={fieldDetails?.stressPercentage ?? undefined}
            />
          </Box>
        </ScrollView>
      </FieldBottomSheet>
    </>
  );
}
