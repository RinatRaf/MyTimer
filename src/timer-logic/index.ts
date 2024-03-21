import {registerTimer} from './Timer';
import {registerTimerRepository} from './TimerRepository';
import {registerTimerEvent} from './VisibleTimerEvent';

export {VisibleTimerEvent} from './VisibleTimerEvent';
export type {TimerModuleFactories, TimerModuleSingletons} from './types';

registerTimer();
registerTimerEvent();
registerTimerRepository();
