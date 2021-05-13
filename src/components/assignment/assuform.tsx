import React, { useContext, useEffect, useState } from 'react';
import { context } from '../../context/context';
import { setMessages } from '../../context/actions';
import { MessageI } from '../../types';
import { db } from '../../services';
import * as mm from '../message/messageModel';
import { hmsToSeconds, secondsToHMS, swalconfirm, swals } from '../../utils';
import { determineSent, updateWorkers } from './helper';
import {
  SizeInput,
  NameInput,
  FileInput,
  ActionButtonHolder,
  Select,
} from './inputs';
import TimeInput from './timeInput';
import FormContainer from '../../commons/formHolder';

export interface FormProps {
  message: MessageI | undefined;
  setMessage: (m: MessageI | undefined) => void;
}

const FormUpdate: React.FC<FormProps> = (props) => {
  const { message, setMessage } = props;

  const { dispatch, messages } = useContext(context);

  const [data, setData] = useState({
    name: '',
    size: 0,
    sent: '',
    duration: 0,
    spin: false,
    time: {
      h: '0',
      m: '0',
      s: '0',
    },
  });

  const { name, size, duration, spin, time, sent } = data;

  useEffect(() => {
    if (!message) return;

    const { name, size, duration, sent2CGT } = message;
    const time = secondsToHMS(duration);
    setData({
      ...data,
      name,
      size,
      duration,
      time,
      sent: sent2CGT ?? 'no',
    });
    // eslint-disable-next-line
  }, [message]);

  if (!message) return null;

  const handleGetDetails = (name: string, size: number, duration: number) => {
    const time = secondsToHMS(duration);
    setData({ ...data, name, size, time, duration });
  };

  const handleTimeUpdate = (type: 'h' | 'm' | 's', value: number) => {
    const time = { ...data.time, [type]: value };
    const duration = hmsToSeconds(time.h, time.m, time.s);
    setData({ ...data, time, duration });
  };

  const handleUpdate = async (e: any, message: MessageI) => {
    e.preventDefault();

    const result = await swalconfirm('Yes, update it!');
    if (!result.isConfirmed) return;

    const found = messages.find((m) => m.name === name);
    if (found && found.uid !== message.uid)
      return alert(`${name.toUpperCase()} has already been added`);

    const { h, m, s } = time;

    const newMessage: MessageI = {
      ...message,
      name,
      duration,
      originalLength: `${h}:${m}:${s}`,
      size,
      sent2CGT: determineSent(message, sent as any),
    };

    mm.updateStatus(newMessage);

    if (name !== message.name) updateWorkers(name, newMessage.workers);

    const index = messages.indexOf(message);
    const list = [...messages];
    list[index] = newMessage;

    dispatch(setMessages(list));
    db.updateMessage(newMessage);
    setMessage(undefined);
    swals('', 'Updated');
  };

  const containerProps = {
    setShow: setMessage,
    show: message ? true : false,
    spin,
  };

  return (
    <FormContainer props={containerProps}>
      <form onSubmit={(e) => handleUpdate(e, message)} className='form'>
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
        <Select
          label='Sent to CGT'
          value={sent}
          values={[
            ['no', 'no'],
            ['yes', 'yes'],
          ]}
          onChange={(value) => setData({ ...data, sent: value })}
        />
        <ActionButtonHolder value='udpate'>
          <FileInput callback={handleGetDetails} />
        </ActionButtonHolder>
      </form>
    </FormContainer>
  );
};

export default FormUpdate;
