import {useState, useMemo} from 'react';
import {tire, TireDataForm} from "../types/tire";
import TireForm from "./components/TireForm";
import TireHeight from "./components/TireHeight";
import TireComparisonTable from "./components/TireComparisonTable";
import SpeedometerComparisonTable from './components/SpeedometerComparisonTable';
import TireHeightTable from './components/TireHeightTable';
import { Panel } from './ui/Panel';

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
    if(tires[0]) params.set("selectedTire1", `${tires[0].width}/${tires[0].aspectRatio}/${tires[0].wheelDiameter}`);
    if(tires[1]) params.set("selectedTire2", `${tires[1].width}/${tires[1].aspectRatio}/${tires[1].wheelDiameter}`);
    params.set("tire1", `${minTireData.width}/${minTireData.aspectRatio}/${minTireData.wheelDiameter}/${minTireData.heightLimit}`);
    params.set("tire2", `${maxTireData.width}/${maxTireData.aspectRatio}/${maxTireData.wheelDiameter}/${maxTireData.heightLimit}`);
    window.location.hash = params.toString();
  }, [tires, minTireData, maxTireData]);

  const changeTires = (tires: tire[]) => [...tires.slice(1, tires.length), tires[0]];
console.warn(tires);
  return (
    <main style={{width: "850px", margin: "auto"}}>
      <h2 style={{fontWeight: "500", fontSize: "30px"}}>Tire Size and Height Comparison Calculator</h2>
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

export default App;
