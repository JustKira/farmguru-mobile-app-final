import { Stack, useGlobalSearchParams } from 'expo-router';
import FieldsSharedMap from '~/components/FieldsSharedMap';
import useGetFieldMapQuery from '~/lib/query/useGetFieldMap';
import useGetFieldQuery from '~/lib/query/useGetField';
import { Overlay } from 'react-native-maps';
import FieldBottomSheet from '~/components/FieldBottomSheet';
import FieldBottomSheetGeneralDetails from '~/components/FieldBottomSheetGeneralDetails';
import useGetFieldDetailsQuery from '~/lib/query/useGetFieldDetails';
import { Text } from '~/theme';
import TrendBlock from '~/components/TrendBlock';

export default function Info() {
  const params = useGlobalSearchParams();

  const { data: fieldData } = useGetFieldQuery(params.fid as string);
  const { data: mapData } = useGetFieldMapQuery(params.fid as string);
  const { data: fieldDetails } = useGetFieldDetailsQuery(params.fid as string);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Info',
        }}
      />
      <FieldsSharedMap>
        {mapData?.defaultOverlayImgPath && fieldData?.bounds ? (
          <Overlay bounds={fieldData?.bounds} image={{ uri: mapData.defaultOverlayImgPath }} />
        ) : (
          <></>
        )}
      </FieldsSharedMap>
      <FieldBottomSheet>
        <FieldBottomSheetGeneralDetails data={fieldDetails} screen="INFO" />

        <Text color="foreground" variant="title" marginBottom="ml_24">
          Weekly Changes
        </Text>

        <TrendBlock label={'Nutrients'} value={Number(fieldDetails?.nutrientsTrend ?? 0)} />

        <TrendBlock label={'Growth'} value={Number(fieldDetails?.growthTrend ?? 0)} />

        <TrendBlock
          label={'Stress'}
          value={Number(fieldDetails?.stressTrend ?? 0)}
          isNegativeNature
        />
      </FieldBottomSheet>
    </>
  );
}
