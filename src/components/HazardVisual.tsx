import type { ReactNode } from "react";
import type { HazardSceneType } from "../data/hazards";

export type { HazardSceneType } from "../data/hazards";

export const hazardSceneTypes = [
  "sand-collapse",
  "offshore-current",
  "bluff-fall",
  "evacuation-wave",
  "coastal-storm",
  "windborne-object",
  "structural-failure",
  "tow-system",
  "unexpected-surge",
] as const satisfies readonly HazardSceneType[];

export interface HazardVisualProps {
  sceneType: HazardSceneType;
  className?: string;
  label?: string;
  decorative?: boolean;
}

const sceneLabels: Record<HazardSceneType, string> = {
  "sand-collapse": "An unstable sand hole collapsing inward",
  "offshore-current": "A narrow current flowing away from the beach",
  "bluff-fall": "A cracked sea bluff dropping loose rock",
  "evacuation-wave": "A large wave approaching a withdrawn shoreline",
  "coastal-storm": "A storm cloud and lightning bolt above the beach",
  "windborne-object": "A beach umbrella lifted by strong wind",
  "structural-failure": "A damaged pier breaking above rough water",
  "tow-system": "A parasail connected to a boat by a tow line",
  "unexpected-surge": "A sudden large wave rising behind a calm shoreline",
};

const scenes: Record<HazardSceneType, ReactNode> = {
  "sand-collapse": (
    <div className="hazard-scene hazard-scene--sand-collapse">
      <span className="hazard-scene__sky" />
      <span className="hazard-scene__sand-field hazard-scene__sand-field--back" />
      <span className="hazard-scene__pit-rim" />
      <span className="hazard-scene__pit" />
      <span className="hazard-scene__sand-slide hazard-scene__sand-slide--left" />
      <span className="hazard-scene__sand-slide hazard-scene__sand-slide--right" />
      <span className="hazard-scene__sand-grain hazard-scene__sand-grain--one" />
      <span className="hazard-scene__sand-grain hazard-scene__sand-grain--two" />
      <span className="hazard-scene__sand-grain hazard-scene__sand-grain--three" />
      <span className="hazard-scene__sand-grain hazard-scene__sand-grain--four" />
      <span className="hazard-scene__sand-field hazard-scene__sand-field--front" />
    </div>
  ),
  "offshore-current": (
    <div className="hazard-scene hazard-scene--offshore-current">
      <span className="hazard-scene__water-field" />
      <span className="hazard-scene__shore" />
      <span className="hazard-scene__breaker hazard-scene__breaker--one" />
      <span className="hazard-scene__breaker hazard-scene__breaker--two" />
      <span className="hazard-scene__breaker hazard-scene__breaker--three" />
      <span className="hazard-scene__current-channel" />
      <span className="hazard-scene__current-flow hazard-scene__current-flow--one" />
      <span className="hazard-scene__current-flow hazard-scene__current-flow--two" />
      <span className="hazard-scene__current-flow hazard-scene__current-flow--three" />
      <span className="hazard-scene__current-head" />
    </div>
  ),
  "bluff-fall": (
    <div className="hazard-scene hazard-scene--bluff-fall">
      <span className="hazard-scene__sky" />
      <span className="hazard-scene__sea" />
      <span className="hazard-scene__cliff" />
      <span className="hazard-scene__cliff-cap" />
      <span className="hazard-scene__cliff-crack hazard-scene__cliff-crack--one" />
      <span className="hazard-scene__cliff-crack hazard-scene__cliff-crack--two" />
      <span className="hazard-scene__falling-rock hazard-scene__falling-rock--one" />
      <span className="hazard-scene__falling-rock hazard-scene__falling-rock--two" />
      <span className="hazard-scene__falling-rock hazard-scene__falling-rock--three" />
      <span className="hazard-scene__rock-dust" />
    </div>
  ),
  "evacuation-wave": (
    <div className="hazard-scene hazard-scene--evacuation-wave">
      <span className="hazard-scene__sky" />
      <span className="hazard-scene__sun-disc" />
      <span className="hazard-scene__withdrawn-sea" />
      <span className="hazard-scene__exposed-shore" />
      <span className="hazard-scene__tsunami-wave" />
      <span className="hazard-scene__wave-curl" />
      <span className="hazard-scene__wave-foam hazard-scene__wave-foam--one" />
      <span className="hazard-scene__wave-foam hazard-scene__wave-foam--two" />
      <span className="hazard-scene__wave-foam hazard-scene__wave-foam--three" />
      <span className="hazard-scene__retreat-line hazard-scene__retreat-line--one" />
      <span className="hazard-scene__retreat-line hazard-scene__retreat-line--two" />
      <span className="hazard-scene__inland-path" />
      <span className="hazard-scene__inland-path-head" />
    </div>
  ),
  "coastal-storm": (
    <div className="hazard-scene hazard-scene--coastal-storm">
      <span className="hazard-scene__storm-sky" />
      <span className="hazard-scene__beach-strip" />
      <span className="hazard-scene__storm-cloud hazard-scene__storm-cloud--one" />
      <span className="hazard-scene__storm-cloud hazard-scene__storm-cloud--two" />
      <span className="hazard-scene__storm-cloud hazard-scene__storm-cloud--three" />
      <span className="hazard-scene__lightning-bolt" />
      <span className="hazard-scene__rain-line hazard-scene__rain-line--one" />
      <span className="hazard-scene__rain-line hazard-scene__rain-line--two" />
      <span className="hazard-scene__rain-line hazard-scene__rain-line--three" />
      <span className="hazard-scene__rain-line hazard-scene__rain-line--four" />
      <span className="hazard-scene__strike-glow" />
    </div>
  ),
  "windborne-object": (
    <div className="hazard-scene hazard-scene--windborne-object">
      <span className="hazard-scene__sky" />
      <span className="hazard-scene__sand-field" />
      <span className="hazard-scene__umbrella-canopy" />
      <span className="hazard-scene__umbrella-panel hazard-scene__umbrella-panel--one" />
      <span className="hazard-scene__umbrella-panel hazard-scene__umbrella-panel--two" />
      <span className="hazard-scene__umbrella-panel hazard-scene__umbrella-panel--three" />
      <span className="hazard-scene__umbrella-pole" />
      <span className="hazard-scene__wind-line hazard-scene__wind-line--one" />
      <span className="hazard-scene__wind-line hazard-scene__wind-line--two" />
      <span className="hazard-scene__wind-line hazard-scene__wind-line--three" />
      <span className="hazard-scene__wind-grain hazard-scene__wind-grain--one" />
      <span className="hazard-scene__wind-grain hazard-scene__wind-grain--two" />
      <span className="hazard-scene__wind-grain hazard-scene__wind-grain--three" />
    </div>
  ),
  "structural-failure": (
    <div className="hazard-scene hazard-scene--structural-failure">
      <span className="hazard-scene__sky" />
      <span className="hazard-scene__rough-water" />
      <span className="hazard-scene__pier-deck hazard-scene__pier-deck--left" />
      <span className="hazard-scene__pier-deck hazard-scene__pier-deck--right" />
      <span className="hazard-scene__pier-support hazard-scene__pier-support--one" />
      <span className="hazard-scene__pier-support hazard-scene__pier-support--two" />
      <span className="hazard-scene__pier-support hazard-scene__pier-support--three" />
      <span className="hazard-scene__pier-support hazard-scene__pier-support--broken" />
      <span className="hazard-scene__broken-board hazard-scene__broken-board--one" />
      <span className="hazard-scene__broken-board hazard-scene__broken-board--two" />
      <span className="hazard-scene__rough-wave hazard-scene__rough-wave--one" />
      <span className="hazard-scene__rough-wave hazard-scene__rough-wave--two" />
    </div>
  ),
  "tow-system": (
    <div className="hazard-scene hazard-scene--tow-system">
      <span className="hazard-scene__sky" />
      <span className="hazard-scene__sea" />
      <span className="hazard-scene__parasail-canopy" />
      <span className="hazard-scene__parasail-cell hazard-scene__parasail-cell--one" />
      <span className="hazard-scene__parasail-cell hazard-scene__parasail-cell--two" />
      <span className="hazard-scene__parasail-cell hazard-scene__parasail-cell--three" />
      <span className="hazard-scene__parasail-cell hazard-scene__parasail-cell--four" />
      <span className="hazard-scene__parasail-cord hazard-scene__parasail-cord--left" />
      <span className="hazard-scene__parasail-cord hazard-scene__parasail-cord--right" />
      <span className="hazard-scene__parasailer-head" />
      <span className="hazard-scene__parasailer-body" />
      <span className="hazard-scene__tow-line" />
      <span className="hazard-scene__boat-hull" />
      <span className="hazard-scene__boat-cabin" />
      <span className="hazard-scene__boat-wake" />
    </div>
  ),
  "unexpected-surge": (
    <div className="hazard-scene hazard-scene--unexpected-surge">
      <span className="hazard-scene__sky" />
      <span className="hazard-scene__sand-field" />
      <span className="hazard-scene__calm-water" />
      <span className="hazard-scene__calm-line hazard-scene__calm-line--one" />
      <span className="hazard-scene__calm-line hazard-scene__calm-line--two" />
      <span className="hazard-scene__sneaker-wave" />
      <span className="hazard-scene__sneaker-crest" />
      <span className="hazard-scene__sneaker-foam hazard-scene__sneaker-foam--one" />
      <span className="hazard-scene__sneaker-foam hazard-scene__sneaker-foam--two" />
      <span className="hazard-scene__sneaker-foam hazard-scene__sneaker-foam--three" />
      <span className="hazard-scene__surge-shadow" />
    </div>
  ),
};

export function HazardVisual({
  sceneType,
  className,
  label,
  decorative = false,
}: HazardVisualProps) {
  const classes = ["hazard-visual", `hazard-visual--${sceneType}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <figure
      className={classes}
      data-scene-type={sceneType}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : (label ?? sceneLabels[sceneType])}
    >
      <div className="hazard-visual__frame">{scenes[sceneType]}</div>
      <span className="hazard-visual__rim" aria-hidden="true" />
      <span className="hazard-visual__glint" aria-hidden="true" />
    </figure>
  );
}

export default HazardVisual;
