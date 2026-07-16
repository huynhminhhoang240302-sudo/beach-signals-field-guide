"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { hazards, type HazardId } from "@/src/data/hazards";
import AvatarGuide from "./AvatarGuide";
import HazardCard from "./HazardCard";
import HazardVisual from "./HazardVisual";
import { HazardGlyph } from "./hazardIcons";

const orbitPositions = [[50, 4], [79, 14], [94, 44], [82, 78], [58, 92], [25, 86], [6, 61], [9, 27], [31, 9]] as const;

export function HazardOrbit() {
  const [activeId, setActiveId] = useState<HazardId>(hazards[0].id);
  const activeHazard = hazards.find((hazard) => hazard.id === activeId) ?? hazards[0];

  return (
    <section className="section orbit-section" id="hazards" aria-labelledby="orbit-title">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow"><Compass aria-hidden="true" /> Interactive field map</p>
          <h2 id="orbit-title">Nine dangers. One readable shoreline.</h2>
        </div>
        <p>Focus or hover a signal to bring it forward. Every lesson remains available as plain text below.</p>
      </div>

      <div className="orbit-desktop">
        <div className="orbit-stage" aria-label="Interactive map of nine beach dangers">
          <div className="orbit-stage__rings" aria-hidden="true"><i /><i /><i /></div>
          <div className="orbit-stage__center">
            <AvatarGuide reaction={activeHazard.mascotReaction} size="large" label={`Mascot reacting to ${activeHazard.title}`} />
            <span className="orbit-stage__readout">Guide locked</span>
          </div>
          {hazards.map((hazard, index) => {
            const [x, y] = orbitPositions[index];
            const active = hazard.id === activeId;
            return (
              <motion.button
                key={hazard.id}
                className={`orbit-node ${active ? "is-active" : "is-muted"}`}
                style={{ left: `${x}%`, top: `${y}%`, borderColor: active ? hazard.accentColor : undefined }}
                onPointerEnter={() => setActiveId(hazard.id)}
                onFocus={() => setActiveId(hazard.id)}
                onClick={() => setActiveId(hazard.id)}
                aria-pressed={active}
                aria-label={`Show ${hazard.title}`}
                whileHover={{ scale: 1.08 }}
                whileFocus={{ scale: 1.08 }}
              >
                <span className="orbit-node__scene" aria-hidden="true"><HazardVisual sceneType={hazard.sceneType} decorative /></span>
                <span className="orbit-node__label"><HazardGlyph name={hazard.icon} aria-hidden="true" />{hazard.title}</span>
              </motion.button>
            );
          })}
        </div>
        <div className="orbit-copy" aria-live="polite"><HazardCard hazard={activeHazard} /></div>
      </div>

      <div className="orbit-mobile" aria-label="Swipe through beach dangers">
        {hazards.map((hazard) => (
          <button className={`orbit-mobile__item ${hazard.id === activeId ? "is-active" : ""}`} key={hazard.id} onClick={() => setActiveId(hazard.id)} aria-pressed={hazard.id === activeId}>
            <HazardVisual sceneType={hazard.sceneType} decorative />
            <span>{hazard.title}</span>
          </button>
        ))}
      </div>
      <div className="orbit-mobile-card" aria-live="polite"><HazardCard hazard={activeHazard} compact /></div>
    </section>
  );
}

export default HazardOrbit;
