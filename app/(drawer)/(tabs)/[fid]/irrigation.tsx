import { Stack, useGlobalSearchParams } from 'expo-router';
import FieldsSharedMap from '~/components/FieldsSharedMap';
import useGetFieldMapQuery from '~/lib/query/useGetFieldMap';
import useGetFieldQuery from '~/lib/query/useGetField';
import { Overlay } from 'react-native-maps';
import FieldBottomSheet from '~/components/FieldBottomSheet';
import FieldBottomSheetGeneralDetails from '~/components/FieldBottomSheetGeneralDetails';
import useGetFieldDetailsQuery from '~/lib/query/useGetFieldDetails';

export default function Irrigation() {
  const params = useGlobalSearchParams();

  const { data: fieldData } = useGetFieldQuery(params.fid as string);
  const { data: mapData } = useGetFieldMapQuery(params.fid as string);
  const { data: fieldDetails } = useGetFieldDetailsQuery(params.fid as string);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Irrigation',
        }}
      />
      <FieldsSharedMap>
        {mapData?.irrigationOverlayImgPath && fieldData?.bounds ? (
          <Overlay bounds={fieldData?.bounds} image={{ uri: mapData?.irrigationOverlayImgPath }} />
        ) : (
          <></>
        )}
      </FieldsSharedMap>
      <FieldBottomSheet>
        <FieldBottomSheetGeneralDetails data={fieldDetails} screen="IRRIGATION" />
      </FieldBottomSheet>
    </>
  );
}
