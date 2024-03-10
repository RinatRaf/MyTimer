import {VisibleTimerEventFactory} from './VisibleTimerEvent';
import {ObservableTicker} from './Timer';

export type TimerModuleSingletons = {
  Ticker: ObservableTicker;
};

export type TimerModuleFactories = {
  VisibleTimerEvent: VisibleTimerEventFactory;
};
