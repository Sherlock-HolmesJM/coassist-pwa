import { MessageI } from '../types';

export const summary = (messages: MessageI[]) => {
  const total = messages.length;

  const tIP = messages.filter((m) => m.edited === 'in-progress').length;
  const tEdited = messages.filter((m) => m.edited === 'yes').length;

  const aTrans = messages.filter((m) => m.transcribed === 'yes').length;
  const aIP = messages.filter((m) => m.transcribed === 'in-progress').length;
  const sent = messages.filter((m) => m.status === 'sent2CGT').length;

  return [
    { name: 'Total No. of Audios', value: total, classes: '' },
    { name: 'No. of Audios Issued', value: aTrans + aIP, classes: '' },
    { name: 'No. of Audios Transcribed', value: aTrans, classes: '' },
    {
      name: 'No. of Audios Not Transcribed',
      value: aIP,
      classes: 'summary-red',
    },
    { name: 'Total No. of Transcripts', value: total, classes: '' },
    {
      name: 'No. of Transcripts Issued',
      value: tIP + tEdited,
      classes: '',
    },
    { name: 'No. of Transcripts Edited', value: tEdited, classes: '' },
    {
      name: 'No. of Transcripts Not Edited',
      value: tIP,
      classes: 'summary-red',
    },
    {
      name: 'No. of Transcripts Sent to CGT',
      value: sent,
      classes: '',
    },
  ];
};

export default summary;
