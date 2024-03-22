import {autorun, makeAutoObservable, observable, runInAction} from 'mobx';
import {VisibleTimerEvent} from '.';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TimerEvent} from './VisibleTimerEvent';
import {supervisor} from '../di';
import {v4 as uuidv4} from 'uuid';

const TIMERS_KEY = 'timer';

type TimerEventPartialId = Omit<TimerEvent, 'id'> &
  Partial<Pick<TimerEvent, 'id'>>;

export class TimerRepository {
  public timerList: Array<VisibleTimerEvent> = [];

  constructor() {
    makeAutoObservable(this, {timerList: observable});
    autorun(() => {
      console.log(this.timerList);
    });
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
          return visibleTimerEventFactory(timer);
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  async saveTimer(timerInfo: TimerEventPartialId) {
    try {
      const timersJson = await AsyncStorage.getItem(TIMERS_KEY);
      let timers: TimerEvent[] = [];
      if (timersJson !== null) {
        timers = JSON.parse(timersJson) as TimerEvent[];
      }
      const timerInfoWithId: TimerEvent = {
        ...timerInfo,
        id: timerInfo?.id ?? uuidv4(),
      };

      const index = timers.findIndex(el => el.id === timerInfoWithId.id);
      if (index < 0) {
        timers.push(timerInfoWithId);
      } else {
        timers.splice(index, 1, timerInfoWithId);
      }

      await AsyncStorage.setItem(TIMERS_KEY, JSON.stringify(timers));
      const visibleTimerEventFactory =
        supervisor.getModuleFactory('VisibleTimerEvent');
      runInAction(() => {
        this.timerList = timers.map(timer => {
          return visibleTimerEventFactory(timer);
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  deleteTimer = async (id: string) => {
    try {
      const timersJson = await AsyncStorage.getItem(TIMERS_KEY);
      if (timersJson === null) {
        return;
      }
      const timers = JSON.parse(timersJson) as TimerEvent[];
      const filteredTimers = timers.filter(timer => timer.id !== id);
      await AsyncStorage.setItem(TIMERS_KEY, JSON.stringify(filteredTimers));

      runInAction(() => {
        this.timerList = this.timerList.filter(timer => timer.id !== id);
      });
    } catch (e) {
      console.error(e);
    }
  };

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
