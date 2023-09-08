import { Tire } from '../../types/tire';
import { calculateTireHeight, range } from '../../util/helpers';
import Card from '../ui/Card';

interface SpeedometerComparisonTableProps {
  tires: Tire[];
}

// Compares speedometer for two tires per every 10 mph
export default function SpeedometerComparisonTable({
  tires,
}: SpeedometerComparisonTableProps) {
  return (
    <Card header="Speedometer comparison (mph or km/h)">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr style={{ borderTop: '1px solid #ddd' }} className="tire1">
            <th style={{ padding: '8px' }}>Tire 1</th>
            <td>10</td>
            <td>20</td>
            <td>30</td>
            <td>40</td>
            <td>50</td>
            <td>60</td>
            <td>70</td>
            <td>80</td>
            <td>90</td>
            <td>100</td>
          </tr>
          {tires.slice(1).map(
            (tire, index) =>
              tire && (
                <tr
                  key={JSON.stringify(tire)}
                  style={{ borderTop: '1px solid #ddd' }}
                  className="tire2"
                >
                  <th style={{ padding: '8px' }}>Tire {index + 1}</th>
                  {range(10, 101, 10).map((speed) => {
                    const tire1Height = calculateTireHeight(tires[0]);
                    const tire2Height = calculateTireHeight(tires[1]);
                    return (
                      <td key={speed}>
                        {(
                          ((tire1Height - tire2Height) / tire2Height) * speed +
                          speed
                        ).toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              )
          )}
        </tbody>
      </table>
    </Card>
  );
}
