# Fit Engine and Try-On Simulation

## 1. Separate the problems
There are three different problems:

1. **Fit evaluation** — compare garment and user measurements.
2. **Geometric try-on** — place/deform a garment around a 3D avatar.
3. **Cloth dynamics** — simulate fabric motion.

The first two are required. Cloth dynamics are an enhancement.

## 2. User measurements
Minimum:
- height
- chest
- waist
- hip
- shoulder breadth
- sleeve length
- inseam
- preferred fit

## 3. Garment measurements
Minimum:
- category
- size
- chest/body circumference
- shoulder
- sleeve
- body length

Optional:
- stretch
- stiffness
- weight
- thickness
- drape class
- care information

## 4. Fit calculation
For a measurement:

`ease = garmentMeasurement - bodyMeasurement`

Use category-specific target ranges instead of one global threshold.

Each dimension becomes a normalized deviation:

`d_i = |measured_i - target_i| / tolerance_i`

The UI explains the contributing regions. A single score may be shown as a summary, but it is not the primary truth.

## 5. 3D avatar
Use a normalized body parameter vector:
`[height, chest, waist, hip, shoulder, armLength, legLength]`

Use one authored base garment per category plus:
- skin weights
- morph targets
- size corrective morphs
- lightweight collision correction

Do not generate a fully new garment mesh from raw measurements at runtime.

## 6. Virtual try-on
Minimum implementation:
- skin garment to avatar;
- blend/morph by body dimensions;
- apply size-specific shape changes;
- position from avatar anchors;
- show fit diagnostics.

This already gives a legitimate try-on interaction.

## 7. Cloth simulation
A full cloth solver is **not** needed for fit evaluation.

Use physics only when fabric movement materially improves the visualization.

### Verlet
Good for the first experiment: simple particle integration plus constraints.

### PBD
Better for interactive cloth constraints:
- structural
- shear
- bending
- collision

### XPBD
Preferred for a polished solver because compliance is easier to control across time steps/iterations.

### Project decision
- P0: no solver required for virtual try-on.
- P1: small PBD/Verlet prototype for one garment.
- P2: XPBD polish if performance and time permit.

Simulate at a controlled lower rate and interpolate to the XR render loop. Never make cloth simulation the critical path for every garment.

## 8. Camera try-on relationship
Camera try-on does not use the cloth solver.

The camera pipeline is primarily:
**camera → pose/segmentation → garment deformation → compositing**

Physics can later be used to produce a secondary 3D rendering, but it is not required for the live camera overlay.

## 9. Machine-readable result
```json
{
  "category": "shirt",
  "size": "M",
  "fit": "regular",
  "regions": {
    "shoulder": "good",
    "chest": "good",
    "sleeve": "long",
    "length": "good"
  },
  "confidence": 0.82
}
```

Confidence describes estimation/input confidence, not physical certainty.
