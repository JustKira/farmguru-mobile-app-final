import React, { useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import { Box, Text } from '~/theme';
import { useFieldsDetail } from '~/lib/context/fields-detail-context';
import { Pressable, View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import * as Progress from 'react-native-progress';

interface FieldMapCardProps {
  index: number;
  name: string;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  polyCoords: {
    latitude: number;
    longitude: number;
  }[];
  onPress?: () => void;
}

const FieldMapCardSelector: React.FC<FieldMapCardProps> = ({
  initialRegion,
  polyCoords,
  index,
  name,
  onPress,
}) => {
  const { getFieldQueryState } = useFieldsDetail();

  useEffect(() => {
    console.log(`${name} ${getFieldQueryState(index).isFetching}`);
  }, [index]);

  return (
    <Pressable
      onPress={() => {
        if (!getFieldQueryState(index).isFetching && onPress) {
          onPress();
        }
      }}>
      <Box height={200} width={'100%'} position="relative" marginBottom="ml_24" padding="sm_12">
        <Box>
          {getFieldQueryState(index).isFetching ? (
            <Box flexDirection="row">
              <Text variant="title" color="foreground">
                Loading...
              </Text>
            </Box>
          ) : (
            <Box>
              <Text variant="title" color="foreground">
                {name}
              </Text>
            </Box>
          )}
        </Box>
        <Box opacity={getFieldQueryState(index).isFetching ? 0.2 : 1}>
          <MapView
            initialRegion={initialRegion}
            cacheEnabled={true}
            provider={PROVIDER_GOOGLE}
            mapType="satellite"
            scrollEnabled={false}
            pitchEnabled={false}
            zoomEnabled={false}
            style={{ width: '100%', height: '100%' }}>
            <Polygon coordinates={polyCoords} strokeWidth={1} strokeColor="rgb(64 165 120)" />
          </MapView>
        </Box>
      </Box>
    </Pressable>
  );
};

export default FieldMapCardSelector;
