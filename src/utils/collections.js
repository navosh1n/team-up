export const makeMapFromArray = (array) => array.reduce((res, item) => {
  res[item.id] = item;
  return res;
}, {});
