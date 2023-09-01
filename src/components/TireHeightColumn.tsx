import {useCallback} from 'react';
import {tire} from "../../types/tire";
import DisplayTire from "./DisplayTire";

interface tireHeightColumn {
    items: tire[];
    onSelect?: React.Dispatch<React.SetStateAction<tire[]>>;
    tires: tire[];
  }
  
export default function TireHeightColumn({items, onSelect, tires}: tireHeightColumn) {
    const handleChange = useCallback((tires: tire[]) => {
        if(onSelect) onSelect([...tires]);
    }, [onSelect]);
    let background = "";
    return <div style={{display: "flex", flexDirection: "column", padding: "8px"}}>
        {items.map((tire, index) => {
        background = "";
        if(JSON.stringify(tires[0]) === JSON.stringify(tire)) background = "tire1";
        if(JSON.stringify(tires[1]) === JSON.stringify(tire)) background = "tire2";
        return <div className={background} style={{cursor: "pointer"}} key={index + JSON.stringify(tire)}>
            {DisplayTire(tire, () => {
                tires.shift();
                tires.push(tire);
                // console.log("setTires", tires);
                handleChange(tires);
            })}
        </div>
        })}
    </div>
}
  