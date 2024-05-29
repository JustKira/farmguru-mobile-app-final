import { useTheme } from '@shopify/restyle';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

import { TabBarIcon } from '~/components/TabBarIcon';
import { Theme } from '~/theme';

export default function TabLayout() {
  const theme = useTheme<Theme>();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },

        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderWidth: 0,
          shadowColor: 'transparent',
          borderBlockColor: 'transparent',
        },
        tabBarActiveTintColor: theme.colors.primary,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Info',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="crop"
        options={{
          title: 'Crop',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
