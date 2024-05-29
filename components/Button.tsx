import { forwardRef } from 'react';
import { ButtonProps, TouchableOpacity } from 'react-native';
import { Text, makeStyles } from 'theme';

export const Button = forwardRef<TouchableOpacity, ButtonProps>(({ onPress, title }, ref) => {
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text variant="body" textAlign="center" color="background" fontWeight="600">
        {title}
      </Text>
    </TouchableOpacity>
  );
});

const useStyles = makeStyles((theme) => ({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadii.m_6,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    padding: theme.spacing.m_16,
  },
}));
