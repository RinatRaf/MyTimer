import {computed, makeObservable} from 'mobx';
import {getTimeLeft} from '../utils';
import {Ticker} from './Timer';
import {supervisor} from '../di/supervisor';

export interface TimerEvent {
  id: string;
  eventTime: number;
  title: string;
}

export class VisibleTimerEvent implements TimerEvent {
  public id: string;
  public eventTime: number;
  public title: string;
  private ticker: Ticker;

  constructor({id, eventTime, title}: TimerEvent) {
    this.eventTime = eventTime;
    this.title = title;
    this.id = id;

    this.ticker = supervisor.getSingleton('Ticker');

    makeObservable(this, {
      timeLeftString: computed,
    });
  }

  get timeLeftString(): string {
    const leftTimes = getTimeLeft(this.eventTime, this.ticker.now);

    const hours = leftTimes.hours > 9 ? leftTimes.hours : `0${leftTimes.hours}`;
    const minutes =
      leftTimes.minutes > 9 ? leftTimes.minutes : `0${leftTimes.minutes}`;
    const seconds =
      leftTimes.seconds > 9 ? leftTimes.seconds : `0${leftTimes.seconds}`;

    return `Осталось ${leftTimes.days} дней ${hours}:${minutes}:${seconds}`;
  }

  static timerEventFactory(event: TimerEvent) {
    return new VisibleTimerEvent(event);
  }
}

export type VisibleTimerEventFactory = (event: TimerEvent) => VisibleTimerEvent;

export const registerTimerEvent = () => {
  supervisor.registerModuleFactory(
    'VisibleTimerEvent',
    VisibleTimerEvent.timerEventFactory,
  );
};
