import {useCallback, ChangeEventHandler} from 'react';
import {TireDataForm} from "../../types/tire";

interface tireFormProps {
  onChange: (values: TireDataForm) => boolean | void;
  formValues: TireDataForm;
  label: string;
}

// Form that allows you to enter tire specifications
export default function TireForm({onChange, formValues, label}: tireFormProps) {
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