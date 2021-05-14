import styled from 'styled-components';
import { MdDeleteForever } from 'react-icons/md';
import { FaPenSquare, FaToggleOn } from 'react-icons/fa';

type Type = 'delete' | 'update' | 'mark';

const getIcon = (type: Type) => {
  return type === 'delete'
    ? MdDeleteForever
    : type === 'update'
    ? FaPenSquare
    : FaToggleOn;
};

export interface BadgeProps {
  color:
    | 'warning'
    | 'danger'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'dark'
    | 'light'
    | 'info';
  text?: string;
  classes?: string;
  type?: Type;
}

export interface DisplayBadge extends BadgeProps {
  count: number;
}

export interface ClickBadgeI extends BadgeProps {
  onClick: () => void;
}

const Badge: React.FC<DisplayBadge> = (props: DisplayBadge) => {
  const { color, text, count } = props;

  return (
    <span className={`badge bg-${color}`}>
      {text}: {count}
    </span>
  );
};

const ClickBadge: React.FC<ClickBadgeI> = (props: ClickBadgeI) => {
  const { color, onClick, type } = props;

  const Icon = getIcon(type as Type);

  return (
    <Span>
      <Icon className={`fading-3 badge-${color}`} onClick={onClick} />
    </Span>
  );
};

export const DeleteBadge: React.FC<ClickBadgeI> = (props) => {
  return <MdDeleteForever className='badge-danger' onClick={props.onClick} />;
};

const Span = styled.span`
  & * {
    cursor: pointer;
    margin: 3px;
    font-size: 22px;
  }
`;

export { Badge, ClickBadge };
