import { MessageI, Worker } from '../types';
import { isThisWeek } from './date';

export const getList2 = (
  messages: MessageI[],
  done: boolean,
  thisweek: boolean,
  type: 'dateReceived' | 'dateReturned'
) => {
  return messages.reduce((acc, message) => {
    const workers = message.workers.filter(
      (worker) =>
        worker.done === done && isThisWeek(new Date(worker[type])) === thisweek
    );
    return [...acc, ...workers];
  }, [] as Worker[]);
};

export const getList = (
  messages: MessageI[],
  type: 'T' | 'TE',
  done: boolean
) => {
  return messages.reduce((acc, message) => {
    const workers = message.workers.filter(
      (worker) => worker.type === type && worker.done === done
    );
    return [...acc, ...workers];
  }, [] as Worker[]);
};
