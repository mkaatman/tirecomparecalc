import { Tire } from '../../types/tire';
import {
  calculateTireHeight,
  calculateCircumference,
  calculateRevs,
  calculateSideWallHeight,
} from '../../util/helpers';
import Card from '../ui/Card';
import DisplayTire from './DisplayTire';

interface TireSpecificationsProps {
  tire: Tire;
  index: number;
}

// Sub-display of specifications per tire
export default function TireSpecifications({
  tire,
  index,
}: TireSpecificationsProps) {
  const MM_PER_INCH = 0.03937008;
  const INCHES_PER_CM = 2.54;

  return (
    <Card
      header={
        <span>
          Tire: <DisplayTire {...tire} />{' '}
        </span>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0 8px',
          paddingBottom: '8px',
        }}
        className={'tire' + (index + 1)}
      >
        <table style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderTop: '1px solid #ddd' }}>
              <th style={{ padding: '8px', textAlign: 'right' }}>Width</th>
              <td>
                {(tire.width * MM_PER_INCH).toFixed(2)}" ({tire.width} mm)
              </td>
            </tr>
            <tr style={{ borderTop: '1px solid #ddd' }}>
              <th style={{ padding: '8px', textAlign: 'right' }}>Diameter</th>
              <td>
                {calculateTireHeight(tire)}" (
                {(calculateTireHeight(tire) || 0 * INCHES_PER_CM).toFixed(2)}{' '}
                cm)
              </td>
            </tr>
            <tr style={{ borderTop: '1px solid #ddd' }}>
              <th style={{ padding: '8px', textAlign: 'right' }}>Sidewall</th>
              <td>
                {calculateSideWallHeight(tire.aspectRatio, tire.width, 'inch')}"
                (
                {calculateSideWallHeight(
                  tire.aspectRatio,
                  tire.width,
                  'mm'
                ).toFixed(2)}{' '}
                mm)
              </td>
            </tr>
            <tr style={{ borderTop: '1px solid #ddd' }}>
              <th style={{ padding: '8px', textAlign: 'right' }}>C=dπ</th>
              <td>
                {
                  calculateCircumference({
                    diameter: calculateTireHeight(tire) || 0,
                    diameterUnit: 'inch',
                  }).value
                }
                " (
                {(
                  calculateCircumference({
                    diameter: calculateTireHeight(tire) || 0,
                    diameterUnit: 'inch',
                  }).value * INCHES_PER_CM
                ).toFixed(2)}{' '}
                cm)
              </td>
            </tr>
            <tr style={{ borderTop: '1px solid #ddd' }}>
              <th style={{ padding: '8px', textAlign: 'right' }}>Revs</th>
              <td>
                {
                  calculateRevs(
                    calculateCircumference({
                      diameter: calculateTireHeight(tire) || 1,
                      diameterUnit: 'inch',
                    })
                  ).value
                }
                /mile (
                {calculateRevs(
                  calculateCircumference(
                    {
                      diameter: calculateTireHeight(tire) || 1,
                      diameterUnit: 'inch',
                    },
                    'cm'
                  )
                ).value.toFixed(2)}
                /km)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
