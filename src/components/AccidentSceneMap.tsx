"use client";

import type { CSSProperties } from "react";
import { hazards } from "@/src/data/hazards";
import { HazardGlyph } from "./hazardIcons";

type MarkerStyle = CSSProperties & {
  "--marker-x": string;
  "--marker-y": string;
};

const markerPositions = [
  [72, 72],
  [25, 58],
  [88, 48],
  [11, 34],
  [62, 18],
  [67, 49],
  [48, 57],
  [39, 25],
  [15, 69],
] as const;

export function AccidentSceneMap({ onJump }: { onJump: (target: string) => void }) {
  return (
    <div className="accident-scene-map" aria-label="Illustrated beach scene with nine clickable accident locations">
      <div className="accident-scene-map__art" aria-hidden="true">
        <div className="accident-scene-map__sky" />
        <div className="accident-scene-map__sun" />
        <div className="accident-scene-map__cloud accident-scene-map__cloud--one"><i /><i /></div>
        <div className="accident-scene-map__cloud accident-scene-map__cloud--storm"><i /><i /></div>
        <div className="accident-scene-map__lightning" />

        <div className="accident-scene-map__ocean">
          <i /><i /><i /><i /><i />
        </div>
        <div className="accident-scene-map__rip"><i /><i /><i /></div>
        <div className="accident-scene-map__tsunami" />
        <div className="accident-scene-map__sneaker" />

        <div className="accident-scene-map__sand" />
        <div className="accident-scene-map__shore" />
        <div className="accident-scene-map__cliff"><i /><i /></div>
        <div className="accident-scene-map__pier"><i /><i /><i /><i /></div>
        <div className="accident-scene-map__hole" />
        <div className="accident-scene-map__umbrella"><i /></div>
        <div className="accident-scene-map__parasail"><i /><span /></div>
      </div>

      <div className="accident-scene-map__markers">
        {hazards.map((hazard, index) => {
          const [x, y] = markerPositions[index];
          return (
            <button
              key={hazard.id}
              type="button"
              className="accident-marker"
              style={{ "--marker-x": `${x}%`, "--marker-y": `${y}%` } as MarkerStyle}
              onClick={() => onJump(`story-${hazard.id}`)}
              aria-label={`Jump to ${hazard.title}`}
            >
              <span className="accident-marker__pin">
                <HazardGlyph name={hazard.icon} aria-hidden="true" />
              </span>
              <strong>{hazard.title}</strong>
            </button>
          );
        })}
      </div>

    </div>
  );
}

export default AccidentSceneMap;
