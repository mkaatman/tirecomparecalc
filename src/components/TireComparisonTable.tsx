import { Tire } from '../../types/tire';
import TireSpecifications from './TireSpecifications';

interface TireComparisonTableProps {
  tires: Tire[];
}

// Once two tires are selected from the TireHeightTable compare specs side by side
export default function TireComparisonTable({
  tires,
}: TireComparisonTableProps) {
  // console.warn("TireComparisonTable", tires, " length ", tires.length);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        padding: '0 8px',
      }}
    >
      {tires.map(
        (tire, index) =>
          tire && (
            <TireSpecifications
              index={index}
              key={index + JSON.stringify(tire)}
              tire={tire}
            />
          )
      )}
    </div>
  );
}
