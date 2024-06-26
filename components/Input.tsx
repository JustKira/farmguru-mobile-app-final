import { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { makeStyles, useTheme } from '~/theme';

export interface InputsProps extends TextInputProps {}

export const InputField = forwardRef<TextInput, InputsProps>(({ ...rest }, ref) => {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <TextInput
      style={{
        ...styles.textInput,
        color: theme.colors.foreground,
        backgroundColor: theme.colors.muted,
        borderColor: theme.colors.muted,
      }}
      {...rest}
      ref={ref}
    />
  );
});

const useStyles = makeStyles((theme) => ({
  textInput: {
    height: 52, // Corrected from 'hight' to 'height' and removed quotes for consistency in React Native styling
    width: '100%',
    paddingHorizontal: theme.spacing.sm_12,
    borderWidth: 1,

    borderRadius: theme.borderRadii.m_6,
  },
}));
