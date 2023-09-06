import { Tire, TireDataForm } from '../../types/tire';
import { listTiresPerWheelDiameter } from '../../util/helpers';
import Panel from '../ui/Panel';
import TireHeightColumn from './TireHeightColumn';

interface TireHeightTableProps {
  min: TireDataForm;
  max: TireDataForm;
  onSelect: React.Dispatch<React.SetStateAction<Tire[]>>;
  tires: Tire[];
}

// List all tires that fit within the minimum and maximum height, 1 column per wheel size
export default function TireHeightTable({
  min,
  max,
  onSelect,
  tires,
}: TireHeightTableProps) {
  const diameterRange = [
    ...Array(max.wheelDiameter - min.wheelDiameter + 1).keys(),
  ].map((x) => x + min.wheelDiameter);
  const tireCount = diameterRange
    .map(
      (wheelDiameter) =>
        listTiresPerWheelDiameter(min, max, wheelDiameter).length
    )
    .reduce((a, b) => a + b, 0);

  return (
    <Panel
      header={<span>Select two tires for comparison: {tireCount} results</span>}
    >
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {diameterRange.map((wheelDiameter) => (
          <TireHeightColumn
            onSelect={onSelect}
            tires={tires}
            key={wheelDiameter}
            items={listTiresPerWheelDiameter(min, max, wheelDiameter)}
          />
        ))}
      </div>
    </Panel>
  );
}
