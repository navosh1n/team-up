import { levels } from '@/constants/levels';
import { questionStatuses, questionTypesLabels } from '@/constants/questions';

export const getQuestionLevel = (level) => levels[level] || '-';

export const getQuestionStatus = (status) => questionStatuses[status] || '-';

export const getQuestionType = (type) => questionTypesLabels[type] || '-';
