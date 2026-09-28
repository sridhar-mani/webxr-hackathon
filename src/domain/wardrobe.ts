import type { GarmentMeasurements } from "./fit.js";

export type GarmentCategory = "top" | "bottom" | "layer" | "shoe";

export interface Garment {
  id: string;
  name: string;
  category: GarmentCategory;
  color: number;
  size: string;
  measurements: GarmentMeasurements;
  material: string;
  fit: "slim" | "regular" | "relaxed";
}

export interface UserProfile {
  measurements: {
    chest: number;
    waist: number;
    shoulder: number;
    sleeve: number;
    height: number;
  };
  preferredFit: "slim" | "regular" | "relaxed";
}

export const demoProfile: UserProfile = {
  measurements: {
    chest: 94,
    waist: 80,
    shoulder: 44,
    sleeve: 61,
    height: 170
  },
  preferredFit: "regular"
};

export const demoWardrobe: Garment[] = [
  {
    id: "shirt-navy",
    name: "Navy Everyday Shirt",
    category: "top",
    color: 0x243a72,
    size: "M",
    measurements: { chest: 104, waist: 98, shoulder: 45, sleeve: 61, length: 72 },
    material: "Cotton",
    fit: "regular"
  },
  {
    id: "shirt-olive",
    name: "Olive Relaxed Shirt",
    category: "top",
    color: 0x65704a,
    size: "L",
    measurements: { chest: 112, waist: 106, shoulder: 47, sleeve: 63, length: 74 },
    material: "Cotton blend",
    fit: "relaxed"
  },
  {
    id: "shirt-sand",
    name: "Sand Slim Shirt",
    category: "top",
    color: 0xb89b72,
    size: "M",
    measurements: { chest: 99, waist: 94, shoulder: 44.5, sleeve: 60, length: 70 },
    material: "Linen blend",
    fit: "slim"
  },
  {
    id: "trouser-charcoal",
    name: "Charcoal Trousers",
    category: "bottom",
    color: 0x34363d,
    size: "M",
    measurements: { chest: 0, waist: 82, shoulder: 0, sleeve: 0, length: 102 },
    material: "Wool blend",
    fit: "regular"
  }
];
