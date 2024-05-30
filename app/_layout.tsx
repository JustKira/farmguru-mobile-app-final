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
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

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
      <Toast
        config={{
          success: (props: any) => (
            <BaseToast
              {...props}
              contentContainerStyle={{ backgroundColor: theme.colors.foreground }}
              text1Style={{
                color: theme.colors.background,
              }}
              text2Style={{
                color: theme.colors.background,
              }}
            />
          ),
          /*
          Overwrite 'error' type,
          by modifying the existing `ErrorToast` component
        */
          error: (props: any) => (
            <ErrorToast
              {...props}
              contentContainerStyle={{ backgroundColor: theme.colors.foreground }}
              text1Style={{
                color: theme.colors.background,
              }}
              text2Style={{
                color: theme.colors.background,
              }}
            />
          ),
        }}
      />
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

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
};
