import React from 'react';
import {View} from 'react-native';
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

  return (
    <View>
      {timers.map(timer => (
        <TimerItem
          key={timer.id}
          onDelete={TimerRepository.deleteTimer}
          event={timer}
          navigateToEventEditor={navigateToEventEditor}
        />
      ))}
    </View>
  );
});
