import { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { makeStyles } from '~/theme';

export interface InputsProps extends TextInputProps {}

export const InputField = forwardRef<TextInput, InputsProps>(({ ...rest }, ref) => {
  const styles = useStyles();
  return <TextInput style={styles.textInput} {...rest} ref={ref} />;
});

const useStyles = makeStyles((theme) => ({
  textInput: {
    color: theme.colors.foreground,
    backgroundColor: theme.colors.muted,
    height: 52, // Corrected from 'hight' to 'height' and removed quotes for consistency in React Native styling
    width: '100%',
    paddingHorizontal: theme.spacing.sm_12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadii.m_6,
  },
}));
