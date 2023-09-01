import {ReactNode, CSSProperties, ReactElement} from "react";
import "./Card.css";

export function Card({ header, children, styles }: {header?: ReactNode, children: ReactElement | ReactElement[], styles?: CSSProperties}) {
  return <div className="card" style={{ ...styles }}>
    <div className="cardHeader">{header}</div>
    <div>{children}</div>
  </div>;
}

export default Card;