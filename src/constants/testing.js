// режим тестирования
export const testingModeTypes = {
  interview: 'interview', // собеседование
  testing: 'testing', // проверка/тестирование
  teaching: 'teaching', // обучение
};

export const testingModes = {
  [testingModeTypes.interview]: 'Собеседование',
  [testingModeTypes.testing]: 'Тестирование',
  [testingModeTypes.teaching]: 'Обучение',
};

// статус тестирования
export const testingStatusTypes = {
  inProgress: 'inProgress', // в процессе
  finished: 'finished', // завершен
};

export const testingStatuses = {
  [testingStatusTypes.inProgress]: 'В процессе',
  [testingStatusTypes.finished]: 'Закончен',
};

// кол-во минут на ответ в зависимости от режима тестирования
export const testingQuestionTime = {
  [testingModeTypes.interview]: 1,
  [testingModeTypes.testing]: 2,
  [testingModeTypes.teaching]: 2,
};

// стоимость ответов
export const answerTypes = {
  correct: 2, // правильный ответ
  notComplete: 1, // неполный ответ
  incorrect: 0, // неправильный ответ
};
