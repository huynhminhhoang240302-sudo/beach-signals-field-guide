"use client";

import {
  Ban,
  CloudLightning,
  Construction,
  Flag,
  MoveDown,
  TriangleAlert,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";
import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

export type BeachHotspotId =
  | "red-flags"
  | "changing-weather"
  | "dark-channels"
  | "cliff-cracks"
  | "water-withdrawal"
  | "damaged-piers"
  | "strong-wind"
  | "restricted-zones";

export interface BeachHotspot {
  id: BeachHotspotId;
  title: string;
  description: string;
  position: {
    x: number;
    y: number;
  };
}

interface BeachHotspotDefinition extends BeachHotspot {
  Icon: LucideIcon;
}

export interface BeachMapProps {
  className?: string;
  onSelect?: (hotspot: BeachHotspot) => void;
}

export const beachHotspots: readonly BeachHotspotDefinition[] = [
  {
    id: "red-flags",
    title: "Red flags",
    description:
      "A red flag signals hazardous water or a closed swimming area. Stay on shore and follow the lifeguard's direction.",
    position: { x: 61, y: 45 },
    Icon: Flag,
  },
  {
    id: "changing-weather",
    title: "Changing weather",
    description:
      "Darkening clouds, distant thunder, or a fast temperature drop are cues to leave the beach before the storm arrives.",
    position: { x: 82, y: 16 },
    Icon: CloudLightning,
  },
  {
    id: "dark-channels",
    title: "Dark channels",
    description:
      "A darker, calmer gap between breaking waves can mark a rip current carrying water quickly away from shore.",
    position: { x: 24, y: 55 },
    Icon: Waves,
  },
  {
    id: "cliff-cracks",
    title: "Cracks in cliffs",
    description:
      "Fresh cracks, loose stones, and falling sand can signal an unstable bluff. Move well beyond its edge and base.",
    position: { x: 91, y: 39 },
    Icon: TriangleAlert,
  },
  {
    id: "water-withdrawal",
    title: "Sudden water withdrawal",
    description:
      "If the sea rapidly pulls back and exposes unusual amounts of seabed, move inland or uphill without waiting.",
    position: { x: 39, y: 71 },
    Icon: MoveDown,
  },
  {
    id: "damaged-piers",
    title: "Damaged piers",
    description:
      "Missing boards, leaning rails, and cracked supports can fail under people or waves. Keep off and report the damage.",
    position: { x: 70, y: 60 },
    Icon: Construction,
  },
  {
    id: "strong-wind",
    title: "Strong wind",
    description:
      "Gusts can turn umbrellas and loose gear into fast-moving hazards. Lower canopies and secure or pack away equipment.",
    position: { x: 48, y: 22 },
    Icon: Wind,
  },
  {
    id: "restricted-zones",
    title: "Restricted zones",
    description:
      "Fences and closure signs usually mark unstable ground, dangerous surf, wildlife, or active rescue areas. Do not cross them.",
    position: { x: 84, y: 79 },
    Icon: Ban,
  },
] as const;

type HotspotStyle = CSSProperties & {
  "--hotspot-x": string;
  "--hotspot-y": string;
  "--hotspot-index": number;
};

export function BeachMap({ className, onSelect }: BeachMapProps) {
  const [selectedId, setSelectedId] =
    useState<BeachHotspotId>("red-flags");
  const detailId = useId();
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedHotspot =
    beachHotspots.find((hotspot) => hotspot.id === selectedId) ??
    beachHotspots[0];
  const SelectedIcon = selectedHotspot.Icon;

  const selectHotspot = (hotspot: BeachHotspotDefinition) => {
    setSelectedId(hotspot.id);
    onSelect?.(hotspot);
  };

  const handleHotspotKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | undefined;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % beachHotspots.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + beachHotspots.length) % beachHotspots.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = beachHotspots.length - 1;
    }

    if (nextIndex === undefined) return;

    event.preventDefault();
    const nextHotspot = beachHotspots[nextIndex];
    buttonRefs.current[nextIndex]?.focus();
    selectHotspot(nextHotspot);
  };

  const classes = ["beach-map", className].filter(Boolean).join(" ");

  return (
    <section className={classes} aria-label="Interactive beach warning guide">
      <div className="beach-map__visual">
        <div className="beach-map__terrain" aria-hidden="true">
          <span className="beach-map__water" />
          <span className="beach-map__deep-channel" />
          <span className="beach-map__wave beach-map__wave--one" />
          <span className="beach-map__wave beach-map__wave--two" />
          <span className="beach-map__wave beach-map__wave--three" />
          <span className="beach-map__shoreline" />
          <span className="beach-map__sand" />
          <span className="beach-map__dune beach-map__dune--one" />
          <span className="beach-map__dune beach-map__dune--two" />
          <span className="beach-map__dune beach-map__dune--three" />
          <span className="beach-map__cliff" />
          <span className="beach-map__cliff-crack beach-map__cliff-crack--one" />
          <span className="beach-map__cliff-crack beach-map__cliff-crack--two" />
          <span className="beach-map__pier" />
          <span className="beach-map__pier-leg beach-map__pier-leg--one" />
          <span className="beach-map__pier-leg beach-map__pier-leg--two" />
          <span className="beach-map__pier-leg beach-map__pier-leg--three" />
          <span className="beach-map__restricted-boundary" />
          <span className="beach-map__wind-trail beach-map__wind-trail--one" />
          <span className="beach-map__wind-trail beach-map__wind-trail--two" />
          <span className="beach-map__compass" />
        </div>

        <div className="beach-map__hotspots" aria-label="Beach warning signs">
          {beachHotspots.map((hotspot, index) => {
            const isSelected = hotspot.id === selectedId;
            const Icon = hotspot.Icon;
            const style: HotspotStyle = {
              "--hotspot-x": `${hotspot.position.x}%`,
              "--hotspot-y": `${hotspot.position.y}%`,
              "--hotspot-index": index,
            };

            return (
              <button
                key={hotspot.id}
                ref={(node) => {
                  buttonRefs.current[index] = node;
                }}
                className={`beach-map__hotspot${
                  isSelected ? " beach-map__hotspot--selected" : ""
                }`}
                style={style}
                type="button"
                aria-pressed={isSelected}
                aria-controls={detailId}
                aria-label={`${hotspot.title}: ${hotspot.description}`}
                onClick={() => selectHotspot(hotspot)}
                onKeyDown={(event) => handleHotspotKeyDown(event, index)}
              >
                <span className="beach-map__hotspot-ring" aria-hidden="true" />
                <span className="beach-map__hotspot-icon" aria-hidden="true">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <span className="beach-map__hotspot-label">{hotspot.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={detailId}
        className="beach-map__detail"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="beach-map__detail-icon" aria-hidden="true">
          <SelectedIcon size={24} strokeWidth={1.8} />
        </span>
        <div className="beach-map__detail-copy">
          <span className="beach-map__detail-kicker">Selected warning sign</span>
          <h3 className="beach-map__detail-title">{selectedHotspot.title}</h3>
          <p className="beach-map__detail-description">
            {selectedHotspot.description}
          </p>
        </div>
      </div>

      <p className="beach-map__keyboard-hint">
        Use Tab to reach the map markers. Arrow keys move between them.
      </p>
    </section>
  );
}

export default BeachMap;
