import { Audio } from 'expo-av';
import { useState } from 'react';
import Button from './Button';
import { Text } from '~/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AudioPlayer({ uri }: { uri?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound>();

  async function playSound(uri: string) {
    console.log('Loading Sound', uri);
    const { sound } = await Audio.Sound.createAsync({
      uri,
    });
    setSound(sound);
    console.log('Loaded Sound', sound.getStatusAsync());
    console.log('Playing Sound');
    await sound.playAsync();
    setIsPlaying(true);
  }

  async function stopSound() {
    if (sound) {
      console.log('Stopping Sound');
      await sound.stopAsync();
      setIsPlaying(false);
    }
  }

  return (
    <Button
      variant="primary"
      onPress={() => {
        if (!uri) return console.log('No uri provided');
        if (!isPlaying) {
          playSound(uri);
        } else {
          stopSound();
        }
      }}>
      <MaterialCommunityIcons name={isPlaying ? 'speaker-off' : 'speaker'} size={20} />
      <Text>{isPlaying ? 'Stop' : 'Play'}</Text>
    </Button>
  );
}
