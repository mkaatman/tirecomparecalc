import {ReactNode, CSSProperties, PropsWithChildren} from "react";

type Props = PropsWithChildren<{
  styles?: CSSProperties;
  header?: ReactNode;
}>;

import "./Card.css";

export function Card({ header, children, styles }: Props) {
  return <div className="card" style={{ ...styles }}>
    <div className="cardHeader">{header}</div>
    <div>{children}</div>
  </div>;
}

export default Card;