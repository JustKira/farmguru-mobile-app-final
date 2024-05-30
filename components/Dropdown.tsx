import { View, Text } from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '@shopify/restyle';
import { Theme } from '~/theme';

export default function Dropdown({
  item,
  value,
  onValueChange,
}: {
  item?: { label: string; value: string }[];
  value?: string;
  onValueChange: (value: string) => void;
}) {
  const theme = useTheme<Theme>();
  const [open, setOpen] = useState(false);
  return (
    <DropDownPicker
      open={open}
      setOpen={setOpen}
      items={item ?? []}
      textStyle={{ color: theme.colors.foreground }}
      //@ts-ignore
      arrowIconStyle={{ tintColor: theme.colors.foreground }}
      dropDownContainerStyle={{
        backgroundColor: theme.colors.background,
        borderWidth: 0,
      }}
      style={{
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.muted,
      }}
      setValue={(value) => onValueChange(value as unknown as string)}
      selectedItemLabelStyle={{ color: theme.colors.primary }}
      value={value ?? ''}
    />
  );
}
