import { Flex, Title } from '../components/report/flex';
import { MessageI } from '../types';
import { formatCap, getMessageTotals } from '../utils';
import SumCard from './summaryCard';
import styled from 'styled-components';
import { getAnim } from '../utils/animations';
import { getImage } from '../utils/report';

export interface MessageSummaryProps {
  title: string;
  messages: MessageI[];
}

const MessageSummary: React.FC<MessageSummaryProps> = (props) => {
  const { title, messages } = props;

  if (messages.length === 0) return null;

  return (
    <Div>
      <div className='msgsum-btn-div'>
        <button
          className='btn btn-primary'
          onClick={() => getImage(title, title)}
        >
          Report
        </button>
      </div>
      <div className='msg-container' id={title}>
        <Title>{title}</Title>
        <Flex>
          {messages.map((m, i) => {
            const totals = getMessageTotals(m);

            const list: [string, string][] = (
              [
                ['Length', m.duration],
                ['Transcribed', totals.done_t],
                ['Edited', totals.done_te],
                ['Transcribing', totals.working_t],
                ['Editing', totals.working_te],
              ] as [string, number][]
            )
              .filter((item) => item[1] > 0)
              .map((item) => [item[0], formatCap(item[1])]);

            return (
              <SumCard
                key={i}
                title={m.name}
                animation={getAnim()}
                items={list}
              />
            );
          })}
        </Flex>
      </div>
    </Div>
  );
};

const Div = styled.div`
  background-color: #f4a261;
  padding: 10px 0;
  display: flex;
  flex-direction: column;

  .msgsum-btn-div {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    padding-right: 80px;
  }
  .msg-container {
    padding-top: 10px;
    align-self: center;
    background-color: #f4a261;
  }
`;

export default MessageSummary;
