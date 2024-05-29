import { useTheme } from '@shopify/restyle';
import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import { Theme } from '~/theme';

export default function Crop() {
  const theme = useTheme<Theme>();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleStyle: {
            color: theme.colors.foreground,
          },
          headerTintColor: theme.colors.foreground,
          headerShadowVisible: false,
        }}
      />
      <Container>
        <ScreenContent path="app/(drawer)/(tabs)/two.tsx" title="Tab Two" />
      </Container>
    </>
  );
}
