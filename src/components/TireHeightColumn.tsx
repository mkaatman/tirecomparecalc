import { useCallback } from 'react';
import { Tire } from '../../types/tire';
import DisplayTire from './DisplayTire';

interface TireHeightColumnProps {
  items: Tire[];
  onSelect?: React.Dispatch<React.SetStateAction<Tire[]>>;
  tires: Tire[];
}

export default function TireHeightColumn({
  items,
  onSelect,
  tires,
}: TireHeightColumnProps) {
  const handleChange = useCallback(
    (tires: Tire[]) => {
      onSelect?.([...tires]);
    },
    [onSelect]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}>
      {items.map((tire, index) => {
        let background = '';
        if (JSON.stringify(tires[0]) === JSON.stringify(tire))
          background = 'tire1';
        if (JSON.stringify(tires[1]) === JSON.stringify(tire))
          background = 'tire2';
        return (
          <div
            className={background}
            style={{ cursor: 'pointer' }}
            key={index + JSON.stringify(tire)}
          >
            <DisplayTire
              {...tire}
              onClick={() => {
                tires.shift();
                tires.push(tire);
                handleChange(tires);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
