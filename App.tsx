import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {supervisor} from './src/di';
import {initModules} from './src/initModules';
import {Navigator} from './src/navigator';

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
      <Navigator />
    </NavigationContainer>
  );
});
