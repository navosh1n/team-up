export const getUserName = user => (user ? `${user.firstName} ${user.lastName}` : '');

export const mergeAccess = (value1, value2) => {
  const keys = [...Object.keys(value1), ...Object.keys(value2)];

  return keys.reduce((res, key) => {
    res[key] = typeof value1[key] === 'object'
      ? mergeAccess(value1[key], value2[key])
      : value1[key] || value2[key];
    return res;
  }, {});
};
