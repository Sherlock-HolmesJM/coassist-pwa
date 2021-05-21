import { useContext, useRef } from 'react';
import { context } from '../../context/context';
import styled from 'styled-components';
import Summary from './summary';
import NotAllocated from './notAllocated';
import IssuedAndReturned from './issuedAndReturned';
import { isThisWeek, getWeekBegin, getWeekEnd } from '../../utils/date';
import MessageSummary from '../../commons/messageSummary';
import * as reportUtils from '../../utils/report';

export interface ReportProps {
  report: boolean;
  setReport: (value: boolean) => void;
}

const weekbegan = getWeekBegin('Sat');
const weekends = getWeekEnd(weekbegan);

const Report: React.FC<ReportProps> = (props) => {
  const { messages, groupName, collatorName, members } = useContext(context);
  const { report, setReport } = props;

  const ref = useRef<HTMLDivElement>(null);

  if (!report) return null;

  const messagesNotAllocated = messages.filter((m) => m.status === 'undone');

  const messagesInProgress = messages.filter(
    (m) =>
      m.status === 'in-progress' ||
      m.status === 'transcribed' ||
      m.status === 'incomplete'
  );

  const audtrans = reportUtils.getList(messagesInProgress, 'T', true);
  const transinprog = reportUtils.getList(messagesInProgress, 'TE', false);
  const transedited = reportUtils.getList(messagesInProgress, 'TE', true);

  const issuedDisWeek = reportUtils.getList2(
    messagesInProgress,
    false,
    true,
    'dateReceived'
  );

  const issuedPreviousWeeks = reportUtils.getList2(
    messagesInProgress,
    false,
    false,
    'dateReceived'
  );

  const returnedthisweek = reportUtils.getList2(
    messages,
    true,
    true,
    'dateReturned'
  );

  let transcriptsNotAllocated = audtrans.filter(
    (m) => !transinprog.find((worker) => worker.part === m.part)
  );
  transcriptsNotAllocated = transcriptsNotAllocated.filter(
    (m) => !transedited.find((worker) => worker.part === m.part)
  );

  const messagesfinishedthisweek = messages.filter((message) => {
    const { dateReturned } = message.transcriptEditor;

    return (
      (message.status === 'done' || message.status === 'sent2CGT') &&
      isThisWeek(new Date(dateReturned))
    );
  });

  // ================== Animation =======================

  const animIn = 'animate__fadeIn';
  const animOut = 'animate__fadeOut';

  const closeReport = () => {
    ref.current?.classList.remove(animIn);
    ref.current?.classList.add(animOut);
    setTimeout(() => setReport(false), 700);
  };

  return (
    <Wrapper className={`animate__animated ${animIn}`} ref={ref}>
      <ButtonGroup className='btn-group no-print'>
        <button
          className='btn btn-primary btn-print'
          onClick={() => window.print()}
        >
          PDF Report
        </button>
        <button
          className='btn btn-primary btn-print'
          onClick={() => reportUtils.getImage('full-report', 'report')}
        >
          Image Report
        </button>
        <button className='btn btn-primary btn-print' onClick={closeReport}>
          Close
        </button>
      </ButtonGroup>
      <Div className={`animate__animated ${animIn}`}>
        <div id='full-report'>
          <div className='title-container'>
            <h4 className='uppercase title'>
              {groupName} weekly report - {collatorName}
            </h4>
            <h5>Week Began: {weekbegan.toDateString()}</h5>
            <h5>Week Ends: {new Date(weekends).toDateString()}</h5>
          </div>
          <Summary
            members={members}
            issuedPreviousWeeks={issuedPreviousWeeks}
            issuedThisWeek={issuedDisWeek}
            returnedThisWeek={returnedthisweek}
          />
          <MessageSummary
            title={'Messages Completed this Week'}
            messages={messagesfinishedthisweek}
          />
          <MessageSummary
            messages={messagesInProgress}
            title={'Messages in Progress: Completion Rate'}
          />
          <NotAllocated
            audios={messagesNotAllocated}
            transcripts={transcriptsNotAllocated}
            freemembers={members
              .filter((m) => m.active && m.free)
              .sort((a, b) => a.type.length - b.type.length)}
          />
          <IssuedAndReturned
            issued={issuedDisWeek}
            returned={returnedthisweek}
            outstanding={issuedPreviousWeeks}
          />
        </div>
      </Div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: #f4a261;
  #full-report {
    background-color: #f4a261;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
`;

const Div = styled.div`
  margin: 0;
  padding-top: 10px;
  background-color: #f4a261;

  .title-container {
    text-align: center;
  }
  .title {
    margin-bottom: 40px;
  }
  .uppercase {
    text-transform: uppercase;
  }

  @media print {
    .no-print {
      display: none;
    }
  }
`;

export default Report;
