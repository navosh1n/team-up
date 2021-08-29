export const secondsToFullTime = (value) => {
  const hours = Math.floor(value / 60 / 60);
  const minutes = Math.floor(value / 60) - (hours * 60);
  const seconds = value % 60;

  const result = [];

  hours && result.push(hours.toString().padStart(2, '0'));
  result.push(minutes.toString().padStart(2, '0'));
  result.push(seconds.toString().padStart(2, '0'));

  return result.join(':');
};
