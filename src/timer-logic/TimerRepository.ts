import {makeAutoObservable, runInAction} from 'mobx';
import {VisibleTimerEvent} from '.';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TimerEvent} from './VisibleTimerEvent';
import {supervisor} from '../di';

const TIMERS_KEY = 'timer';

export class TimerRepository {
  public timerList: Array<VisibleTimerEvent> = [];
  constructor() {
    makeAutoObservable(this);
  }

  async loadTimers() {
    try {
      const timersJson = await AsyncStorage.getItem(TIMERS_KEY);
      if (timersJson === null) {
        return;
      }
      const timers = JSON.parse(timersJson) as TimerEvent[];
      const visibleTimerEventFactory =
        supervisor.getModuleFactory('VisibleTimerEvent');
      runInAction(() => {
        this.timerList = timers.map(timer => {
          return visibleTimerEventFactory(timer.eventTime, timer.name);
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  async saveTimer(timerInfo: TimerEvent) {
    try {
      const timersJson = await AsyncStorage.getItem(TIMERS_KEY);
      let timers: TimerEvent[] = [];
      if (timersJson !== null) {
        timers = JSON.parse(timersJson) as TimerEvent[];
      }
      const index = timers.findIndex(el => el.name === timerInfo.name);
      if (index < 0) {
        timers.push(timerInfo);
      } else {
        timers.splice(index, 1, timerInfo);
      }

      await AsyncStorage.setItem(TIMERS_KEY, JSON.stringify(timers));
      const visibleTimerEventFactory =
        supervisor.getModuleFactory('VisibleTimerEvent');
      runInAction(() => {
        this.timerList = timers.map(timer => {
          return visibleTimerEventFactory(timer.eventTime, timer.name);
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  async deleteAllTimers() {
    try {
      await AsyncStorage.clear();
      runInAction(() => (this.timerList = []));
    } catch (e) {
      console.error(e);
    }
  }
}

export const registerTimerRepository = () => {
  supervisor.registerSingletonModule('TimerRepository', new TimerRepository());
};
