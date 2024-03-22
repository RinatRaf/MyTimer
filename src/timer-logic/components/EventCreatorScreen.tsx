import React, {useEffect, useMemo, useState} from 'react';
import {supervisor} from '../../di';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {StackNavigatorNavParams} from '../../navigator';

const TODAY = new Date();

type EventCreatoreScreenProps = StackNavigatorNavParams<'EventCreatorScreen'>;

export const EventCreatorScreen = ({route}: EventCreatoreScreenProps) => {
  const [date, setDate] = useState(new Date());
  const [timerName, setTimerName] = useState('');
  const TimerRepository = supervisor.getSingleton('TimerRepository');

  const editingEventId = route.params?.eventId;
  const isEditingTimer = editingEventId != null;
  const existingTimer = useMemo(() => {
    if (!editingEventId) {
      return null;
    }
    return (
      TimerRepository.timerList.find(({id}) => id === editingEventId) ?? null
    );
  }, [TimerRepository.timerList, editingEventId]);
  const title = existingTimer ? 'Изменить таймер' : 'Создать таймер';

  useEffect(() => {
    if (isEditingTimer && existingTimer) {
      setTimerName(existingTimer.title);
      setDate(new Date(existingTimer.eventTime));
    }
  }, [isEditingTimer, existingTimer]);

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
    TimerRepository.saveTimer({
      eventTime: date.getTime(),
      title: timerName,
      id: existingTimer?.id,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>
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
