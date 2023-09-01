import {tire} from "../../types/tire";
import TireSpecifications from "./TireSpecifications";

// Once two tires are selected from the TireHeightTable compare specs side by side
export default function TireComparisonTable({tires}: {tires: tire[]}): JSX.Element {
    // console.warn("TireComparisonTable", tires, " length ", tires.length);
    return <div style={{display: "flex", flexDirection: "row", gap: "8px", padding: "0 8px"}}>
        {tires.map((tire, index: number) => 
        {
            return tire && <TireSpecifications index={index} key={index + JSON.stringify(tire)} tire={tire}/>;
        }
        )}
    </div>;
}
  