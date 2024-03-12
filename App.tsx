import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
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
  useEffect(() => () => supervisor.getSingleton('Ticker').cleanup(), []);

  return (
    <SafeAreaView>
      <EventCreator />
    </SafeAreaView>
  );
});

const EventCreator = () => {
  const [date, setDate] = useState(new Date());
  const [timerName, setTimerName] = useState('');

  const onChange = (mode: 'time' | 'date') => (_, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);

    if (Platform.OS === 'android' && mode === 'date') {
      showMode('time');
    }
  };

  const showMode = (currentMode: 'time' | 'date') => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onChange(currentMode),
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const createTimer = () => {};

  return (
    <View>
      <Button title="Выберите дату" onPress={showDatepicker} />
      <Text>Выбрано: {date.toLocaleString()}</Text>
      <DateTimePicker
        value={date}
        mode={Platform.select({default: 'date', ios: 'datetime'})}
        onChange={onChange('date')}
        minimumDate={TODAY}
      />
      <TextInput
        placeholder="Название таймера"
        value={timerName}
        onChangeText={setTimerName}
      />
      <Button title="Создать" onPress={createTimer} />
    </View>
  );
};

const TODAY = new Date();
