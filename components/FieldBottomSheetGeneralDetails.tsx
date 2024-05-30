import { useGlobalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { FieldDetails } from '~/lib/db/schemas';
import useGetFieldDetailsQuery from '~/lib/query/useGetFieldDetails';
import { Box, Text } from '~/theme';
import { format } from 'date-fns';

export default function FieldBottomSheetGeneralDetails({
  screen,
  data,
}: {
  screen: Screens;
  data?: FieldDetails;
}) {
  const lastUpdate = useMemo(() => {
    switch (screen) {
      case 'CROP':
        return data?.lastCropUpdate;
      case 'IRRIGATION':
        return data?.lastIrrigationUpdate;
      case 'SCOUT':
        return data?.lastScoutUpdate;
      default:
        return data?.lastInfoUpdate;
    }
  }, [screen, data]);

  console.log(lastUpdate);

  return (
    <Box flexDirection="row" justifyContent="space-between" rowGap="m_16">
      <Box aspectRatio={1}>
        <Text color="foreground" variant="label">
          Crop Type
        </Text>
        <Text color="foreground">{data?.cropType}</Text>
      </Box>
      <Box aspectRatio={1}>
        <Text color="foreground" variant="label">
          Crop Age
        </Text>
        <Text color="foreground">{data?.cropAge}</Text>
      </Box>
      <Box aspectRatio={1}>
        <Text color="foreground" variant="label">
          Last Update
        </Text>
        <Text color="foreground">
          {lastUpdate ? format(new Date(lastUpdate), 'yyyy/MM/dd') : ''}
        </Text>
      </Box>
    </Box>
  );
}
