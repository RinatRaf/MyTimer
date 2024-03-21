import {VisibleTimerEventFactory} from './VisibleTimerEvent';
import {ObservableTicker} from './Timer';
import {TimerRepository} from './TimerRepository';

export type TimerModuleSingletons = {
  Ticker: ObservableTicker;
  TimerRepository: TimerRepository;
};

export type TimerModuleFactories = {
  VisibleTimerEvent: VisibleTimerEventFactory;
};
