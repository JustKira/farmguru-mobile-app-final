import { View, Text } from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '@shopify/restyle';
import { Theme } from '~/theme';

export default function Dropdown({
  item,
  value,
  placeholder,
  onValueChange,
  zIndex,
}: {
  placeholder?: string;
  item?: { label: string; value: string; icon?: () => JSX.Element }[];
  value?: string;
  onValueChange: (value: string) => void;
  zIndex?: number;
}) {
  const theme = useTheme<Theme>();
  const [open, setOpen] = useState(false);
  return (
    <DropDownPicker
      zIndex={zIndex}
      placeholder={placeholder}
      open={open}
      setOpen={setOpen}
      items={item ?? []}
      textStyle={{ color: theme.colors.foreground }}
      //@ts-ignore
      arrowIconStyle={{ tintColor: theme.colors.foreground }}
      dropDownContainerStyle={{
        backgroundColor: theme.colors.muted,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: theme.colors.border,
      }}
      style={{
        backgroundColor: theme.colors.muted,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
      //@ts-ignore
      setValue={(value) => onValueChange(value() as unknown as string)}
      selectedItemLabelStyle={{ color: theme.colors.primary }}
      value={value ?? ''}
      listMode="SCROLLVIEW"
    />
  );
}
