export const checkImage = (src) => new Promise(((resolve, reject) => {
  const image = new Image();
  image.src = src;
  image.onload = resolve;
  image.onerror = reject;
}));
