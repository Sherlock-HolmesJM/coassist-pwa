import styled from "styled-components";
import { getAnim } from "../../utils/getAnim";
import { FlexItem } from "../report/flex";
import { useHistory } from "react-router-dom";

interface SumCardProps {
  title: string;
  items: [string, string][];
  animation?: string;
  id?: string | number;
}

const SumCard: React.FC<SumCardProps> = (props) => {
  const { title, items, animation, id } = props;
  const renderButten = items.length > 2;

  const history = useHistory();

  const handleOpen = (id: any) => {
    history.push(`/assignments/${id}`);
  };

  return (
    <FlexItemWrap data-aos={getAnim(animation ?? "flip-down")}>
      <div className="card-title-div">
        <h6 className="card-title">{title.toUpperCase()}</h6>
        {renderButten && (
          <button
            className="btn btn-primary btn-sm card-open"
            onClick={() => handleOpen(id)}
          >
            Open
          </button>
        )}
      </div>
      {items.map((item, index) => (
        <div className="card-totals-container" key={index}>
          <em className="card-total">{item[0]}</em>
          <em className="card-total">{item[1]}</em>
        </div>
      ))}
    </FlexItemWrap>
  );
};

const FlexItemWrap = styled(FlexItem)`
  flex-grow: 0;
  background-color: #264653;
  color: #fff;
  border-bottom: 3px solid black;

  .card-title-div {
    position: relative;
  }

  .card-open {
    position: absolute;
    top: -5px;
    right: 3px;
  }

  .card-title {
    text-transform: uppercase;
  }
  .card-totals-container {
    display: flex;
    justify-content: space-between;
    border-top: 2px solid gray;
    border-radius: 5px;
  }
  .card-total {
    display: block;
    text-transform: capitalize;
    padding: 5px 0;
  }
  .card-total:last-child {
    flex-basis: 52%;
    padding-left: 5px;
    text-align: left;
    border-left: 1px solid gray;
  }
`;

export default SumCard;
