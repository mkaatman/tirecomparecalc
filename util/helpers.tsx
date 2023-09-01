import {tire, TireDataForm, HeightLimits} from "../types/tire";

type SidewallHeightUnit = "inch" | "mm";

export function calculateSideWallHeight(aspectRatio: number, width: number, unit: SidewallHeightUnit = "inch"): number {
  const INCH_PER_MM: number = 0.03937008;
  const PRECISION: number = 2;
  
  const sideWallHeight: number = aspectRatio / 100 * width;
  const convertedHeight: number = unit === "inch" ? sideWallHeight * INCH_PER_MM : sideWallHeight;
  return Number(Number(convertedHeight).toFixed(PRECISION));
}

export function calculateTireHeight({ width, aspectRatio, wheelDiameter }: tire): number {
  const MM_PER_INCH: number = 25.4;
  return +((width * aspectRatio / 100 * 2 / MM_PER_INCH) + wheelDiameter).toFixed(2);
}

type RevsUnit = "inch" | "cm";

export function calculateRevs({ unit, value }: { value: number; unit: RevsUnit }) {
  const CONVERSION_FACTORS: Record<"inch" | "cm", { unit: "mile" | "km"; factor: number }> = {
      inch: { unit: "mile", factor: 63360 },
      cm: { unit: "km", factor: 100000 },
  };

  const conversion = CONVERSION_FACTORS[unit];
  if (!conversion) {
      throw new Error("Invalid unit");
  }

  const revs = conversion.factor / value;

  return {
      value: +revs.toFixed(2),
      unit: conversion.unit,
  };
}

interface circumference {
  unit: "cm" | "inch";
  value: number;
}

export function calculateCircumference({ diameter, diameterUnit }: { diameter: number; diameterUnit: "cm" | "inch" }, circumferenceUnit: "cm" | "inch" = "inch"): circumference {
  const CM_PER_INCH: number = 2.54;
  const INCH_PER_CM: number = 0.3937008;
  const π: number = Math.PI;

  const convertedDiameter: number =
      diameterUnit === circumferenceUnit
          ? diameter
          : diameterUnit === "inch"
          ? diameter * CM_PER_INCH
          : diameter * INCH_PER_CM;

  const circumference: number = convertedDiameter * π;

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
    .filter(i => i % Math.round(step) === 0)
    .map(v => start + v * direction);
}

export function listTiresPerWheelDiameter(
  min: TireDataForm,
  max: TireDataForm,
  wheelDiameter: number,
  heightLimits: HeightLimits = {min: min.heightLimit, max: max.heightLimit}
): tire[] {
  const items: tire[] = [];

  for (let width = min.width; width <= max.width; width += 5) {
      if (width % 10 === 0) {
          continue;
      }

      for (
          let aspectRatio = min.aspectRatio;
          aspectRatio <= max.aspectRatio;
          aspectRatio += 5
      ) {
          const height = calculateTireHeight({
              width,
              aspectRatio,
              wheelDiameter,
          });

          if (
              height > heightLimits.min &&
              height < heightLimits.max
          ) {
              items.push({
                  width,
                  aspectRatio,
                  wheelDiameter,
                  height
              });
          }
      }
  }

  items.sort((a, b) => (a.height && b.height && a.height < b.height ? -1 : 1));

  return items;
}
