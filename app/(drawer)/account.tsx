import { View, Text } from 'react-native';
import React from 'react';
import { Container } from '~/components/Container';
import { Box } from '~/theme';
import { useAuth } from '~/lib/context/auth-context';
import { Button } from '~/components/Button';

export default function Account() {
  const auth = useAuth();

  return (
    <Container>
      <Box justifyContent="space-between" flex={1}>
        <Text>{auth.user?.email}</Text>
      </Box>
      <Button title="Logout" onPress={async () => await auth.signOut()} />
    </Container>
  );
}
