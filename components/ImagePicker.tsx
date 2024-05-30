import React, { useState } from 'react';
import * as IP from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { FontAwesome } from '@expo/vector-icons';

import { Theme, useTheme } from '~/theme';
import Dropdown from './Dropdown';
function ImagePicker({ onImageSelected }: { onImageSelected: (uri: string) => void }) {
  const theme = useTheme();

  const [value, setValue] = useState<string>('');
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await IP.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await IP.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.canceled) {
      setValue('camera');
      onImageSelected(result.assets[0].uri);
    }
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await IP.launchImageLibraryAsync({
      mediaTypes: IP.MediaTypeOptions.All,

      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setValue('gallery');
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <Dropdown
      item={[
        {
          label: 'Camera',
          value: 'camera',
          icon: () => <FontAwesome name="camera" size={20} color={theme.colors.foreground} />,
        },
        {
          label: 'Gallery',
          value: 'gallery',
          icon: () => <FontAwesome name="image" size={20} color={theme.colors.foreground} />,
        },
      ]}
      onValueChange={(value) => {
        if (value === 'camera') {
          openCamera();
        } else {
          pickImage();
        }
      }}
      placeholder={'Add Image'}
      value={value}
    />
  );
}

export default ImagePicker;
