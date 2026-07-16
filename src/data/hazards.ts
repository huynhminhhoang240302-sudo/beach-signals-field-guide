export type HazardId =
  | "sand-hole-collapse"
  | "rip-current"
  | "cliff-collapse"
  | "tsunami"
  | "lightning"
  | "flying-umbrella"
  | "pier-collapse"
  | "parasailing-accident"
  | "sneaker-wave";

export type HazardIcon =
  | "Shovel"
  | "Waves"
  | "Mountain"
  | "Siren"
  | "CloudLightning"
  | "Umbrella"
  | "Construction"
  | "Parachute";

export type HazardSceneType =
  | "sand-collapse"
  | "offshore-current"
  | "bluff-fall"
  | "evacuation-wave"
  | "coastal-storm"
  | "windborne-object"
  | "structural-failure"
  | "tow-system"
  | "unexpected-surge";

export type MascotReaction =
  | "neutral"
  | "confident-pointing"
  | "surprised"
  | "worried"
  | "warning"
  | "moving-away"
  | "relieved";

export interface HazardVisualMetadata {
  /** Short category label used above a title or beside an icon. */
  eyebrow: string;
  /** An observable environmental clue to emphasize in the scene. */
  warningSign: string;
  /** Accessible description for the decorative scene or canvas fallback. */
  sceneDescription: string;
  /** Directions for a simple, non-graphic explanatory overlay. */
  diagramHint: string;
  /** Small ambient motions that can be disabled for reduced motion. */
  motionCues: readonly string[];
  /** Scene-specific framing of the supplied mascot image. */
  mascotCue: string;
  /** Desktop orbit placement; mobile layouts can ignore these values. */
  orbit: {
    angle: number;
    radius: number;
    elevation: number;
  };
}

export interface Hazard {
  id: HazardId;
  title: string;
  shortDescription: string;
  cinematicOpening: string;
  dangerExplanation: string;
  safetyAction: string;
  icon: HazardIcon;
  sceneType: HazardSceneType;
  mascotReaction: MascotReaction;
  accentColor: `#${string}`;
  visual?: HazardVisualMetadata;
}

export const hazards = [
  {
    id: "sand-hole-collapse",
    title: "Sand-Hole Collapse",
    shortDescription:
      "Deep holes can lose their shape and fold inward without warning.",
    cinematicOpening: "The beach shifts quietly—then the walls give way.",
    dangerExplanation:
      "Loose sand is heavy and can rapidly refill a deep hole, making it hard to move or breathe.",
    safetyAction:
      "Keep holes shallow, supervise children, and fill every hole before leaving.",
    icon: "Shovel",
    sceneType: "sand-collapse",
    mascotReaction: "surprised",
    accentColor: "#f0ca72",
    visual: {
      eyebrow: "UNSTABLE SAND",
      warningSign: "Steep, crumbling walls around a deep pit",
      sceneDescription:
        "A stylized sand pit sheds small layers inward while the mascot steps back.",
      diagramHint: "Use inward arrows along the walls and a shallow safe-depth line.",
      motionCues: ["falling sand grains", "soft inward wall shift"],
      mascotCue: "Crop wide and tilt slightly away with a small surprise mark.",
      orbit: { angle: -78, radius: 1.04, elevation: 0.18 },
    },
  },
  {
    id: "rip-current",
    title: "Rip Current",
    shortDescription:
      "A fast channel of water can carry swimmers away from shore.",
    cinematicOpening: "One dark lane cuts through the breaking waves.",
    dangerExplanation:
      "Fighting the current directly can cause exhaustion even though the current does not pull a swimmer underwater.",
    safetyAction:
      "Stay calm, float and signal for help; if able, swim parallel to shore before returning at an angle.",
    icon: "Waves",
    sceneType: "offshore-current",
    mascotReaction: "confident-pointing",
    accentColor: "#18aeea",
    visual: {
      eyebrow: "MOVING WATER",
      warningSign: "A darker, calmer-looking gap between breaking waves",
      sceneDescription:
        "A top-down shoreline shows a narrow blue flow moving offshore as the mascot points sideways.",
      diagramHint: "Show offshore flow arrows plus a clear parallel-to-shore escape route.",
      motionCues: ["offshore current stream", "sideways escape arrows"],
      mascotCue: "Frame the raised hand toward the sideways escape arrows.",
      orbit: { angle: -38, radius: 0.96, elevation: -0.06 },
    },
  },
  {
    id: "cliff-collapse",
    title: "Cliff Collapse",
    shortDescription:
      "Coastal bluffs can release rock and sand from above or fail beneath an edge.",
    cinematicOpening: "A thin crack is the only warning the bluff may give.",
    dangerExplanation:
      "Rain, waves and erosion can weaken a cliff beyond what is visible from the beach.",
    safetyAction:
      "Stay well back from cliff edges and bases, and obey closures and warning signs.",
    icon: "Mountain",
    sceneType: "bluff-fall",
    mascotReaction: "moving-away",
    accentColor: "#c89a3c",
    visual: {
      eyebrow: "UNSTABLE GROUND",
      warningSign: "Fresh cracks, falling pebbles or an undercut cliff face",
      sceneDescription:
        "A simplified cracked bluff drops a few harmless debris shapes while the mascot retreats.",
      diagramHint: "Mark both the cliff edge and the fall zone at its base as keep-clear areas.",
      motionCues: ["widening hairline crack", "slow debris drift"],
      mascotCue: "Shift the mascot away from the bluff and add a warning chevron.",
      orbit: { angle: 2, radius: 1.08, elevation: 0.14 },
    },
  },
  {
    id: "tsunami",
    title: "Tsunami",
    shortDescription:
      "A strong quake or sudden water withdrawal can signal waves that reach far inland.",
    cinematicOpening: "The shoreline pulls back farther than the tide ever should.",
    dangerExplanation:
      "Tsunami waves can arrive quickly, carry powerful debris-filled currents and continue in a series for hours.",
    safetyAction:
      "After a natural warning, go immediately to high ground or inland and wait for the official all-clear.",
    icon: "Siren",
    sceneType: "evacuation-wave",
    mascotReaction: "moving-away",
    accentColor: "#18aeea",
    visual: {
      eyebrow: "NATURAL WARNING",
      warningSign: "Strong or long shaking, a sudden sea retreat, or a loud ocean roar",
      sceneDescription:
        "A receded shoreline reveals the seabed, with a distant wave and bright inland route arrows.",
      diagramHint: "Keep the wave distant and make the inland or uphill evacuation path dominant.",
      motionCues: ["receding waterline", "pulsing evacuation route"],
      mascotCue: "Slide the mascot inland with an urgent forward lean.",
      orbit: { angle: 42, radius: 1, elevation: -0.12 },
    },
  },
  {
    id: "lightning",
    title: "Lightning",
    shortDescription:
      "Open sand and water offer little protection when a storm approaches.",
    cinematicOpening: "Thunder rolls across a beach with nowhere to hide.",
    dangerExplanation:
      "Lightning can strike beyond the rain area, and water, wet ground and exposed objects can conduct current.",
    safetyAction:
      "At the first thunder, enter a substantial building or hard-topped vehicle and wait 30 minutes after the last thunder.",
    icon: "CloudLightning",
    sceneType: "coastal-storm",
    mascotReaction: "worried",
    accentColor: "#f0ca72",
    visual: {
      eyebrow: "CHANGING WEATHER",
      warningSign: "Darkening clouds, distant thunder or an alert from officials",
      sceneDescription:
        "A dark cloud hangs over an empty stylized beach while the mascot moves toward shelter.",
      diagramHint: "Connect a storm cloud to a shelter icon without using a flashing effect.",
      motionCues: ["slow cloud drift", "single soft light pulse"],
      mascotCue: "Lower the mascot in frame and direct its movement toward shelter.",
      orbit: { angle: 82, radius: 1.06, elevation: 0.2 },
    },
  },
  {
    id: "flying-umbrella",
    title: "Flying Beach Umbrella",
    shortDescription:
      "A sudden gust can turn an unsecured umbrella into a fast-moving hazard.",
    cinematicOpening: "The wind changes—and the shade begins to lift.",
    dangerExplanation:
      "A broad canopy catches wind easily, pulling a poorly anchored pole across a crowded beach.",
    safetyAction:
      "Close and lower the umbrella when wind rises, and use an anchor rated for the conditions.",
    icon: "Umbrella",
    sceneType: "windborne-object",
    mascotReaction: "surprised",
    accentColor: "#c89a3c",
    visual: {
      eyebrow: "STRONG WIND",
      warningSign: "Snapping fabric, blowing sand or an umbrella beginning to wobble",
      sceneDescription:
        "A closed-off beach vignette shows a stylized umbrella lifting as the mascot ducks safely aside.",
      diagramHint: "Use curved wind trails and highlight the anchor point at the sand.",
      motionCues: ["curved wind lines", "light canopy wobble", "sand streaks"],
      mascotCue: "Crop the mascot low with a short downward ducking motion.",
      orbit: { angle: 122, radius: 0.98, elevation: -0.1 },
    },
  },
  {
    id: "pier-collapse",
    title: "Pier Collapse",
    shortDescription:
      "Storm damage, decay or overloading can make a pier unsafe before failure is obvious.",
    cinematicOpening: "Below the boards, one support no longer carries its share.",
    dangerExplanation:
      "Damaged decking and supports can shift over rough water, creating falls and unstable escape routes.",
    safetyAction:
      "Respect barriers, leave if a pier shifts or looks damaged, and report concerns to local authorities.",
    icon: "Construction",
    sceneType: "structural-failure",
    mascotReaction: "warning",
    accentColor: "#f0ca72",
    visual: {
      eyebrow: "DAMAGED STRUCTURE",
      warningSign: "Closed access, cracked boards, leaning rails or moving supports",
      sceneDescription:
        "A simplified pier reveals a cracked support above rough waves while the mascot points from a safe distance.",
      diagramHint: "Highlight one support and trace its load path up to the deck.",
      motionCues: ["gentle deck shift", "waves beneath supports"],
      mascotCue: "Aim the mascot's raised hand toward the damaged support, outside the barrier.",
      orbit: { angle: 162, radius: 1.09, elevation: 0.12 },
    },
  },
  {
    id: "parasailing-accident",
    title: "Parasailing Accident",
    shortDescription:
      "Safe parasailing depends on suitable weather, sound equipment and a trained operator.",
    cinematicOpening: "Every safe flight begins with the line still on the deck.",
    dangerExplanation:
      "Strong wind, equipment failure or poor operating decisions can make launch, flight and landing difficult to control.",
    safetyAction:
      "Choose a licensed, reputable operator, check the weather and equipment briefing, and do not launch if conditions feel unsafe.",
    icon: "Parachute",
    sceneType: "tow-system",
    mascotReaction: "worried",
    accentColor: "#c89a3c",
    visual: {
      eyebrow: "ACTIVITY SAFETY",
      warningSign: "Strong or shifting wind, damaged gear, or a rushed safety briefing",
      sceneDescription:
        "A clean diagram links a boat, tow line and parasail while the mascot inspects the connection point.",
      diagramHint: "Show the boat, continuous tow line, harness and canopy as four simple connected parts.",
      motionCues: ["subtle canopy float", "tow-line tension sweep"],
      mascotCue: "Place the mascot beside the line connection with a focused inspection mark.",
      orbit: { angle: 202, radius: 1.01, elevation: -0.16 },
    },
  },
  {
    id: "sneaker-wave",
    title: "Sneaker Wave",
    shortDescription:
      "A single wave can surge much farther up the shore than the waves before it.",
    cinematicOpening: "The water looks settled—until one wave crosses every old line.",
    dangerExplanation:
      "An unexpected surge can knock people down, move heavy driftwood and pull them into cold, rough water.",
    safetyAction:
      "Stay back from the water's edge, never turn your back on the ocean and move uphill if a surge approaches.",
    icon: "Waves",
    sceneType: "unexpected-surge",
    mascotReaction: "surprised",
    accentColor: "#18aeea",
    visual: {
      eyebrow: "UNEXPECTED SURGE",
      warningSign: "Long pauses or calm-looking water on a beach known for powerful surf",
      sceneDescription:
        "A calm foreground is overtaken by one broad stylized surge as the mascot steps uphill.",
      diagramHint: "Contrast several ordinary wave lines with one longer run-up line.",
      motionCues: ["long wave build", "fast but smooth run-up line"],
      mascotCue: "Shift the mascot upward and back with one restrained surprise mark.",
      orbit: { angle: 242, radius: 1.05, elevation: 0.08 },
    },
  },
] as const satisfies readonly Hazard[];

export const getHazardById = (id: HazardId): Hazard | undefined =>
  hazards.find((hazard) => hazard.id === id);

export default hazards;
