import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Tabs, useGlobalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { MapProvider } from '~/lib/context/map-context';
import useGetFieldQuery from '~/lib/query/useGetField';
import { Theme } from '~/theme';

export default function TabLayout() {
  const params = useGlobalSearchParams();
  const theme = useTheme<Theme>();

  const field = useGetFieldQuery(params.fid as string);

  const borders = useMemo(() => {
    return field.data?.location.map((cords) => ({
      latitude: cords[0],
      longitude: cords[1],
    }));
  }, [field.data?.location]);

  return (
    <MapProvider
      loadRegion={{
        latitude: field.data?.position[0] ?? 0,
        longitude: field.data?.position[1] ?? 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      loadBorder={borders ?? []}>
      <Tabs
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },

          tabBarStyle: {
            height: 60,
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
            tabBarIcon: ({ color }) => <Ionicons name="analytics-sharp" size={30} color={color} />,
          }}
        />
        <Tabs.Screen
          name="crop"
          options={{
            title: 'Crop',
            tabBarIcon: ({ color }) => <FontAwesome5 name="seedling" size={30} color={color} />,
          }}
        />
        <Tabs.Screen
          name="irrigation"
          options={{
            title: 'Irrigation',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="water" size={30} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="scout"
          options={{
            title: 'Scout',
            tabBarIcon: ({ color }) => <FontAwesome name="search" size={30} color={color} />,
          }}
        />
      </Tabs>
    </MapProvider>
  );
}
