import { testingModes, testingStatuses } from '@/constants/testing';

export const getTestingMode = (mode) => testingModes[mode] || '-';

export const getTestingStatus = (status) => testingStatuses[status] || '-';
