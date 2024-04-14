import React, {useCallback} from 'react';
import {Alert, View} from 'react-native';
import {TimerItem} from './TimerItem';
import {supervisor} from '../../di';
import {observer} from 'mobx-react-lite';
import {StackNavigatorNavParams} from '../../navigator';

type TimerListProps = StackNavigatorNavParams<'TimerList'>;

export const TimerListScreen = observer(({navigation}: TimerListProps) => {
  const TimerRepository = supervisor.getSingleton('TimerRepository');
  const timers = TimerRepository.timerList;

  const navigateToEventEditor = (eventId: string) => {
    navigation.navigate('EventCreatorScreen', {
      eventId,
    });
  };

  const onDelete = useCallback(
    eventId => {
      Alert.alert(
        'Удалить таймер?',
        'Вы уверены что хотите удалить этот таймер',
        [
          {
            text: 'Да',
            onPress: () => {
              TimerRepository.deleteTimer(eventId);
            },
          },
          {
            text: 'Нет',
            onPress: () => {},
          },
        ],
      );
    },
    [TimerRepository],
  );

  return (
    <View>
      {timers.map(timer => (
        <TimerItem
          key={timer.id}
          onDelete={onDelete}
          event={timer}
          navigateToEventEditor={navigateToEventEditor}
        />
      ))}
    </View>
  );
});
