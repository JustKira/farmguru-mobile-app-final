import React, { useMemo } from 'react';
import { useGlobalSearchParams } from 'expo-router';
import useGetFieldSingleScoutPointQuery from '~/lib/query/useGetFieldSingleScoutPoint';
import { Container } from '~/components/Container';
import { Box, Text, useTheme } from '~/theme';
import Button from '~/components/Button';
import ScoutFormModal, { ScoutFormModalHandles } from '~/components/modals/ScoutFormModal';
import { Entypo, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AudioPlayer from '~/components/AudioPlayer';
import { Image, ScrollView } from 'react-native';

export default function ScoutPointDetails() {
  const params = useGlobalSearchParams();
  const modelRef = React.useRef<ScoutFormModalHandles>(null);
  const { data: scoutPoint } = useGetFieldSingleScoutPointQuery(params.sid as string);
  const theme = useTheme();
  const categories = useMemo(() => {
    return [
      {
        label: 'Insect',
        value: 'insect',
        icon: () => <FontAwesome name="bug" size={20} color={theme.colors.primary} />,
      },
      {
        label: 'Disease',
        value: 'disease',
        icon: () => <FontAwesome5 name="virus" size={20} color={theme.colors.primary} />,
      },
      {
        label: 'Growth',
        value: 'growth',
        icon: () => <Entypo name="leaf" size={20} color={theme.colors.primary} />,
      },
      {
        label: 'Others',
        value: 'others',
        icon: () => <Entypo name="dots-three-horizontal" size={20} color={theme.colors.primary} />,
      },
      {
        label: 'Dont Know',
        value: 'dont know',
        icon: () => <FontAwesome5 name="question" size={20} color={theme.colors.primary} />,
      },
    ];
  }, []);

  const severities = useMemo(() => {
    return [
      {
        label: 'Early',
        value: 'early',
        icon: () => (
          <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.softWarning} />
        ),
      },
      {
        label: 'Moderate',
        value: 'moderate',
        icon: () => (
          <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.warning} />
        ),
      },
      {
        label: 'Late',
        value: 'late',
        icon: () => (
          <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.destructive} />
        ),
      },
    ];
  }, []);
  if (scoutPoint === undefined) {
    return <Text>Loading...</Text>;
  }

  // Use `useImperativeHandle` to expose specific functions to the parent component

  return (
    <Container>
      <Button
        onPress={() => {
          modelRef.current?.openModelWithData({
            category: scoutPoint.category,
            createdOn: scoutPoint.date.toISOString(),
            location: scoutPoint.location,
            severity: scoutPoint.severity,
            notes: scoutPoint.notes ?? '',
          });
        }}>
        <Text color="foreground">Edit Point Details</Text>
      </Button>

      <ScrollView>
        <Box
          gap="sm_12"
          padding="sm_12"
          borderRadius="s_3"
          marginTop="sm_12"
          backgroundColor="muted">
          <Text variant="label" color="foreground">
            Category
          </Text>

          <Box flexDirection="row" gap="sm_12">
            {categories.find((c) => c.value === scoutPoint.category)?.icon()}
            <Text color="foreground">{scoutPoint.category}</Text>
          </Box>
        </Box>

        <Box
          gap="sm_12"
          padding="sm_12"
          borderRadius="s_3"
          marginTop="sm_12"
          backgroundColor="muted">
          <Text variant="label" color="foreground">
            Severity
          </Text>
          <Box flexDirection="row" gap="sm_12">
            {severities.find((c) => c.value === scoutPoint.severity)?.icon()}
            <Text color="foreground">{scoutPoint.severity}</Text>
          </Box>
        </Box>

        <Box
          gap="sm_12"
          padding="sm_12"
          borderRadius="s_3"
          marginTop="sm_12"
          backgroundColor="muted">
          <Text variant="label" color="foreground">
            Notes
          </Text>
          <Text color="foreground">{scoutPoint.notes}</Text>
        </Box>

        <Box
          gap="sm_12"
          padding="sm_12"
          borderRadius="s_3"
          marginTop="sm_12"
          backgroundColor="muted">
          <Text variant="label" color="foreground">
            Location
          </Text>
          <Text color="foreground">{scoutPoint.location}</Text>
        </Box>

        <Box
          gap="sm_12"
          padding="sm_12"
          borderRadius="s_3"
          marginTop="sm_12"
          backgroundColor="muted">
          <Text variant="label" color="foreground">
            Voice note
          </Text>
          <AudioPlayer uri={scoutPoint.voiceNoteFile ?? undefined} />
        </Box>

        <Box gap="sm_12" padding="sm_12" maxHeight={500} width={'100%'} flex={1}>
          <Text variant="label" color="foreground">
            Photos
          </Text>
          {scoutPoint.photosFiles?.[0] && (
            <Image
              source={{ uri: scoutPoint.photosFiles?.[0] }}
              style={{ width: 'auto', height: '100%' }}
              resizeMode={'cover'}
            />
          )}
        </Box>
      </ScrollView>
      <ScoutFormModal
        ref={modelRef}
        fid={params.fid as string}
        isUpdate
        markerId={params.sid as string}
      />
    </Container>
  );
}
