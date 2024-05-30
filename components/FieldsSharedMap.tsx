import { View, Text } from 'react-native';
import React from 'react';
import { useMap } from '~/lib/context/map-context';
import MapView, {
  Details,
  MapViewProps,
  PROVIDER_GOOGLE,
  Polygon,
  Region,
} from 'react-native-maps';
import { useTheme } from '@shopify/restyle';
import { Theme } from '~/theme';

interface MapProps extends Partial<MapViewProps> {
  children?: React.ReactNode;
}
export default function FieldsSharedMap({
  children,

  ...otherProps
}: MapProps) {
  const { region, setRegion, initialRegion, borders } = useMap();
  const theme = useTheme<Theme>();
  const onRegionChange = async (region: Region, details: Details) => {
    if (details.isGesture === true) {
      setRegion(region);
      return;
    }
  };

  return (
    <MapView
      mapType="satellite"
      style={{ width: '100%', height: '100%' }}
      provider={PROVIDER_GOOGLE}
      region={region ? region : initialRegion}
      initialRegion={initialRegion}
      onRegionChangeComplete={onRegionChange}
      {...otherProps}>
      {children}

      {borders && borders?.length !== 0 ? (
        <Polygon coordinates={borders} strokeColor={theme.colors.primary} strokeWidth={3} />
      ) : (
        <></>
      )}
    </MapView>
  );
}
