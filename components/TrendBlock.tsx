import React from 'react';
import { Feather } from '@expo/vector-icons';
import { Box, Text, Theme } from '~/theme';
import { useTheme } from '@shopify/restyle';
interface TrendBlockProps {
  value: number;
  isNegativeNature?: boolean;
  label: string;
}

export default function TrendBlock({ isNegativeNature, label, value }: TrendBlockProps) {
  const theme = useTheme<Theme>();
  const isTrendingPositive = isNegativeNature ? value <= 0 : value >= 0;

  return (
    <Box margin="sm_12" flexDirection="row" alignItems="baseline" justifyContent="space-between">
      <Box flexDirection="row" gap="sm_12" alignItems="center">
        <Feather
          name={isTrendingPositive ? 'trending-up' : 'trending-down'}
          size={32}
          color={isTrendingPositive ? theme.colors.primary : theme.colors.destructive}
        />
        <Text color="foreground" variant="large">
          {label}
        </Text>
      </Box>
      <Box
        borderWidth={1}
        borderColor={isTrendingPositive ? 'primary' : 'destructive'}
        backgroundColor={isTrendingPositive ? 'primaryLight' : 'destructiveLight'}
        borderRadius="xl_24"
        paddingVertical="s_8"
        paddingHorizontal="s_8">
        <Text color={isTrendingPositive ? 'primary' : 'destructive'}>{value.toFixed(2)}% </Text>
      </Box>
    </Box>
  );
}
