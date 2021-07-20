import styled from "styled-components";
import { FlexItem, Flex } from "../report/flex";
import { Link } from "react-router-dom";
import { getImage } from "../../utils/report";
import { getAnim } from "../../utils/getAnim";
import LottieWrap from "../commons/lottieWrap";
import { formatCap, isThisWeek } from "../../utils";
import { congrats, outstanding } from "../../media";
import { Worker } from "../../types";

export interface ReturnedCardProps {
  title: string;
  workers: Worker[];
}

const IRCard: React.FC<ReturnedCardProps> = ({ title, workers }) => {
  const { length } = workers;

  if (length === 0) return null;

  const sorted = workers
    .sort((a, b) => a.part.localeCompare(b.part))
    .sort((a, b) => a.type.localeCompare(b.type));

  const getAnimation = (worker: Worker) => {
    if (worker.done && !isThisWeek(new Date(worker.dateReceived)))
      return "outstanding";
    if (worker.done && worker.workdone >= worker.capacity) return "congrats";
    return "none";
  };

  const handlePrint = ({ name }: Worker) => {
    const el = document.querySelector(
      `.worker-card-btn.${name}`
    ) as HTMLButtonElement;

    if (el) el.style.display = "none";

    getImage(name, name).then(() => {
      if (el) el.style.display = "block";
    });
  };

  return (
    // <FlexItemWrapper>
    <FlexItemWrapper data-aos={getAnim("fade")}>
      <WorkerTitle>
        <div>{title}</div> <div>[{length}]</div>
      </WorkerTitle>
      <FlexWrapper>
        {sorted.map((w, i) => {
          const anim = getAnimation(w);
          return (
            <FlexItem
              className="worker-card"
              key={i}
              data-aos={getAnim("fade-up")}
              id={w.name}
            >
              <LottieWrap
                className="worker-card-lottie"
                data={congrats}
                display={anim === "congrats"}
              />
              <LottieWrap
                className="worker-card-lottie outstanding"
                data={outstanding}
                display={anim === "outstanding"}
              />
              <div className="worker-card-name">
                {w.name} - {w.type}
              </div>
              <div>
                <div>
                  <em>{w.part}</em>
                </div>
                <div className="worker-card-length">
                  <em>Length: {formatCap(w.splitLength)}</em>
                </div>
              </div>
              <div className="worker-card-date">
                <em>Received: {new Date(w.dateReceived).toDateString()}</em>
              </div>
              <div className="worker-card-date">
                <em>
                  {w.done &&
                    w.dateReturned &&
                    `Returned: ${new Date(w.dateReturned).toDateString()}`}
                </em>
              </div>
              <div className="worker-card-capacity worker-card-font-style">
                Capacity: {formatCap(w.capacity)}
              </div>
              <div className="worker-card-font-style">
                Work Done: {formatCap(w.workdone)}
              </div>
              <div
                className="btn btn-group btn-group-sm worker-card-btn-div"
                data-aos={getAnim("fade-right")}
              >
                <button
                  className={`btn btn-primary btn-sm worker-card-btn ${w.name}`}
                  onClick={() => handlePrint(w)}
                >
                  Print
                </button>
                <Link
                  className="btn btn-primary btn-sm worker-card-btn"
                  to={`/assignments/${w.msguid}`}
                >
                  Open
                </Link>
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
  .worker-card-lottie {
    position: absolute;
    top: 1px;
    right: 1px;
    width: 100px;
  }
  .worker-card-lottie.outstanding {
    width: 80px;
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
  .worker-card-btn-div {
    position: absolute;
    bottom: 4px;
    right: 1px;
  }
`;

export default IRCard;
