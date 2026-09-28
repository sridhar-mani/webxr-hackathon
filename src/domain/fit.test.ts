import assert from "node:assert/strict";
import test from "node:test";
import { calculateFit } from "./fit.js";

const body = {
  chest: 94,
  waist: 80,
  shoulder: 44,
  sleeve: 61,
  height: 170
};

test("regular shirt with sensible ease is classified as good", () => {
  const result = calculateFit(
    body,
    { chest: 104, waist: 98, shoulder: 45, sleeve: 61, length: 72 },
    "shirt",
    "M",
    "regular"
  );

  assert.equal(result.summary, "good");
  assert.equal(result.regions.chest.status, "good");
  assert.equal(result.regions.shoulder.status, "good");
});

test("small shirt is identified as too tight", () => {
  const result = calculateFit(
    body,
    { chest: 94, waist: 80, shoulder: 42, sleeve: 58, length: 66 },
    "shirt",
    "S",
    "regular"
  );

  assert.equal(result.summary, "too-tight");
});

test("relaxed garment is not reported as too tight", () => {
  const result = calculateFit(
    body,
    { chest: 114, waist: 108, shoulder: 48, sleeve: 65, length: 78 },
    "shirt",
    "L",
    "relaxed"
  );

  assert.notEqual(result.summary, "too-tight");
});
