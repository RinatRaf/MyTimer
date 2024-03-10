import {computed, makeObservable} from 'mobx';
import {getTimeLeft} from '../utils';
import {Ticker} from './Timer';
import {supervisor} from '../di/supervisor';

export interface TimerEvent {
  eventTime: number;
  name: string;
}

export class VisibleTimerEvent implements TimerEvent {
  public eventTime: number;
  public name: string;
  private ticker: Ticker;

  constructor(eventTime: number, name: string) {
    this.eventTime = eventTime;
    this.name = name;

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

    return `Осталось до Праздника ${leftTimes.days} дней ${hours}:${minutes}:${seconds}`;
  }

  static timerEventFactory(eventTime: number, eventName: string) {
    return new VisibleTimerEvent(eventTime, eventName);
  }
}

export type VisibleTimerEventFactory = (
  eventTime: number,
  eventName: string,
) => VisibleTimerEvent;

supervisor.registerModuleFactory(
  'VisibleTimerEvent',
  VisibleTimerEvent.timerEventFactory,
);
