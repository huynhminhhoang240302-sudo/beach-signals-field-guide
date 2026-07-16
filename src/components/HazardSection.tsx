"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ShieldAlert, ShieldCheck } from "lucide-react";
import type { Hazard } from "@/src/data/hazards";
import AvatarGuide from "./AvatarGuide";
import HazardVisual from "./HazardVisual";
import { HazardGlyph } from "./hazardIcons";

type HazardSectionProps = { hazard: Hazard; index: number };

export function HazardSection({ hazard, index }: HazardSectionProps) {
  const reverse = index % 2 === 1;

  return (
    <motion.section
      id={hazard.id}
      className={`hazard-story ${reverse ? "hazard-story--reverse" : ""}`}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby={`${hazard.id}-title`}
    >
      <div className="hazard-story__visual" style={{ "--hazard-accent": hazard.accentColor } as React.CSSProperties}>
        <div className="hazard-story__number">0{index + 1}</div>
        <HazardVisual sceneType={hazard.sceneType} />
        <div className="hazard-story__telemetry" aria-hidden="true"><span>FIELD NOTE</span><i /><i /><i /></div>
        <AvatarGuide reaction={hazard.mascotReaction} size="small" label={`Mascot showing a ${hazard.mascotReaction} response`} />
      </div>

      <div className="hazard-story__copy">
        <p className="eyebrow"><HazardGlyph name={hazard.icon} aria-hidden="true" /> {hazard.visual?.eyebrow ?? `Field note ${index + 1}`}</p>
        <h3 id={`${hazard.id}-title`}>{hazard.title}</h3>
        <p className="hazard-story__opening">{hazard.cinematicOpening}</p>
        <p className="hazard-story__description">{hazard.shortDescription}</p>
        <div className="hazard-story__blocks">
          <div className="info-block info-block--danger"><ShieldAlert aria-hidden="true" /><div><span>What makes it dangerous</span><p>{hazard.dangerExplanation}</p></div></div>
          <div className="info-block info-block--action"><ShieldCheck aria-hidden="true" /><div><span>What to do</span><p>{hazard.safetyAction}</p></div></div>
        </div>
        <a href="#beach-map" className="text-link">Read the shoreline <ArrowUpRight aria-hidden="true" /></a>
      </div>
    </motion.section>
  );
}

export default HazardSection;
