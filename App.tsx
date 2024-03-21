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
import {TimerList} from './src/timer-logic';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {initModules} from './src/initModules';

initModules();

export const ObservableApp = observer(function App() {
  const TimerRepository = supervisor.getSingleton('TimerRepository');
  useEffect(() => {
    TimerRepository.loadTimers();
    return () => supervisor.getSingleton('Ticker').cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView>
      <EventCreator />
      <Button
        onPress={() => {
          TimerRepository.deleteAllTimers();
        }}
        title="Удалить все"
      />
      <TimerList />
    </SafeAreaView>
  );
});

const EventCreator = () => {
  const [date, setDate] = useState(new Date());
  const [timerName, setTimerName] = useState('');
  const TimerRepository = supervisor.getSingleton('TimerRepository');

  const onChange =
    (mode: 'time' | 'date') =>
    (event: DateTimePickerEvent, currentDate?: Date) => {
      if (event.type !== 'set' || !currentDate) {
        return;
      }
      setDate(currentDate);

      if (Platform.OS === 'android' && mode === 'date') {
        showMode('time', currentDate);
      }
    };

  const showMode = (currentMode: 'time' | 'date', currentDate?: Date) => {
    DateTimePickerAndroid.open({
      value: currentDate ?? date,
      onChange: onChange(currentMode),
      mode: currentMode,
      is24Hour: true,
      minimumDate: TODAY,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const createTimer = () => {
    TimerRepository.saveTimer({eventTime: date.getTime(), name: timerName});
  };

  return (
    <View>
      <Button title="Выберите дату" onPress={showDatepicker} />

      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={date}
          mode={Platform.select({default: 'date', ios: 'datetime'})}
          onChange={onChange('date')}
          minimumDate={TODAY}
        />
      ) : (
        <Text>Выбрано: {date.toLocaleString()}</Text>
      )}
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
