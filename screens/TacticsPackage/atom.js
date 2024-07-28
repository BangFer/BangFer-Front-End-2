import { atom } from 'recoil';

export const tacticsFilterState = atom({
  key: 'tacticsFilterState',
  default: {
    sort: 'tacticId,desc',
    formation: null,
  },
});