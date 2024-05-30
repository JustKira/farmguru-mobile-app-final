import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Link, useGlobalSearchParams } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as Progress from 'react-native-progress';
import { HeaderButton } from '../../components/HeaderButton';

import { Box, Text, Theme } from '~/theme';
import { AuthProvider, useAuth } from '~/lib/context/auth-context';
import Login from '~/components/screens/Login';
import { FieldsDataProvider } from '~/lib/context/fields-data-context';
import { Button } from '~/components/Button';
import { FieldsDetailProvider } from '~/lib/context/fields-detail-context';

const DrawerLayout = () => {
  const theme = useTheme<Theme>();

  return (
    <AuthProvider
      loading={
        <Box flex={1} backgroundColor="background" justifyContent="center" alignItems="center">
          <Progress.CircleSnail color={theme.colors.primary} size={100} />
        </Box>
      }
      userNotFound={<Login />}>
      <FieldsDataProvider
        loading={
          <Box flex={1} backgroundColor="background" justifyContent="center" alignItems="center">
            <Progress.CircleSnail color={theme.colors.primary} size={100} />
          </Box>
        }
        noFieldsFound={() => {
          const auth = useAuth();
          return (
            <Box flex={1} backgroundColor="background" justifyContent="center" alignItems="center">
              <Text>No Fields Found</Text>
              <Button
                onPress={() => {
                  auth.signOut();
                }}
                variant="primary">
                <Text>Switch Account</Text>
              </Button>
            </Box>
          );
        }}>
        <FieldsDetailProvider>
          <Drawer
            screenOptions={{
              drawerStyle: {
                backgroundColor: theme.colors.background,
              },
              drawerActiveTintColor: theme.colors.primary,
              drawerInactiveTintColor: theme.colors.foreground,
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerTitleStyle: {
                color: theme.colors.foreground,
              },
              headerTintColor: theme.colors.foreground,
              headerShadowVisible: false,
            }}>
            <Drawer.Screen
              name="index"
              options={{
                headerTitle: 'Fields',
                drawerLabel: 'Fields',
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="home-outline" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="account"
              options={{
                headerTitle: 'Account',
                drawerLabel: 'Account',
                drawerIcon: ({ size, color }) => (
                  <FontAwesome6 name="user" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="(tabs)/[fid]"
              options={{
                headerTitle: 'Field',
                drawerItemStyle: { display: 'none' },
              }}
            />
          </Drawer>
        </FieldsDetailProvider>
      </FieldsDataProvider>
    </AuthProvider>
  );
};

export default DrawerLayout;
