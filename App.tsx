import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
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
    <NavigationContainer>
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
    </NavigationContainer>
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

  const dateString = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

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
    <View style={styles.container}>
      <Text style={styles.heading}>Создать таймер</Text>
      <TextInput
        placeholder="Название таймера"
        value={timerName}
        onChangeText={setTimerName}
      />
      <View style={styles.selectDateContainer}>
        <Text style={styles.selectDateText}>Выберите дату и время: </Text>

        {Platform.select({
          ios: (
            <DateTimePicker
              value={date}
              mode={Platform.select({default: 'date', ios: 'datetime'})}
              onChange={onChange('date')}
              minimumDate={TODAY}
            />
          ),
          android: <Button title={dateString} onPress={showDatepicker} />,
        })}
      </View>
      <Button title="Создать" onPress={createTimer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  selectDateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const TODAY = new Date();
