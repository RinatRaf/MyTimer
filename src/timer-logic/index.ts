import {registerTimer} from './Timer';
import {registerTimerEvent} from './VisibleTimerEvent';

export {VisibleTimerEvent} from './VisibleTimerEvent';
export type {TimerModuleFactories, TimerModuleSingletons} from './types';

registerTimer();
registerTimerEvent();
