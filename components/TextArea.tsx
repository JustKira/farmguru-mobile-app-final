import { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { makeStyles, useTheme } from '~/theme';

export interface InputsProps extends TextInputProps {
  height?: number;
}

export const TextArea = forwardRef<TextInput, InputsProps>(({ ...rest }, ref) => {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <TextInput
      style={{
        ...styles.textInput,
        height: rest.height ?? 52,
        backgroundColor: theme.colors.muted,
        borderColor: theme.colors.border,
        color: theme.colors.foreground,
        padding: theme.spacing.m_16,
      }}
      multiline
      numberOfLines={5}
      {...rest}
      ref={ref}
    />
  );
});

const useStyles = makeStyles((theme) => ({
  textInput: {
    width: '100%',
    paddingHorizontal: theme.spacing.sm_12,
    borderWidth: 1,
    textAlignVertical: 'top',
    borderRadius: theme.borderRadii.m_6,
  },
}));
