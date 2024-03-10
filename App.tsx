import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {VisibleTimerEvent} from './src/timer-logic';
import {createTicker} from './src/timer-logic/Timer';

const april12 = new Date();
april12.setMonth(3);
april12.setDate(12);
april12.setHours(0, 0, 0);
const ticker = createTicker();
const timer = new VisibleTimerEvent(april12.getTime(), '12 апреля', ticker);

export const ObservableApp = observer(function App() {
  useEffect(() => () => ticker.cleanup(), []);
  return (
    <SafeAreaView>
      <Text>{timer.timeLeftString}</Text>
    </SafeAreaView>
  );
});
