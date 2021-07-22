import SumCard from "./cards/messageSummaryCard";
import { MemberI, Worker } from "../types";
import { isThisWeek, getTeamCapacity } from "../utils";
import { getWorkersCapacity } from "../utils/worker";
import { Flex, Title } from "./report/flex";

export interface SummaryProps {
  members: MemberI[];
  issuedThisWeek: Worker[];
  issuedPreviousWeeks: Worker[];
  returnedThisWeek: Worker[];
}

const Summary: React.FC<SummaryProps> = (props) => {
  const { members, issuedPreviousWeeks, issuedThisWeek, returnedThisWeek } =
    props;

  const ipw_rdw = returnedThisWeek.filter(
    (w) => !isThisWeek(new Date(w.dateReceived))
  );

  const idw_rdw = returnedThisWeek.filter((worker) =>
    isThisWeek(new Date(worker.dateReceived))
  );

  const teamCapacity = getTeamCapacity(members);
  const idw = getWorkersCapacity([...issuedThisWeek, ...idw_rdw]); // idw: issued this week
  const rdw = getWorkersCapacity(returnedThisWeek); // rdw: returned this week
  const ipw = getWorkersCapacity([...issuedPreviousWeeks, ...ipw_rdw]); // ipw: issued previous week(s)

  return (
    <div>
      <Title>Summary</Title>
      <Flex>
        <SumCard
          title={`Team's Capacity`}
          items={[
            ["Transcribers", teamCapacity.ts],
            ["Transcript Editors", teamCapacity.tes],
          ]}
        />
        <SumCard
          title={`Transcribers`}
          items={[
            ["Issued", `${idw.tc} + ${ipw.tc}`],
            ["Returned", `${rdw.tc}`],
          ]}
          animation="flip-left"
        />
        <SumCard
          title={`Transcript Editors`}
          items={[
            ["Issued", `${idw.tec} + ${ipw.tec}`],
            ["Returned", `${rdw.tec}`],
          ]}
          animation="flip-right"
        />
      </Flex>
    </div>
  );
};

export default Summary;
