"use client";

import { useState } from "react";
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
  "sand-collapse": "Sand hole collapse",
  "offshore-current": "Rip current",
  "bluff-fall": "Cliff or sea bluff collapse",
  "evacuation-wave": "Tsunami at a beach event",
  "coastal-storm": "Lightning strike",
  "windborne-object": "Beach umbrella accident",
  "structural-failure": "Pier collapse",
  "tow-system": "Parasailing accident",
  "unexpected-surge": "Sneaker wave",
};

const sceneImages: Record<HazardSceneType, string> = {
  "sand-collapse": "/hazard-panels/sand-hole-collapse.png",
  "offshore-current": "/hazard-panels/rip-current.png",
  "bluff-fall": "/hazard-panels/cliff-collapse.png",
  "evacuation-wave": "/hazard-panels/tsunami.png",
  "coastal-storm": "/hazard-panels/lightning.png",
  "windborne-object": "/hazard-panels/umbrella.png",
  "structural-failure": "/hazard-panels/pier-collapse.png",
  "tow-system": "/hazard-panels/parasailing.png",
  "unexpected-surge": "/hazard-panels/sneaker-wave.png",
};

const sceneActiveImages: Record<HazardSceneType, string> = {
  "sand-collapse": "/hazard-panels-active/sand-hole-collapse-active.png",
  "offshore-current": "/hazard-panels-active/rip-current-active.png",
  "bluff-fall": "/hazard-panels-active/cliff-collapse-active.png",
  "evacuation-wave": "/hazard-panels-active/tsunami-active.png",
  "coastal-storm": "/hazard-panels-active/lightning-active.png",
  "windborne-object": "/hazard-panels-active/umbrella-active.png",
  "structural-failure": "/hazard-panels-active/pier-collapse-active.png",
  "tow-system": "/hazard-panels-active/parasailing-active.png",
  "unexpected-surge": "/hazard-panels-active/sneaker-wave-active.png",
};

function PanelContents({ sceneType }: { sceneType: HazardSceneType }) {
  return (
    <>
      <span className="hazard-visual__frame">
        {/* Native img preserves the supplied files exactly; no optimizer rewrites them. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hazard-panel__image hazard-panel__image--rest"
          src={sceneImages[sceneType]}
          alt=""
          draggable="false"
          loading="lazy"
          decoding="async"
        />
        {/* The retouched action frame replaces only the illustrated area. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hazard-panel__image hazard-panel__image--active"
          src={sceneActiveImages[sceneType]}
          alt=""
          draggable="false"
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className="hazard-panel__motion" aria-hidden="true"><i /><i /><i /></span>
      <span className="hazard-visual__rim" aria-hidden="true" />
    </>
  );
}

export function HazardVisual({
  sceneType,
  className,
  label,
  decorative = false,
}: HazardVisualProps) {
  const [active, setActive] = useState(false);
  const classes = ["hazard-visual", `hazard-visual--${sceneType}`, active && "is-active", className]
    .filter(Boolean)
    .join(" ");

  if (decorative) {
    return (
      <span className={classes} data-scene-type={sceneType} aria-hidden="true">
        <PanelContents sceneType={sceneType} />
      </span>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      data-scene-type={sceneType}
      aria-label={`${label ?? sceneLabels[sceneType]}. Tap to animate.`}
      aria-pressed={active}
      onClick={() => setActive((current) => !current)}
    >
      <PanelContents sceneType={sceneType} />
    </button>
  );
}

export default HazardVisual;
