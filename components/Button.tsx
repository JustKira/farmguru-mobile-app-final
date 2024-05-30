import React, { forwardRef } from 'react';
import { TouchableOpacity } from 'react-native';

import { createRestyleComponent, createVariant, VariantProps, BoxProps } from '@shopify/restyle';
import { Text, Theme } from 'theme'; // Ensure Text component is imported from the correct library

const buttonVariant = createVariant<Theme, 'buttonVariants'>({
  themeKey: 'buttonVariants',
  defaults: {
    alignItems: 'center',
    borderRadius: 'm_6',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    padding: 'm_16',
  },
});

const CustomButton = createRestyleComponent<
  VariantProps<Theme, 'buttonVariants'> & BoxProps<Theme>,
  Theme
>([buttonVariant], TouchableOpacity);

export const Button = forwardRef<
  TouchableOpacity,
  VariantProps<Theme, 'buttonVariants'> &
    BoxProps<Theme> & {
      children: React.ReactNode; // Changed from JSX.Element to React.ReactNode for broader compatibility
      onPress: () => void;
      variant?: keyof Theme['buttonVariants'];
    }
>(({ onPress, children, variant, ...restProps }, ref) => {
  return (
    //@ts-ignore
    <CustomButton onPress={onPress} ref={ref} variant={variant} {...restProps}>
      {children}
    </CustomButton>
  );
});

export default Button;
