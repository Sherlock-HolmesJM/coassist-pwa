import React, { useContext, useState } from 'react';
import { hmsToSeconds, secondsToHMS, swale, swals } from '../../utils';
import { context } from '../../context/context';
import { setMessages } from '../../context/actions';
import { MessageI, createT_TE } from '../../types';
import { db } from '../../services';
import { SizeInput, NameInput, FileInput, ActionButtonHolder } from './inputs';
import TimeInput from './timeInput';
import FormContainer from '../../commons/formHolder';

export interface FormProps {
  setShowform: (value: boolean) => void;
  showform: boolean;
}

const initialData = {
  name: '',
  size: 0,
  duration: 0,
  spin: false,
  time: {
    h: '00',
    m: '00',
    s: '00',
  },
};

const FormAdd: React.FC<FormProps> = (props) => {
  const { setShowform, showform } = props;

  const { dispatch, messages } = useContext(context);

  const [data, setData] = useState(initialData);

  const { name, size, duration, spin, time } = data;

  const handleGetDetails = (name: string, size: number, duration: number) => {
    const time = secondsToHMS(duration);
    setData({ ...data, name, size, time, duration });
  };

  const handleTimeUpdate = (type: 'h' | 'm' | 's', value: number) => {
    const time = { ...data.time, [type]: value };
    const duration = hmsToSeconds(time.h, time.m, time.s);
    setData({ ...data, time, duration });
  };

  const getFilename = () => name.toLowerCase().trim() ?? '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filename = getFilename();
    const index = messages.findIndex((m) => m.name === filename);

    if (index !== -1) {
      return swale(
        `${filename.toUpperCase()} has already been added.`,
        'Duplicate message'
      );
    }

    const { h, m, s } = time;

    const message: MessageI = {
      uid: Date.now(),
      name: filename,
      status: 'undone',
      workers: [],
      category: 'sermon',
      duration: duration,
      transcriber: createT_TE('T'),
      transcriptEditor: createT_TE('TE'),
      size,
      splits: 1,
      transcribed: 'no',
      edited: 'no',
      sent2CGT: '',
      splitLength: 0,
      originalLength: `${h}:${m}:${s}`,
      rank: 1,
    };

    const list = [...messages, message];

    dispatch(setMessages(list));
    setData(initialData);
    db.setMessage(message);
    swals('', 'New message added.');
  };

  const containerProps = {
    setShow: setShowform,
    show: showform,
    spin,
  };

  return (
    <FormContainer props={containerProps}>
      <form onSubmit={handleSubmit} className='form'>
        <NameInput
          value={name}
          setName={(name) => setData({ ...data, name })}
        />
        <TimeInput
          time={time}
          setTime={(type, value) => handleTimeUpdate(type, value)}
        />
        <SizeInput
          value={size}
          onChange={(value) => setData({ ...data, size: +value })}
        />
        <ActionButtonHolder value='add'>
          <FileInput callback={handleGetDetails} />
        </ActionButtonHolder>
      </form>
    </FormContainer>
  );
};

export default FormAdd;
