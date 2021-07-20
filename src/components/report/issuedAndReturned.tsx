import React from "react";
import { Worker } from "../../types";
import { Flex, Title } from "./flex";
import IRCard from "../cards/issuedAndReturnedCard";

export interface IssuedReturnedProps {
  issued: Worker[];
  returned: Worker[];
  outstanding: Worker[];
}

const IssuedReturned: React.FC<IssuedReturnedProps> = (props) => {
  const { issued, returned, outstanding } = props;

  const list = [
    { title: "Working [Ts]", workers: issued.filter((w) => w.type === "T") },
    { title: "Working [TEs]", workers: issued.filter((w) => w.type === "TE") },
    { title: "Returned [Ts]", workers: returned.filter((w) => w.type === "T") },
    {
      title: "Returned [TEs]",
      workers: returned.filter((w) => w.type === "TE"),
    },
    {
      title: "Outstanding [Ts]",
      workers: outstanding.filter((w) => w.type === "T"),
    },
    {
      title: "Outstanding [TEs]",
      workers: outstanding.filter((w) => w.type === "TE"),
    },
  ];

  return (
    <div>
      <Title>Working and Returned</Title>
      <Flex>
        {list.map(({ title, workers }, i) => (
          <IRCard key={i} title={title} workers={workers} />
        ))}
      </Flex>
    </div>
  );
};

export default IssuedReturned;
