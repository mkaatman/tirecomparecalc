import {useState, useCallback, ChangeEventHandler, useMemo} from 'react';
import {calculateTireHeight, calculateCircumference, calculateRevs, calculateSideWallHeight, range} from '../util/helpers';
import {tire} from "../types/tire";
import { Panel } from './ui/Panel';
import { Card } from './ui/Card';

interface HeightLimits {
  min: number;
  max: number;
}

interface TireDataForm extends tire {
  heightLimit: number;
}

function App() {
  const checkMax = (max: TireDataForm, min: TireDataForm) =>
    max.width >= min.width &&
    max.aspectRatio >= min.aspectRatio &&
    max.wheelDiameter >= min.wheelDiameter &&
    max.heightLimit >= min.heightLimit;

  const setMax = (values: TireDataForm): boolean | void => checkMax(values, minTireData) && setMaxTireData(values);
  const setMin = (values: TireDataForm): boolean | void => checkMax(maxTireData, values) && setMinTireData(values);

  const [minTireData, setMinTireData] = useState<TireDataForm>({
    width: 245,
    aspectRatio: 30,
    wheelDiameter: 16,
    heightLimit: 24,
  });
  
  const [maxTireData, setMaxTireData] = useState<TireDataForm>({
    width: 295,
    aspectRatio: 50,
    wheelDiameter: 18,
    heightLimit: 26,
  });

  const [tires, setTires] = useState<tire[]>([
    minTireData,
    maxTireData,
  ]);
  // console.log("App", tires, minTireData);

  // Run once to grab parameters from hash
  useMemo(() => {
    function tireFormFromHash(hash = '') {
      if(!hash) return;
      const tire = hash.split("/");
      return {
        aspectRatio: +tire[1],
        heightLimit: +tire[3],
        width: +tire[0],
        wheelDiameter: +tire[2]
      };
    }
  
    function selectedTireFromHash(hash = '') {
      if(!hash) return;
      const selectedTire = hash.split("/");
      return {
        width: +selectedTire[0],
        aspectRatio: +selectedTire[1],
        wheelDiameter: +selectedTire[2]
      };
    }

    const params = new URLSearchParams(window.location.hash.substring(1));
    const tireData1 = tireFormFromHash(params.get("tire1") || "");
    const tireData2 = tireFormFromHash(params.get("tire2") || "");
    const selectedTireData1 = selectedTireFromHash(params.get("selectedTire1") || "");
    const selectedTireData2 = selectedTireFromHash(params.get("selectedTire2") || "");
    
    tireData1 && setMinTireData(tireData1);
    tireData2 && setMaxTireData(tireData2);
    selectedTireData1 && selectedTireData2 && setTires([selectedTireData1, selectedTireData2]);
  }, []);

  // Update hash when tires or form data change
  useMemo(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    if(tires[0]) params.set("selectedTire1", tires[0].width + "/" + tires[0].aspectRatio + "/" + tires[0].wheelDiameter);
    if(tires[1]) params.set("selectedTire2", tires[1].width + "/" + tires[1].aspectRatio + "/" + tires[1].wheelDiameter);
    params.set("tire1", minTireData.width + "/" + minTireData.aspectRatio + "/" + minTireData.wheelDiameter + "/" + minTireData.heightLimit);
    params.set("tire2", maxTireData.width + "/" + maxTireData.aspectRatio + "/" + maxTireData.wheelDiameter + "/" + maxTireData.heightLimit);
    window.location.hash = params.toString();
  }, [tires, minTireData, maxTireData]);

  const changeTires = (tires: tire[]) => [...tires.slice(1, tires.length), tires[0]];

  return (
    <main style={{width: "850px", margin: "auto"}}>
      <h2 style={{fontWeight: "500", fontSize: "30px"}}>Tire Size and Height Calculator</h2>
      <Panel header={<span>Compare tires by size and calculate revolutions per unit of distance.</span>}>
        <div style={{display: "flex", flexDirection: "row", gap: "8px", padding: "0 8px"}}>
          <Panel header={<span>Minimum <TireHeight values={minTireData} /></span>}>
            <TireForm
              label="Minimum"
              onChange={setMin}
              formValues={minTireData}
            />
          </Panel>
          <Panel header={<span>Maximum <TireHeight values={maxTireData} /></span>}>
            <TireForm
              label="Maximum"
              onChange={setMax}
              formValues={maxTireData}
            />
          </Panel>
        </div>
      </Panel>
      <TireHeightTable min={minTireData} max={maxTireData} onSelect={setTires} tires={tires} />
      {tires[0] && tires[1] && <Panel 
          header={<div style={{display: "flex"}}>
            <div>Tire Comparison</div>
            <div style={{marginLeft: "auto"}}><button onClick={() => setTires(changeTires)}>Swap</button></div>
          </div>} 
          footer="Please note all values are nominal. Tire pressure, temperature, weight and RPM factor into actual measurements.">
          <TireComparisonTable tires={tires} />
          <div style={{display: "flex", flexDirection: "row", gap: "8px", padding: "0 8px"}}>
            <SpeedometerComparisonTable tires={tires} />
          </div>
        </Panel>
      }
    </main>
  );
}

interface tireFormProps {
  onChange: (values: TireDataForm) => boolean | void;
  formValues: TireDataForm;
  label: string;
}

// Form that allows you to enter tire specifications
function TireForm({onChange, formValues, label}: tireFormProps) {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(event => {
    if(onChange) {
      onChange({...formValues, [(event.target as HTMLInputElement).name]: +(event.target as HTMLInputElement).value});
    }
  }, [formValues, onChange]);
  return <form style={{marginTop: "8px", marginLeft: "8px", marginBottom: "8px"}}>
          <div className="form-row">
            <input className="form-control" name="width" type="number" required step="5" placeholder=" " value={formValues.width} onChange={handleChange} title={`The ${label.toLowerCase()} tire section width that you're interested in`} />
            <label>Tire Width (mm)</label>
          </div>
          <div className="form-row">
            <input name="aspectRatio" className="form-control" type="number" required step="5" placeholder=" " value={formValues.aspectRatio} onChange={handleChange} title={`The ${label.toLowerCase()} percentage of the tire width that equals the sidewall height`} />
            <label>Aspect Ratio (sidewall height)</label>
          </div>
          <div className="form-row">
            <input name="wheelDiameter" className="form-control" type="number" required placeholder=" " value={formValues.wheelDiameter} onChange={handleChange} title={`The ${label.toLowerCase()} height of the wheel`} />
            <label>Wheel Diameter (inches)</label>
          </div>
          <div className="form-row">
            <input name="heightLimit" className="form-control" type="number" required placeholder=" " value={formValues.heightLimit} onChange={handleChange} title={`Filter the results with a ${label.toLowerCase()} height`} />
            <label>Height Limit (inches)</label>
          </div>
        </form>;
}

function DisplayTire({width, aspectRatio, wheelDiameter}: tire, handleClick: () => void) {
  return <span className="tire" onClick={() => handleClick()}>
      <span>{`${width}/${aspectRatio}R`}</span>
      <span style={{color: "#f00"}}>{wheelDiameter}</span>
      <span>{` ⇔ ${calculateTireHeight({width, aspectRatio, wheelDiameter})}"`}</span>
    </span>;
}

function TireHeight({values}: {values: TireDataForm}) {
  return <span>Tire Height: {calculateTireHeight(values)}&quot;</span>;
}

interface tireHeightColumn {
  items: tire[];
  onSelect?: React.Dispatch<React.SetStateAction<tire[]>>;
  tires: tire[];
}

function TireHeightColumn({items, onSelect, tires}: tireHeightColumn) {
  const handleChange = useCallback((tires: tire[]) => {
    if(onSelect) onSelect([...tires]);
  }, [onSelect]);
  let background = "";
  return <div style={{display: "flex", flexDirection: "column", padding: "8px"}}>
    {items.map((tire, index) => {
      background = "";
      if(JSON.stringify(tires[0]) === JSON.stringify(tire)) background = "tire1";
      if(JSON.stringify(tires[1]) === JSON.stringify(tire)) background = "tire2";
      return <div className={background} key={index + JSON.stringify(tire)}>
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


// List all tires that fit within the minimum and maximum height, 1 column per wheel size
function TireHeightTable({min, max, onSelect, tires}: {min: TireDataForm, max: TireDataForm, onSelect: React.Dispatch<React.SetStateAction<tire[]>>, tires: tire[]}) {
    const diameterRange = [...Array(max.wheelDiameter - min.wheelDiameter + 1).keys()].map(x => x + min.wheelDiameter);
    const tireCount = diameterRange.map(wheelDiameter => listTiresPerWheelDiameter(min, max, wheelDiameter).length).reduce((a, b) => a + b, 0);
    return <Panel header={<span>Select two tires for comparison: {tireCount} results</span>}>
      <div style={{display: "flex", flexDirection: "row"}}>
        {diameterRange.map(wheelDiameter =>
            <TireHeightColumn onSelect={onSelect} tires={tires} key={wheelDiameter} items={listTiresPerWheelDiameter(min, max, wheelDiameter)} />
        )}
      </div>
    </Panel>;
}

// Once two tires are selected from the TireHeightTable compare specs side by side
function TireComparisonTable({tires}: {tires: tire[]}): JSX.Element {
  // console.warn("TireComparisonTable", tires, " length ", tires.length);
  return <div style={{display: "flex", flexDirection: "row", gap: "8px", padding: "0 8px"}}>
    {tires.map((tire, index: number) => 
      {
        return tire && <TireSpecifications index={index} key={index + JSON.stringify(tire)} tire={tire}/>;
      }
    )}
  </div>;
}

// Sub-display of specifications per tire
function TireSpecifications({tire, index}: {tire: tire, index: number}) {
  const MM_PER_INCH = 0.03937008;
  const INCHES_PER_CM = 2.54;

  // console.log("TireSpecifications", tire);
  return <Card header={<span>Tire: {DisplayTire(tire, () => {})}</span>}>
    <div style={{display: "flex", flexDirection: "column", padding: "0 8px", paddingBottom: "8px"}}  className={"tire"+(index+1)}>
      <table style={{borderCollapse: "collapse"}}>
        <tbody>
          <tr style={{borderTop: "1px solid #ddd"}}><th style={{padding: "8px", textAlign: "right"}}>Width</th><td>{(tire.width * MM_PER_INCH).toFixed(2)}" ({tire.width} mm)</td></tr>
          <tr style={{borderTop: "1px solid #ddd"}}><th style={{padding: "8px", textAlign: "right"}}>Diameter</th><td>{calculateTireHeight(tire)}" ({(calculateTireHeight(tire) || 0 * INCHES_PER_CM).toFixed(2)} cm)</td></tr>
          <tr style={{borderTop: "1px solid #ddd"}}><th style={{padding: "8px", textAlign: "right"}}>Sidewall</th><td>{calculateSideWallHeight(tire.aspectRatio, tire.width, "inch")}" ({(calculateSideWallHeight(tire.aspectRatio, tire.width, "mm")).toFixed(2)} mm)</td></tr>
          <tr style={{borderTop: "1px solid #ddd"}}><th style={{padding: "8px", textAlign: "right"}}>C=dπ</th><td>{calculateCircumference({diameter: calculateTireHeight(tire) || 0, diameterUnit: "inch"}).value}" ({(calculateCircumference({diameter: calculateTireHeight(tire) || 0, diameterUnit: "inch"}).value * INCHES_PER_CM).toFixed(2)} cm)</td></tr>
          <tr style={{borderTop: "1px solid #ddd"}}><th style={{padding: "8px", textAlign: "right"}}>Revs</th><td>{calculateRevs(calculateCircumference({diameter: calculateTireHeight(tire) || 1, diameterUnit: "inch"})).value}/mile ({(calculateRevs(calculateCircumference({diameter: calculateTireHeight(tire) || 1, diameterUnit: "inch"}, "cm")).value).toFixed(2)}/km)</td></tr>
        </tbody>
      </table>
    </div>
  </Card>
}

// Compares speedometer for two tires per every 10 mph
function SpeedometerComparisonTable({tires}: {tires: tire[]}) {
  return <Card header="Speedometer comparison (mph or km/h)">
      <table style={{width: "100%", borderCollapse: "collapse"}}>
        <tbody>
          <tr style={{borderTop: "1px solid #ddd"}} className="tire1"><th style={{padding: "8px"}}>Tire 1</th><td>10</td><td>20</td><td>30</td><td>40</td><td>50</td><td>60</td><td>70</td><td>80</td><td>90</td><td>100</td></tr>
          {tires.map((tire: tire, index: number) =>
            {
              return (index > 0 && tire) && <tr key={JSON.stringify(tire)} style={{borderTop: "1px solid #ddd"}} className="tire2">
                <th style={{padding: "8px"}}>Tire {index + 1}</th>
                {range(10, 101, 10).map(speed => <td key={speed}>{((calculateTireHeight(tires[0]) || 1 - (calculateTireHeight(tires[1]) || 1)) / (calculateTireHeight(tires[1]) || 1) * speed + speed).toFixed(2)}</td>)}
              </tr>;
            })
          }
        </tbody>
      </table>
    </Card>;
}

function listTiresPerWheelDiameter(
  min: TireDataForm,
  max: TireDataForm,
  wheelDiameter: number,
  heightLimits: HeightLimits = {min: min.heightLimit, max: max.heightLimit}
): tire[] {
  const items: tire[] = [];

  for (let width = min.width; width <= max.width; width += 5) {
      if (width % 10 === 0) {
          continue;
      }

      for (
          let aspectRatio = min.aspectRatio;
          aspectRatio <= max.aspectRatio;
          aspectRatio += 5
      ) {
          const height = calculateTireHeight({
              width,
              aspectRatio,
              wheelDiameter,
          });

          if (
              height > heightLimits.min &&
              height < heightLimits.max
          ) {
              items.push({
                  width,
                  aspectRatio,
                  wheelDiameter,
                  height
              });
          }
      }
  }

  items.sort((a, b) => (a.height && b.height && a.height < b.height ? -1 : 1));

  return items;
}

export default App;
