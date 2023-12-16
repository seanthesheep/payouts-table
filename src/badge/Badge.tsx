import styled from "styled-components";

enum Status {
  Pending = "Pending",
  Completed = "Completed",
}

const statusBackgrounds: Record<Status, string> = {
  [Status.Pending]: "rgba(111, 118, 126, 0.40)",
  [Status.Completed]: "#60CA57",
};

const statusText: Record<Status, string> = {
  [Status.Pending]: "Pending",
  [Status.Completed]: "Paid",
};

interface IBadgeProps {
  status: Status | string;
}

const BadgeContainer = styled.div<{ background: string }>`
  border-radius: 6px;
  color: #1A1D1F;
  text-align: center;
  padding: 2px 8px;
  width: max-content;
  background: ${props => props.background};
`;

/** 
 *  Badge - displays status
 *  @param status: string "Pending" | "Completed"
 * */
const Badge = ({ status }: IBadgeProps) => {
  const mappedStatus = statusText[status as Status] || status;

  return (
    <BadgeContainer background={statusBackgrounds[status as Status]}>{mappedStatus}</BadgeContainer>
  );
};

export default Badge;
