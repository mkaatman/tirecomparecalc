
export type tire = {
    width: number, // Tread width stored in mm
    aspectRatio: number, // The height of the tire sidewall compared with the tire width. It is represented as a percentage of the tire width.
    wheelDiameter: number, // Wheel diameter stored in inches
    height?: number
  }
  
export interface HeightLimits {
    min: number;
    max: number;
}

export interface TireDataForm extends tire {
    heightLimit: number;
}