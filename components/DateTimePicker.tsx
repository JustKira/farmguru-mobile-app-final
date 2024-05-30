import React from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Button from './Button';
import { Text } from '~/theme';
import { FontAwesome } from '@expo/vector-icons';

interface DateTimeSelectorProps {
  mode: 'date' | 'time';

  onTimeChange: (event: DateTimePickerEvent, selectedValue?: Date) => void;
  selectedDate: string;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  mode,
  onTimeChange,
  selectedDate,
}) => {
  const [show, setShow] = React.useState(false);
  return (
    <React.Fragment>
      <Button onPress={() => setShow(true)} variant="primary">
        <FontAwesome name={mode === 'date' ? 'calendar' : 'clock-o'} size={20} />
        <Text>{mode === 'date' ? 'Select Date' : 'Select Time'}</Text>
      </Button>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(selectedDate)}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={(e, d) => {
            onTimeChange(e, d);
            setShow(false);
          }}
        />
      )}
    </React.Fragment>
  );
};
