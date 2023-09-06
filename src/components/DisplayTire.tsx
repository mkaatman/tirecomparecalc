import { calculateTireHeight } from '../../util/helpers';
import { MouseEventHandler } from 'react';
import { Tire } from '../../types/tire';

interface DisplayTire extends Omit<Tire, 'height'> {
  onClick?: MouseEventHandler<HTMLSpanElement>;
}

export default function DisplayTire({
  width,
  aspectRatio,
  wheelDiameter,
  onClick,
}: DisplayTire) {
  return (
    <span className="tire" onClick={onClick}>
      <span>{`${width}/${aspectRatio}R`}</span>
      <span style={{ color: '#f00' }}>{wheelDiameter}</span>
      <span>{` ⇔ ${calculateTireHeight({
        width,
        aspectRatio,
        wheelDiameter,
      })}"`}</span>
    </span>
  );
}
