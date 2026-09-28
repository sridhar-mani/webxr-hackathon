# Experience Flow

## Spatial layout
The application is a compact virtual dressing space:

```
                  PERSONAL AGENT
                         |
       +-----------------+-----------------+
       |                 |                 |
   WARDROBE          FIT LAB         OUTFIT LAB
       |                 |                 |
       +-----------------+-----------------+
                         |
                    VIRTUAL MIRROR
```

Primary controls remain within comfortable seated/stationary reach.

## Wardrobe flow
**Grab → Inspect → Compare → Try On → Add to Outfit**

A selected garment shows contextual information next to the object instead of forcing the user into a full-screen menu.

## Fit Lab flow
**Select garment → select size → load avatar → fit → inspect regions → compare sizes**

Example:
- Shoulder: good
- Chest: comfortable
- Sleeve: slightly long
- Length: good

## Virtual try-on
The garment is positioned and deformed to an avatar using authored geometry, skinning and morphs. Optional cloth dynamics are layered afterward.

## Camera Virtual Mirror
**Start camera → permission → calibration → pose/segmentation → garment alignment → live preview**

Calibration asks for a neutral pose and validates that the body is sufficiently visible.

## Outfit builder
Users physically combine:
- top
- bottom
- layer
- footwear
- accessory

The agent can replace one slot without rebuilding the whole outfit.

## Agent flow
User request:
> "Show me something less formal."

Agent:
1. Parse intent.
2. Query wardrobe.
3. Apply fit/context constraints.
4. Select candidates.
5. Execute spatial actions.
6. Explain the choice.

The agent changes the environment; it is not just a chat window.

## Repeat loop
**Get dressed → save outfit → update structured memory → return tomorrow**

## Comfort
- No forced locomotion.
- No required standing.
- No rapid camera motion.
- Frequent controls stay close to the user.
- Camera mode can be exited immediately.
