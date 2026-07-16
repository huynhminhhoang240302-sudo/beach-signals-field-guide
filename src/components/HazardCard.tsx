"use client";

import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { Hazard } from "@/src/data/hazards";
import { HazardGlyph } from "./hazardIcons";

type HazardCardProps = { hazard: Hazard; compact?: boolean };

export function HazardCard({ hazard, compact = false }: HazardCardProps) {
  return (
    <article className={`hazard-card ${compact ? "hazard-card--compact" : ""}`}>
      <div className="hazard-card__topline">
        <span className="hazard-card__icon" style={{ color: hazard.accentColor }}><HazardGlyph name={hazard.icon} aria-hidden="true" /></span>
        <span className="hazard-card__signal">{hazard.visual?.warningSign ?? "Know the signal"}</span>
      </div>
      <p className="eyebrow">Selected danger</p>
      <h3>{hazard.title}</h3>
      <p className="hazard-card__summary">{hazard.shortDescription}</p>
      {!compact && (
        <div className="hazard-card__details">
          <div><span>Why it is dangerous</span><p>{hazard.dangerExplanation}</p></div>
          <div className="hazard-card__action"><ShieldCheck aria-hidden="true" /><p>{hazard.safetyAction}</p></div>
        </div>
      )}
      <a href={`#${hazard.id}`} className="text-link" aria-label={`Read the ${hazard.title} guide`}>
        Read the field guide <ArrowUpRight aria-hidden="true" />
      </a>
    </article>
  );
}

export default HazardCard;
