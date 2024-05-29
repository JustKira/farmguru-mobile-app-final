import { useTheme } from '@shopify/restyle';
import { Stack } from 'expo-router';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { Theme } from '~/theme';

export default function Home() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Fields',
        }}
      />
      <Container>
        <Button title="Test" />
      </Container>
    </>
  );
}
