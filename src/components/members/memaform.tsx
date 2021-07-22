import { useState } from "react";
import FormContainer from "../common/formHolder";
import { ActionButtonHolder, NameInput, Select } from "../assignment/inputs";
import TimeInput from "../assignment/timeInput";
import { hmsToSeconds } from "../../utils";

export interface AddProps {
  onAdd: (object: any) => void;
  setShow: (value: any) => void;
  show: any;
}

const initial = {
  name: "",
  capacity: {
    h: "00",
    m: "00",
    s: "00",
  },
  type: "T" as "T" | "TE",
};

const Add: React.FC<AddProps> = (props) => {
  const { setShow, show, onAdd } = props;

  const [data, setData] = useState(initial);
  const { name, capacity, type } = data;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { h, m, s } = data.capacity;
    const capacity = hmsToSeconds(h, m, s);
    onAdd({ ...data, capacity, name: data.name.trim() });
  };

  const containerProps = {
    setShow,
    show,
    spin: false,
  };

  return (
    <FormContainer props={containerProps}>
      <form onSubmit={handleSubmit} className="form">
        <NameInput
          value={name}
          placeholder={`Member's name`}
          setName={(name) => setData({ ...data, name })}
        />
        <TimeInput
          placeholder="Capacity (H:M:S)"
          time={capacity}
          setTime={(type, value) =>
            setData({ ...data, capacity: { ...data.capacity, [type]: value } })
          }
        />
        <Select
          value={type}
          values={[
            ["T", "Transcriber"],
            ["TE", "Transcript Editor"],
          ]}
          label="Type"
          onChange={(value) => setData({ ...data, type: value as any })}
        />
        <ActionButtonHolder value="add" />
      </form>
    </FormContainer>
  );
};

export default Add;
