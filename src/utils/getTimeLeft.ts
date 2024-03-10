const ONE_SECOND = 1000;
const ONE_MINUTE = 60;
const ONE_HOUR = 3600;
const ONE_DAY = ONE_HOUR * 24;

type GetTimeLeftResult = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const getHoursMinutesAndSeconds = (
  secondsLeft: number,
): Omit<GetTimeLeftResult, 'days'> => {
  const hours = Math.max(Math.floor(secondsLeft / ONE_HOUR), 0);
  const minutes = Math.max(
    Math.floor((secondsLeft - hours * ONE_HOUR) / ONE_MINUTE),
    0,
  );
  const seconds = Math.max(
    Math.floor(secondsLeft - hours * ONE_HOUR - minutes * ONE_MINUTE),
    0,
  );

  return {
    hours,
    minutes,
    seconds,
  };
};

export function getTimeLeft(
  eventTime: number,
  nowTime: number,
): GetTimeLeftResult {
  if (nowTime > eventTime) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const secondsLeft = Math.floor((eventTime - nowTime) / ONE_SECOND);
  if (secondsLeft < ONE_DAY) {
    return {
      days: 0,
      ...getHoursMinutesAndSeconds(secondsLeft),
    };
  }

  const days = Math.floor(secondsLeft / ONE_DAY);
  const dateOfTheEvent = nowTime + days * ONE_DAY * ONE_SECOND;

  const secondsLeftOnEventDay = Math.floor(
    (eventTime - dateOfTheEvent) / ONE_SECOND,
  );

  return {
    days,
    ...getHoursMinutesAndSeconds(secondsLeftOnEventDay),
  };
}
