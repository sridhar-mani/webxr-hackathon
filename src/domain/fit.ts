export type FitPreference = "slim" | "regular" | "relaxed";

export interface BodyMeasurements {
  chest: number;
  waist: number;
  shoulder: number;
  sleeve: number;
  height: number;
}

export interface GarmentMeasurements {
  chest: number;
  waist: number;
  shoulder: number;
  sleeve: number;
  length: number;
}

export type FitRegion = "chest" | "waist" | "shoulder" | "sleeve" | "length";
export type FitStatus = "tight" | "close" | "good" | "relaxed";

export interface FitRegionResult {
  status: FitStatus;
  ease?: number;
  delta?: number;
}

export interface FitResult {
  garmentId: string;
  size: string;
  regions: Record<FitRegion, FitRegionResult>;
  summary: "too-tight" | "good" | "relaxed";
}

const targetEase: Record<FitPreference, number> = {
  slim: 6,
  regular: 10,
  relaxed: 16
};

function classifyEase(ease: number, target: number): FitStatus {
  if (ease < target - 4) return "tight";
  if (ease < target - 1.5) return "close";
  if (ease <= target + 4) return "good";
  return "relaxed";
}

export function calculateFit(
  body: BodyMeasurements,
  garment: GarmentMeasurements,
  garmentId: string,
  size: string,
  preference: FitPreference = "regular"
): FitResult {
  const target = targetEase[preference];

  const chestEase = garment.chest - body.chest;
  const waistEase = garment.waist - body.waist;
  const shoulderDelta = garment.shoulder - body.shoulder;
  const sleeveDelta = garment.sleeve - body.sleeve;
  const lengthDelta = garment.length - Math.max(1, body.height * 0.27);

  const regions: Record<FitRegion, FitRegionResult> = {
    chest: { status: classifyEase(chestEase, target), ease: chestEase },
    waist: { status: classifyEase(waistEase, target), ease: waistEase },
    shoulder: { status: Math.abs(shoulderDelta) <= 2 ? "good" : shoulderDelta < 0 ? "tight" : "relaxed", delta: shoulderDelta },
    sleeve: { status: Math.abs(sleeveDelta) <= 3 ? "good" : sleeveDelta < 0 ? "tight" : "relaxed", delta: sleeveDelta },
    length: { status: Math.abs(lengthDelta) <= 5 ? "good" : lengthDelta < 0 ? "tight" : "relaxed", delta: lengthDelta }
  };

  const statuses = Object.values(regions).map((region) => region.status);
  const tightCount = statuses.filter((status) => status === "tight").length;
  const relaxedCount = statuses.filter((status) => status === "relaxed").length;

  return {
    garmentId,
    size,
    regions,
    summary: tightCount >= 2 ? "too-tight" : relaxedCount >= 3 ? "relaxed" : "good"
  };
}
