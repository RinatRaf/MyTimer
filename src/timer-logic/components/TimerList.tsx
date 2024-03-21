import React from 'react';
import {View} from 'react-native';
import {TimerItem} from './TimerItem';
import {supervisor} from '../../di';
import {observer} from 'mobx-react-lite';

export const TimerList = observer(() => {
  const TimerRepository = supervisor.getSingleton('TimerRepository');
  const timers = TimerRepository.timerList;

  return (
    <View>
      {timers.map(timer => (
        <TimerItem
          key={timer.name}
          onDelete={TimerRepository.deleteTimer}
          event={timer}
        />
      ))}
    </View>
  );
});
