import React, { useMemo } from 'react';
import { Box, Text, Theme } from '~/theme';
import { Bar } from 'react-native-progress';
import { useTheme } from '@shopify/restyle';
export default function FieldPercentages({
  label,
  percentages,
}: {
  label: string;
  percentages?: number[];
}) {
  const theme = useTheme<Theme>();

  const barConfig = useMemo(() => {
    return {
      color: theme.colors.primary,
      borderRadius: theme.borderRadii.xl_24,
      height: 15,
      width: null,
    };
  }, [theme.colors.primary, theme.colors.foreground]);

  const { high, medium, low, veryLow } = useMemo(() => {
    return {
      high: percentages?.[0] ?? 0,
      medium: percentages?.[1] ?? 0,
      low: percentages?.[2] ?? 0,
      veryLow: percentages?.[3] ?? 0,
    };
  }, [label, percentages]);

  return (
    <Box gap="sm_12">
      <Text variant="title" color="foreground">
        {label}
      </Text>

      <Box gap="s_8">
        <Box flexDirection="row" justifyContent="space-between">
          <Text variant="body" color="foreground">
            High
          </Text>
          <Text variant="body" color="primary">
            {high.toFixed(2)}%
          </Text>
        </Box>
        <Bar progress={toZeroOne(high)} {...barConfig} />
      </Box>
      <Box gap="s_8">
        <Box flexDirection="row" justifyContent="space-between">
          <Text variant="body" color="foreground">
            Medium
          </Text>
          <Text variant="body" color="primary">
            {medium.toFixed(2)}%
          </Text>
        </Box>
        <Bar progress={toZeroOne(medium)} {...barConfig} />
      </Box>
      <Box gap="s_8">
        <Box flexDirection="row" justifyContent="space-between">
          <Text variant="body" color="foreground">
            Low
          </Text>
          <Text variant="body" color="primary">
            {low.toFixed(2)}%
          </Text>
        </Box>
        <Bar progress={toZeroOne(low)} {...barConfig} />
      </Box>
      <Box gap="s_8">
        <Box flexDirection="row" justifyContent="space-between">
          <Text variant="body" color="foreground">
            Very Low
          </Text>
          <Text variant="body" color="primary">
            {veryLow.toFixed(2)}%
          </Text>
        </Box>
        <Bar progress={toZeroOne(veryLow)} {...barConfig} />
      </Box>
    </Box>
  );
}

const toZeroOne = (value?: number) => {
  return value ? Math.abs(value / 100) : 0;
};
