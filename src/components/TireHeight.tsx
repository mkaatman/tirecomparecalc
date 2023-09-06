import { calculateTireHeight } from '../../util/helpers';
import { TireDataForm } from '../../types/tire';

export default function TireHeight({ values }: { values: TireDataForm }) {
  return <span>Tire Height: {calculateTireHeight(values)}&quot;</span>;
}
