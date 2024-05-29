import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as Progress from 'react-native-progress';
import { HeaderButton } from '../../components/HeaderButton';

import { Box, Theme } from '~/theme';
import { AuthProvider } from '~/lib/context/auth-context';
import Login from '~/components/screens/Login';

const DrawerLayout = () => {
  const theme = useTheme<Theme>();

  return (
    <AuthProvider
      loading={
        <Box flex={1} justifyContent="center" alignItems="center">
          <Progress.CircleSnail color={theme.colors.primary} size={100} borderWidth={5} />
        </Box>
      }
      userNotFound={<Login />}>
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
            drawerIcon: ({ size, color }) => <FontAwesome6 name="user" size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="(tabs)/[fid]"
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
      </Drawer>
    </AuthProvider>
  );
};

export default DrawerLayout;
