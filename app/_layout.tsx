import { ThemeProvider, useTheme } from '@shopify/restyle';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { theme } from '../theme';
import migrations from '../drizzle/migrations';
import { Theme, darkTheme } from '~/theme/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { db } from '~/lib/db';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

export default function RootLayout() {
  const theme = useTheme<Theme>();
  return (
    <Wrapper>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} /> */}
      </Stack>
    </Wrapper>
  );
}

const queryClient = new QueryClient();

function Wrapper({ children }: { children: React.ReactNode }) {
  const color = useColorScheme();
  const migrator = useMigrations(db, migrations);
  useEffect(() => {
    if (migrator.success) {
      console.log('Migrations complete');
      return;
    } else if (migrator.error) {
      console.error(migrator.error);
      return;
    }
  }, [migrator]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={color === 'dark' ? darkTheme : theme}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
