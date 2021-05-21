import { MessageI, Worker } from '../types';
import { isThisWeek } from './date';
import * as htmlToImage from 'html-to-image';

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

export const getImage = (id: string, filename: string) => {
  const el = document.getElementById(id);

  return new Promise((resolve, reject) => {
    if (el) {
      const options: htmlToImage.Options = {
        quality: 1,
        pixelRatio: 2,
      };

      htmlToImage
        .toJpeg(el, options)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `${filename}.jpeg`;
          link.click();
          resolve('Completed');
        })
        .catch((error) => reject(error));
    } else {
      reject('No element');
    }
  });
};
