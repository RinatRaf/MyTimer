import {getHoursMinutesAndSeconds, getTimeLeft} from '../getTimeLeft';

const ONE_HOUR = 3600;
const ONE_MINUTE = 60;

describe('getTimeLeft tests', () => {
  const NOW = new Date('2024/03/08').getTime(); // 08.03.2024 00:00:00

  describe('getHoursMinutesAndSeconds', () => {
    it('should correctly handle secondsLeft <= 0', () => {
      const expectedValue = {
        hours: 0,
        minutes: 0,
        seconds: 0,
      };

      const minusOneSecond = getHoursMinutesAndSeconds(-1);
      expect(minusOneSecond).toStrictEqual(expectedValue);

      const minusOneMinute = getHoursMinutesAndSeconds(-ONE_MINUTE);
      expect(minusOneMinute).toStrictEqual(expectedValue);

      const minusOneHour = getHoursMinutesAndSeconds(-ONE_HOUR);
      expect(minusOneHour).toStrictEqual(expectedValue);

      const minusLongTimeAgo = getHoursMinutesAndSeconds(-10000000);
      expect(minusLongTimeAgo).toStrictEqual(expectedValue);

      const eventTime = getHoursMinutesAndSeconds(0);
      expect(eventTime).toStrictEqual(expectedValue);
    });

    it('should correctly handle secondsLeft > 0', () => {
      const secondsResult = getHoursMinutesAndSeconds(42);
      expect(secondsResult).toStrictEqual({
        hours: 0,
        minutes: 0,
        seconds: 42,
      });

      const minutesResult = getHoursMinutesAndSeconds(42 * ONE_MINUTE + 42);
      expect(minutesResult).toStrictEqual({
        hours: 0,
        minutes: 42,
        seconds: 42,
      });

      const hoursResult = getHoursMinutesAndSeconds(
        42 * ONE_HOUR + 42 * ONE_MINUTE + 42,
      );
      expect(hoursResult).toStrictEqual({
        hours: 42,
        minutes: 42,
        seconds: 42,
      });
    });
  });

  describe('getTimeLeft', () => {
    it('should correctly work if event already happened', () => {
      const result = getTimeLeft(NOW - 1000, NOW);
      expect(result).toStrictEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });

    it('should correctly count same day time left', () => {
      const date = new Date(NOW);
      date.setHours(23, 59, 59);

      const result = getTimeLeft(date.getTime(), NOW);
      expect(result).toStrictEqual({
        days: 0,
        hours: 23,
        minutes: 59,
        seconds: 59,
      });
    });

    it('should correctly count days', () => {
      const date = new Date(NOW);
      date.setDate(32); // April, 1st
      date.setHours(23, 59, 59);

      const result = getTimeLeft(date.getTime(), NOW);
      expect(result).toStrictEqual({
        days: 24,
        hours: 23,
        minutes: 59,
        seconds: 59,
      });
    });
  });
});
