import {action, makeObservable, observable} from 'mobx';

export interface Ticker {
  now: number;
}

export interface ObservableTicker extends Ticker {
  tick: () => void;
  cleanup: () => void;
}

export function createTicker(): ObservableTicker {
  let interval: ReturnType<typeof setInterval> | null = null;

  const ticker = makeObservable(
    {
      now: Date.now(),
      tick() {
        this.now = Date.now();
      },
      cleanup() {
        if (interval) {
          clearInterval(interval);
        }
      },
    },
    {
      now: observable,
      tick: action,
    },
  );

  setInterval(() => {
    ticker.tick();
  }, 1000);

  return ticker;
}
