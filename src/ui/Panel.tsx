import {ReactNode, CSSProperties, PropsWithChildren} from "react";
import "./Panel.css";

type Props = PropsWithChildren<{
  styles?: CSSProperties;
  header?: ReactNode;
  footer?: ReactNode;
}>;

export function Panel({ header, children, footer, styles }: Props) {
  return <div className="panel" style={{ ...styles }}>
    {header && <div className="panelHeader">{header}</div>}
    <div>{children}</div>
    {footer && <div className="panelFooter">{footer}</div>}
  </div>;
}

export default Panel;