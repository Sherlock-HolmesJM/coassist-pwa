import firebase from 'firebase/app';
import 'firebase/database';
import { State } from '../../context/context';
import { swale, swals } from '../../utils';
import { transform } from '../transformer';
import { path, storypath } from './index';
import { updateWorker } from './worker';

const giveMissingFields = (state: State) => {
  state.messages.forEach((m) => {
    m.workers.forEach((w) => {
      if (w.done && !w.dateReturned) {
        w.dateReturned = new Date('2021-06-29').toJSON();
        updateWorker(w);
      }
    });
  });
  return state;
};

export const getData = () =>
  firebase
    .database()
    .ref(path())
    .get()
    .then((r) => giveMissingFields(transform(r.val()) as State))
    .catch((e) => {
      swale(e.message);
      return null;
    });

export const updateCGNames = (collatorName: string, groupName: string) => {
  firebase
    .database()
    .ref(path())
    .update({
      collatorName,
      groupName,
    })
    .then(() => swals('', 'Saved.'))
    .catch((e) => swale(e.message));
};

export const updateStory = (obj: { title: string; message: string }) => {
  firebase
    .database()
    .ref(storypath())
    .update({
      [obj.title]: obj.message,
    })
    .catch((e) => swale(e.message));
};
