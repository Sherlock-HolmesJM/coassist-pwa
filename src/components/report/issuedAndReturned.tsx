import React from 'react';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import { Worker } from '../../types';
import { formatCap, isThisWeek } from '../../utils';
import { congrats, outstanding } from '../../media';
import { Flex, FlexItem, Title } from './flex';

export interface IssuedReturnedProps {
  issued: Worker[];
  returned: Worker[];
  outstanding: Worker[];
}

const IssuedReturned: React.FC<IssuedReturnedProps> = (props) => {
  const { issued, returned, outstanding } = props;

  const list = [
    { title: 'Working [Ts]', workers: issued.filter((w) => w.type === 'T') },
    { title: 'Working [TEs]', workers: issued.filter((w) => w.type === 'TE') },
    { title: 'Returned [Ts]', workers: returned.filter((w) => w.type === 'T') },
    {
      title: 'Returned [TEs]',
      workers: returned.filter((w) => w.type === 'TE'),
    },
    {
      title: 'Outstanding [Ts]',
      workers: outstanding.filter((w) => w.type === 'T'),
    },
    {
      title: 'Outstanding [TEs]',
      workers: outstanding.filter((w) => w.type === 'TE'),
    },
  ];

  return (
    <div>
      <Title>Working and Returned</Title>
      <Flex>
        {list.map(({ title, workers }, i) => (
          <Item key={i} title={title} workers={workers} />
        ))}
      </Flex>
    </div>
  );
};

interface ItemProps {
  title: string;
  workers: Worker[];
}

const Item = (props: ItemProps) => {
  const { title, workers } = props;
  const { length } = workers;

  if (length === 0) return null;

  const sorted = workers
    .sort((a, b) => a.part.localeCompare(b.part))
    .sort((a, b) => a.type.localeCompare(b.type));

  const getAnimation = (worker: Worker) => {
    if (worker.done && !isThisWeek(new Date(worker.dateReceived)))
      return 'outstanding';
    if (worker.done && worker.workdone >= worker.capacity) return 'congrats';
    return 'none';
  };

  return (
    // <FlexItemWrapper>
    <FlexItemWrapper data-aos='fade'>
      <WorkerTitle>
        <div>{title}</div> <div>[{length}]</div>
      </WorkerTitle>
      <FlexWrapper>
        {sorted.map((w, i) => {
          const anim = getAnimation(w);
          return (
            // <FlexItem className='worker-card' key={i}>
            <FlexItem className='worker-card' key={i} data-aos='fade-up'>
              {anim === 'congrats' && (
                <Lottie
                  className='worker-card-congrats'
                  animationData={congrats}
                  loop={false}
                />
              )}
              {anim === 'outstanding' && (
                <Lottie
                  className='worker-card-congrats'
                  animationData={outstanding}
                  loop={false}
                />
              )}
              <div className='worker-card-name'>
                {w.name} - {w.type}
              </div>
              <div>
                <div>
                  <em>{w.part}</em>
                </div>
                <div className='worker-card-length'>
                  <em>Length: {formatCap(w.splitLength)}</em>
                </div>
              </div>
              <div className='worker-card-date'>
                <em>Received: {new Date(w.dateReceived).toDateString()}</em>
              </div>
              <div className='worker-card-date'>
                <em>
                  {w.done &&
                    w.dateReturned &&
                    `Returned: ${new Date(w.dateReturned).toDateString()}`}
                </em>
              </div>
              <div className='worker-card-capacity worker-card-font-style'>
                Capacity: {formatCap(w.capacity)}
              </div>
              <div className='worker-card-font-style'>
                Work Done: {formatCap(w.workdone)}
              </div>
            </FlexItem>
          );
        })}
      </FlexWrapper>
    </FlexItemWrapper>
  );
};

const FlexItemWrapper = styled(FlexItem)`
  padding: 10px;
`;

const WorkerTitle = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 5px 5px 5px;
  font-weight: 700;
  font-size: 20px;
`;

const FlexWrapper = styled(Flex)`
  margin-top: 0;
  gap: 1em;

  .worker-card {
    position: relative;
    background-color: #264653;
    color: white;
  }
  .worker-card-congrats {
    position: absolute;
    top: 1px;
    right: 1px;
    width: max(15%, 100px);
  }
  .worker-card-name {
    font-weight: 700;
    border-bottom: 1px solid gray;
  }

  .worker-card-length,
  .worker-card-date,
  .worker-card-capacity,
  .worker-card-font-style {
    font-size: 14px;
  }
  .worker-card-capacity {
    border-top: 1px solid gray;
  }
`;

export default IssuedReturned;
