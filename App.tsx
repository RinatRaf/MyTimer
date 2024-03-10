import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {supervisor} from './src/di';

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
      <Text>{timer.timeLeftString}</Text>
    </SafeAreaView>
  );
});
