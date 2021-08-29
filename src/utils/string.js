export const toFullNum = (value = 0) => value.toString().padStart(2, '0');

export const pluralize = (number, words) => (
  words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number
    % 10 : 5]]
);

export const htmlDecode = (input) => {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
};
