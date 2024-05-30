import React, { useState } from 'react';
import Button from './Button';
import { Box, Text, useTheme } from '~/theme';

import FieldsSharedMap from './FieldsSharedMap';
import { Modal } from 'react-native';
import { MapPressEvent, Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

export const MapInput = ({
  onLocationSelect,
}: {
  onLocationSelect: (e: MapPressEvent) => void;
}) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = React.useState<number[]>();
  return (
    <React.Fragment>
      <Button onPress={() => setModalVisible(true)} variant="primary" alignContent="center">
        <MaterialIcons name="map" size={16} /> <Text variant="body">Location</Text>
      </Button>
      {location ? (
        <Box flexDirection="row" gap="sm_12">
          <Text color="primary">Lat: {location[0].toFixed(5)} </Text>
          <Text color="primary">Long: {location[1].toFixed(5)} </Text>
        </Box>
      ) : (
        <></>
      )}

      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Button
          position="absolute"
          bottom={0}
          padding="s_8"
          zIndex={1}
          width={'100%'}
          onPress={() => setModalVisible(false)}
          variant="primary">
          <Text>Save</Text>
        </Button>

        <FieldsSharedMap
          onPress={(e) => {
            console.log('Map Pressed', e.nativeEvent.coordinate);
            onLocationSelect(e);
            setLocation([e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude]);
          }}>
          {location ? (
            <Marker
              coordinate={{
                latitude: location[0],
                longitude: location[1],
              }}
            />
          ) : (
            <></>
          )}
        </FieldsSharedMap>
      </Modal>
    </React.Fragment>
  );
};
