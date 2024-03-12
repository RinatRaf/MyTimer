import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, Text, TextInput} from 'react-native';
import {supervisor} from './src/di';
import './src/timer-logic';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

const april12 = new Date();
april12.setMonth(3);
april12.setDate(12);
april12.setHours(0, 0, 0);
const timer = supervisor.getModuleFactory('VisibleTimerEvent')(
  april12.getTime(),
  '12 Апреля',
);

export const ObservableApp = observer(function App() {
  const [date, setDate] = useState(new Date());
  const [timerName, setTimerName] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  const createTimer = () => {};

  useEffect(() => () => supervisor.getSingleton('Ticker').cleanup(), []);

  return (
    <SafeAreaView>
      <Button onPress={showDatepicker} title="Show date picker!" />
      <Button onPress={showTimepicker} title="Show time picker!" />
      <Text>Выбрано: {date.toLocaleString()}</Text>
      <TextInput
        placeholder="Название таймера"
        value={timerName}
        onChangeText={setTimerName}
      />
      <Button title="Создать" onPress={createTimer} />
      <Text>{timer.timeLeftString}</Text>
    </SafeAreaView>
  );
});
