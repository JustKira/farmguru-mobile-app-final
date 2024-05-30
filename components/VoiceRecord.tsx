import { Box, Text } from '~/theme';
import Button from './Button';
import VoiceRecorderControllerInput, {
  VoiceRecorderControllerInputHandle,
} from './VoiceRecorderController';
import { useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

interface VoiceRecordProps {
  onRecordingComplete: (uri: string) => void;
}

export default function VoiceRecord({ onRecordingComplete }: VoiceRecordProps) {
  const voiceRecorder = useRef<VoiceRecorderControllerInputHandle>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleError = (error: Error) => {
    console.error('Recording failed:', error);
  };

  return (
    <VoiceRecorderControllerInput
      ref={voiceRecorder}
      onRecordingComplete={onRecordingComplete}
      onRecordingError={handleError}>
      <Box>
        <Button
          variant="primary"
          onPress={() => {
            if (isRecording) {
              voiceRecorder.current?.stopRecording();
              setIsRecording(false);
            } else {
              voiceRecorder.current?.startRecording();
              setIsRecording(true);
            }
          }}>
          <FontAwesome
            style={{
              marginRight: 10,
            }}
            name={isRecording ? 'microphone-slash' : 'microphone'}
            size={20}
          />
          <Text variant="body">{isRecording ? 'Stop' : 'Record'}</Text>
        </Button>
      </Box>
    </VoiceRecorderControllerInput>
  );
}
