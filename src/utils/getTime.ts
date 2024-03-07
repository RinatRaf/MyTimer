const ONESECOND = 1000;

export default function getLeftTimes(ttl: number): string {
  const diff = ttl - Date.now();
  const hours = Math.round(diff / 3600 / ONESECOND);
  const minutes = Math.round(
    (diff - hours * 3600 * ONESECOND) / 60 / ONESECOND
  );
  const seconds = Math.abs(
    Math.round(
      (diff - hours * 3600 * ONESECOND - minutes * 60 * ONESECOND) / ONESECOND
    )
  );

  const hoursTitle = hours > 9 ? hours : `0${hours}`;
  const hoursMinutes = minutes > 9 ? minutes : `0${minutes}`;
  const hoursSeconds = seconds > 9 ? seconds : `0${seconds}`;

  return `${hoursTitle}:${hoursMinutes}:${hoursSeconds}`;
}
