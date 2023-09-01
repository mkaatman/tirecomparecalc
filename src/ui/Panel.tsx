import {ReactNode, CSSProperties, ReactElement} from "react";
import "./Panel.css";

export function Panel({ header, children, footer, styles }: {header?: ReactNode, children: ReactElement | ReactElement[], footer?: ReactNode, styles?: CSSProperties}) {
  return <div className="panel" style={{ ...styles }}>
    {header && <div className="panelHeader">{header}</div>}
    <div>{children}</div>
    {footer && <div className="panelFooter">{footer}</div>}
  </div>;
}

export default Panel;