import { action, computed, makeObservable, observable } from "mobx";
import getLeftTimes from "./utils/getTime";

interface TimerEvent {
  ttl: number;
  name: string;
}

export default class VisibleTimerEvent implements TimerEvent {
  public ttl: number;
  public name: string;
  private timerId: ReturnType<typeof setInterval> | null = null;
  public timeLeft: number;

  constructor(ttl: number, name: string) {
    this.ttl = ttl;
    this.name = name;
    this.timeLeft = ttl - Date.now();

    if (this.timeLeft > 0) {
      this.timerId = setInterval(() => {
        // console.log(this.timeLeft);
        const test = this.setTimeLeft();

        if (test < 0) {
          this.cleanUp();
          this.timeLeft = 0;
        }
      }, 1000);
    }

    makeObservable(this, {
      timeLeft: observable,
      timeLeftString: computed,
      setTimeLeft: action,
    });
  }

  get timeLeftString(): string {
    const leftTimes = getLeftTimes(this.ttl);
    return `Осталось до Праздника ${leftTimes}`;
  }
  setTimeLeft() {
    return (this.timeLeft = this.ttl - Date.now());
  }

  cleanUp(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
}
