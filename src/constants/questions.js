export const questionStatusTypes = {
  draft: 'draft',
  review: 'review',
  ready: 'ready',
};

export const questionTypes = {
  verbal: 'verbal',
  visual: 'visual',
  liveCode: 'liveCode',
};

export const questionStatuses = {
  [questionStatusTypes.draft]: 'Черновик',
  [questionStatusTypes.review]: 'Ревью',
  [questionStatusTypes.ready]: 'Готов',
};

export const questionTypesLabels = {
  [questionTypes.verbal]: 'Устный',
  [questionTypes.visual]: 'Визуальный',
  [questionTypes.liveCode]: 'Live coding',
};

export const questionTypesFactors = {
  [questionTypes.verbal]: 1,
  [questionTypes.visual]: 2,
  [questionTypes.liveCode]: 3,
};
