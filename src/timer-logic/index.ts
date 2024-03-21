import {registerTimer} from './Timer';
import {registerTimerRepository} from './TimerRepository';
import {registerTimerEvent} from './VisibleTimerEvent';

export function registerTimerLogic() {
  registerTimer();
  registerTimerEvent();
  registerTimerRepository();
}

export {VisibleTimerEvent} from './VisibleTimerEvent';
export {TimerList} from './components';
export type {TimerModuleFactories, TimerModuleSingletons} from './types';
