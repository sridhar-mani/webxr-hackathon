# Agent Architecture

## Principle
The agent is not a chatbot floating over the application. It operates on structured wardrobe state and can manipulate the spatial environment.

## State
- User profile: body measurements, fit preference, style preferences.
- Wardrobe: garments, sizes, measurements, metadata.
- Session: selected garment, avatar, outfit, current mode.
- Memory: worn outfits, rejected suggestions, saved outfits, learned preferences.

## Typed tools
```
searchWardrobe(filters)
inspectGarment(id)
compareGarments(a,b)
calculateFit(user,garment)
startVirtualTryOn(garment,size)
startCameraTryOn(garment,size)
replaceOutfitItem(slot,garment)
buildOutfit(context)
packForTrip(days,context)
saveOutfit(outfit)
markWorn(outfit)
getWardrobeStats()
```

## Agent loop
**request → intent → context → tool selection → reasoning → spatial actions → execution → explanation**

The model should return structured actions, not arbitrary Three.js mutations.

Example:
```json
{
  "actions": [
    {"type":"bringForward","garmentId":"shirt-blue"},
    {"type":"openFitCard","garmentId":"shirt-blue"},
    {"type":"tryOn","garmentId":"shirt-blue","size":"M"},
    {"type":"highlightRegion","region":"sleeve"}
  ]
}
```

The renderer validates and executes these actions.

## Recommendation inputs
- occasion
- weather/context when available
- fit
- color/style compatibility
- wear history
- wardrobe coverage
- user preference

## Structured memory
Prefer events over raw conversation logs:
- WORE_ITEM
- REJECTED_FIT
- SAVED_OUTFIT
- PREFERRED_COLOR
- PREFERRED_FIT
- TRIP_PACKED

## Body-data boundary
Body measurements and camera-derived landmarks are user-controlled application data. Keep the model focused on garment/outfit reasoning and avoid making health or medical inferences.

## Agentic interaction goal
A successful agent interaction visibly changes the spatial environment. Example:
> "Give me something less formal."

The agent filters the wardrobe, brings candidates forward, opens the selected fit card, and optionally starts try-on.
