import React from 'react';
import { FieldsScoutPoints } from '~/lib/db/schemas';
import { Box, Text, useTheme } from '~/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import getSeverity from '~/utils/ui/get-severity';
import { TouchableOpacity } from 'react-native';

export default function ScoutPointListItem({
  point,
  onPress,
}: {
  point: FieldsScoutPoints;
  onPress?: () => void;
}) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        gap="sm_12"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="muted"
        padding="sm_12"
        borderRadius="s_3"
        marginBottom="s_8"
        flexDirection="row">
        <Box flexDirection="row" gap="sm_12" alignItems="center">
          <MaterialCommunityIcons
            name="alert-circle"
            size={32}
            color={getSeverity(point.severity.toLocaleLowerCase() as Severity, {
              late: () => theme.colors.destructive,
              moderate: () => theme.colors.warning,
              early: () => theme.colors.softWarning,
            })}
          />
          <Text color="foreground">{format(point.date, 'EE ,d MMM yyy HH:mm aaa')}</Text>
        </Box>
        <Text variant="label" color="foreground">
          {point.category}
        </Text>
      </Box>
    </TouchableOpacity>
  );
}
