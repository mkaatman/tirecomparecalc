import {
  Tire,
  TireDataForm,
  HeightLimits,
  RevsUnit,
  SidewallHeightUnit,
} from '../types/tire';

export function calculateSideWallHeight(
  aspectRatio: number,
  width: number,
  unit: SidewallHeightUnit = 'inch'
): number {
  const INCH_PER_MM = 0.03937008;
  const PRECISION = 2;

  const sideWallHeight = (aspectRatio / 100) * width;
  const convertedHeight =
    unit === 'inch' ? sideWallHeight * INCH_PER_MM : sideWallHeight;
  return Number(Number(convertedHeight).toFixed(PRECISION));
}

export function calculateTireHeight({
  width,
  aspectRatio,
  wheelDiameter,
}: Omit<Tire, 'height'>): number {
  const MM_PER_INCH: number = 25.4;
  return +(
    (((width * aspectRatio) / 100) * 2) / MM_PER_INCH +
    wheelDiameter
  ).toFixed(2);
}

export function calculateRevs({
  unit,
  value,
}: {
  value: number;
  unit: RevsUnit;
}) {
  const CONVERSION_FACTORS: Record<
    RevsUnit,
    { unit: 'mile' | 'km'; factor: number }
  > = {
    inch: { unit: 'mile', factor: 63360 },
    cm: { unit: 'km', factor: 100000 },
  };

  const conversion = CONVERSION_FACTORS[unit];
  if (!conversion) {
    throw new Error('Invalid unit');
  }

  const revs = conversion.factor / value;

  return {
    value: +revs.toFixed(2),
    unit: conversion.unit,
  };
}

interface circumference {
  unit: RevsUnit;
  value: number;
}

export function calculateCircumference(
  { diameter, diameterUnit }: { diameter: number; diameterUnit: RevsUnit },
  circumferenceUnit: RevsUnit = 'inch'
): circumference {
  const CM_PER_INCH = 2.54;
  const INCH_PER_CM = 0.3937008;
  const π = Math.PI;

  let convertedDiameter = diameter;

  if (diameterUnit !== circumferenceUnit) {
    convertedDiameter =
      diameter * (diameterUnit === 'inch' ? CM_PER_INCH : INCH_PER_CM);
  }

  const circumference = convertedDiameter * π;

  return {
    value: +circumference.toFixed(2),
    unit: circumferenceUnit,
  };
}

// Generates a range of numbers with a step
export function range(start: number, stop: number, step = 1) {
  if (step < 1) return [];

  const length = Math.abs(stop - start);
  const direction = start < stop ? 1 : -1;

  return [...Array(length).keys()]
    .filter((i) => i % Math.round(step) === 0)
    .map((v) => start + v * direction);
}

export function listTiresPerWheelDiameter(
  min: TireDataForm,
  max: TireDataForm,
  wheelDiameter: number,
): Tire[] {
  const widthRange = Array.from(
    { length: (max.width - min.width) / 5 + 1 },
    (_, index) => min.width + index * 5
  ).filter((width) => width % 10 !== 0);

  const aspectRatioRange = Array.from(
    { length: (max.aspectRatio - min.aspectRatio) / 5 + 1 },
    (_, index) => min.aspectRatio + index * 5
  );

  const tireCombinations = widthRange.flatMap((width) =>
    aspectRatioRange.map((aspectRatio) => ({
      width,
      aspectRatio,
      wheelDiameter,
      height: calculateTireHeight({ width, aspectRatio, wheelDiameter }),
    }))
  );

 return tireCombinations
  .filter((tire) => tire.height > min.heightLimit && tire.height < max.heightLimit)
  .sort((a, b) => (a.height && b.height && a.height < b.height ? -1 : 1));
}
