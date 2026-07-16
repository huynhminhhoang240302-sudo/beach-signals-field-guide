"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  CloudLightning,
  Eye,
  Flag,
  LifeBuoy,
  MapPinned,
  Mountain,
  RotateCcw,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { hazards, type Hazard } from "@/src/data/hazards";
import BeachMap, { type BeachHotspot } from "./components/BeachMap";
import GuideAvatar3D, {
  type GuideGesture,
  type GuideReaction,
} from "./components/GuideAvatar3D";
import HazardVisual from "./components/HazardVisual";

const safetyPrinciples = [
  {
    title: "Check local warnings",
    detail: "Read flags, posted notices and the day’s forecast before settling in.",
    icon: Flag,
  },
  {
    title: "Swim near lifeguards",
    detail: "Choose a watched area and stay inside the marked swimming zone.",
    icon: LifeBuoy,
  },
  {
    title: "Keep sand holes shallow",
    detail: "Supervise children and fill every hole before leaving the beach.",
    icon: Waves,
  },
  {
    title: "Give cliffs space",
    detail: "Stay back from bluff edges and away from the base of crumbling slopes.",
    icon: Mountain,
  },
  {
    title: "Leave when thunder starts",
    detail: "Move into a substantial enclosed building or hard-topped vehicle.",
    icon: CloudLightning,
  },
  {
    title: "Use licensed operators",
    detail: "Check the crew, weather policy and safety equipment before an activity.",
    icon: BadgeCheck,
  },
] as const;

const guideGestureByReaction: Record<GuideReaction, GuideGesture> = {
  neutral: "wave",
  confident: "point-right",
  "confident-pointing": "point-right",
  worried: "warning",
  warning: "warning",
  surprised: "warning",
  "moving-away": "point-left",
  relieved: "celebrate",
};

type Chapter = {
  id: string;
  label: string;
  shortLabel: string;
};

const chapters: Chapter[] = [
  { id: "top", label: "Welcome", shortLabel: "00" },
  { id: "directory", label: "Hazard directory", shortLabel: "INDEX" },
  ...hazards.map((hazard, index) => ({
    id: `story-${hazard.id}`,
    label: hazard.title,
    shortLabel: String(index + 1).padStart(2, "0"),
  })),
  { id: "beach-map", label: "Read a beach", shortLabel: "MAP" },
  { id: "safety", label: "Safety check", shortLabel: "CHECK" },
  { id: "finish", label: "Ready for the coast", shortLabel: "END" },
];

function jumpTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

function SectionShell({
  children,
  className = "",
  id,
  label,
}: {
  children: ReactNode;
  className?: string;
  id: string;
  label: string;
}) {
  return (
    <motion.section
      id={id}
      className={`scroll-section ${className}`}
      data-scroll-section
      aria-label={label}
      initial={{ opacity: 0.45, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

function Companion({ activeId }: { activeId: string }) {
  const activeHazard = hazards.find((hazard) => activeId === `story-${hazard.id}`);
  const reaction = (activeHazard?.mascotReaction ??
    (activeId === "finish" ? "relieved" : activeId === "safety" ? "confident" : "neutral")) as GuideReaction;

  const message = activeHazard
    ? activeHazard.visual?.warningSign ?? activeHazard.shortDescription
    : activeId === "directory"
      ? "Choose any signal and jump straight into its field note."
      : activeId === "beach-map"
        ? "Scan the water, sky, structures and land before you settle in."
        : activeId === "safety"
          ? "Pack all six habits. Small checks prevent big surprises."
          : activeId === "finish"
            ? "You are coast-ready. Look first, then step in."
            : "I’ll stay with you while you read the coast.";

  return (
    <aside className="scroll-companion" aria-label="Scout, your 3D beach-safety guide">
      <div className="scroll-companion__status"><i /> Scout is watching</div>
      <div className="scroll-companion__avatar">
        <GuideAvatar3D
          reaction={reaction}
          gesture={guideGestureByReaction[reaction]}
          compact
          label={`Scout, the expressive 3D guide, reacting ${reaction.replaceAll("-", " ")}`}
        />
      </div>
      <div className="scroll-companion__bubble">
        <strong>{activeHazard?.title ?? "Your guide"}</strong>
        <p>{message}</p>
      </div>
    </aside>
  );
}

function HazardStory({
  hazard,
  index,
  revealed,
  onReveal,
}: {
  hazard: Hazard;
  index: number;
  revealed: boolean;
  onReveal: () => void;
}) {
  const nextId = index < hazards.length - 1
    ? `story-${hazards[index + 1].id}`
    : "beach-map";

  return (
    <SectionShell
      id={`story-${hazard.id}`}
      className={`hazard-chapter${index % 2 ? " hazard-chapter--reverse" : ""}`}
      label={`Field note ${index + 1}: ${hazard.title}`}
    >
      <div className="hazard-chapter__visual">
        <span className="hazard-chapter__number">{String(index + 1).padStart(2, "0")}</span>
        <HazardVisual sceneType={hazard.sceneType} label={hazard.visual?.sceneDescription} />
        <div className="hazard-chapter__signal">
          <Eye aria-hidden="true" />
          <div>
            <span>Signal to notice</span>
            <strong>{hazard.visual?.warningSign ?? hazard.shortDescription}</strong>
          </div>
        </div>
      </div>

      <article className="hazard-chapter__copy">
        <p className="mono-kicker">FIELD NOTE / {String(index + 1).padStart(2, "0")}</p>
        <h2>{hazard.title}</h2>
        <blockquote>{hazard.cinematicOpening}</blockquote>
        <p className="hazard-chapter__summary">{hazard.shortDescription}</p>

        <div className="hazard-chapter__why">
          <span>Why it matters</span>
          <p>{hazard.dangerExplanation}</p>
        </div>

        <button
          className="reveal-button"
          type="button"
          onClick={onReveal}
          aria-expanded={revealed}
          aria-controls={`${hazard.id}-action`}
        >
          <ShieldCheck aria-hidden="true" />
          <span>{revealed ? "Calm move revealed" : "Reveal the calm move"}</span>
          <ArrowDown aria-hidden="true" />
        </button>
        <div
          id={`${hazard.id}-action`}
          className={`calm-move${revealed ? " is-visible" : ""}`}
          aria-hidden={!revealed}
        >
          <span>Do this</span>
          <p>{hazard.safetyAction}</p>
        </div>

        <button className="chapter-next" type="button" onClick={() => jumpTo(nextId)}>
          {index < hazards.length - 1 ? "Next field note" : "Practice reading a beach"}
          <ArrowDown aria-hidden="true" />
        </button>
      </article>
    </SectionShell>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("top");
  const [mapHotspot, setMapHotspot] = useState<BeachHotspot | null>(null);
  const [revealedHazards, setRevealedHazards] = useState<string[]>([]);
  const [checkedHabits, setCheckedHabits] = useState<number[]>([]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 30, mass: 0.25 });

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-section]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -58%", threshold: [0.08, 0.25, 0.55] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const activeChapterIndex = Math.max(0, chapters.findIndex((chapter) => chapter.id === activeSection));
  const activeChapter = chapters[activeChapterIndex] ?? chapters[0];
  const checkedComplete = checkedHabits.length === safetyPrinciples.length;

  const directoryItems = useMemo(
    () => hazards.map((hazard, index) => ({ hazard, index, target: `story-${hazard.id}` })),
    [],
  );

  const toggleReveal = (id: string) => {
    setRevealedHazards((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleHabit = (index: number) => {
    setCheckedHabits((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="scroll-progress-bw" style={{ scaleX }} aria-hidden="true" />
      <div className="scroll-page">
        <a className="skip-link" href="#directory">Skip to the hazard directory</a>

        <header className="scroll-header">
          <button className="scroll-brand" type="button" onClick={() => jumpTo("top")} aria-label="Return to the top">
            <span>Beach</span><i>/</i><span>Signals</span>
          </button>
          <div className="scroll-header__chapter" aria-live="polite">
            <span>{String(activeChapterIndex + 1).padStart(2, "0")} / {chapters.length}</span>
            <strong>{activeChapter.label}</strong>
          </div>
          <button className="header-jump" type="button" onClick={() => jumpTo("directory")}>
            Jump to a hazard <ArrowDown aria-hidden="true" />
          </button>
        </header>

        <aside className="chapter-rail" aria-label="Page chapters">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              className={chapter.id === activeSection ? "is-active" : ""}
              onClick={() => jumpTo(chapter.id)}
              aria-label={`Jump to ${chapter.label}`}
              aria-current={chapter.id === activeSection ? "step" : undefined}
            >
              <i /><span>{chapter.shortLabel}</span>
            </button>
          ))}
        </aside>

        <Companion activeId={activeSection} />

        <main className="scroll-main">
          <SectionShell id="top" className="scroll-hero" label="Welcome to Beach Signals">
            <div className="scroll-hero__copy">
              <p className="mono-kicker">A LONG-FORM INTERACTIVE SAFETY PRESENTATION</p>
              <h1>Read the coast.<br /><span>Then step in.</span></h1>
              <p>
                Nine ordinary-looking beach scenes can change in seconds. Scroll the story,
                jump straight into any field note, and reveal the calm move that matters.
              </p>
              <div className="scroll-hero__actions">
                <button className="bw-button bw-button--light" type="button" onClick={() => jumpTo("directory")}>
                  Jump into the guide <ArrowDown aria-hidden="true" />
                </button>
                <button className="bw-button" type="button" onClick={() => jumpTo("safety")}>
                  Go to the safety check <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="scroll-hero__poster" aria-hidden="true">
              <span>09</span>
              <strong>HIDDEN<br />SIGNALS</strong>
              <p>SCROLL / CLICK / JUMP</p>
            </div>
            <div className="scroll-cue"><ArrowDown aria-hidden="true" /> Scroll to continue</div>
          </SectionShell>

          <SectionShell id="directory" className="directory-section" label="Hazard directory">
            <div className="scroll-heading">
              <p className="mono-kicker"><BookOpen aria-hidden="true" /> CLICK-TO-JUMP DIRECTORY</p>
              <h2>Choose a signal.<br /><span>Jump right in.</span></h2>
              <p>Read in order or skip directly to the scene you want. Every field note is one full chapter down the page.</p>
            </div>
            <div className="directory-grid">
              {directoryItems.map(({ hazard, index, target }) => (
                <button className="directory-card" type="button" key={hazard.id} onClick={() => jumpTo(target)}>
                  <HazardVisual sceneType={hazard.sceneType} decorative />
                  <span className="directory-card__number">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{hazard.title}</strong>
                  <small>{hazard.visual?.warningSign}</small>
                  <ArrowDown aria-hidden="true" />
                </button>
              ))}
            </div>
          </SectionShell>

          {hazards.map((hazard, index) => (
            <HazardStory
              key={hazard.id}
              hazard={hazard}
              index={index}
              revealed={revealedHazards.includes(hazard.id)}
              onReveal={() => toggleReveal(hazard.id)}
            />
          ))}

          <SectionShell id="beach-map" className="practice-section" label="Practice reading a beach">
            <div className="scroll-heading scroll-heading--split">
              <div>
                <p className="mono-kicker"><MapPinned aria-hidden="true" /> JUMP-IN PRACTICE</p>
                <h2>Read the whole beach.</h2>
              </div>
              <p>Click a marker. Start with the flag, then scan the water, sky, structures and land.</p>
            </div>
            <div className="practice-layout">
              <BeachMap className="monochrome-map" onSelect={setMapHotspot} />
              <aside className="practice-readout" aria-live="polite">
                <span>{mapHotspot ? "SIGNAL IDENTIFIED" : "SCOUT’S SCAN"}</span>
                <h3>{mapHotspot?.title ?? "What changed?"}</h3>
                <p>{mapHotspot?.description ?? "Choose a marker and read the clue before you choose where to swim or sit."}</p>
                <button type="button" onClick={() => jumpTo("safety")}>Continue to the safety check <ArrowDown aria-hidden="true" /></button>
              </aside>
            </div>
          </SectionShell>

          <SectionShell id="safety" className="safety-section" label="Six calm safety habits">
            <div className="scroll-heading scroll-heading--split">
              <div>
                <p className="mono-kicker"><ShieldCheck aria-hidden="true" /> TAP TO PACK EACH HABIT</p>
                <h2>Your sixty-second safety check.</h2>
              </div>
              <p>{checkedHabits.length} of {safetyPrinciples.length} packed. Tap every habit to build a calm coast-ready routine.</p>
            </div>
            <div className="safety-grid">
              {safetyPrinciples.map((principle, index) => {
                const Icon = principle.icon;
                const checked = checkedHabits.includes(index);
                return (
                  <button
                    className={`safety-card${checked ? " is-checked" : ""}`}
                    type="button"
                    key={principle.title}
                    onClick={() => toggleHabit(index)}
                    aria-pressed={checked}
                  >
                    <span>{checked ? <Check aria-hidden="true" /> : <Icon aria-hidden="true" />}</span>
                    <strong>{principle.title}</strong>
                    <small>{principle.detail}</small>
                    <i>{checked ? "PACKED" : String(index + 1).padStart(2, "0")}</i>
                  </button>
                );
              })}
            </div>
            <div className={`safety-result${checkedComplete ? " is-complete" : ""}`}>
              <ShieldCheck aria-hidden="true" />
              <div>
                <span>{checkedComplete ? "COAST-READY" : "KEEP PACKING"}</span>
                <strong>{checkedComplete ? "All six habits are ready." : "Small checks prevent big surprises."}</strong>
              </div>
            </div>
          </SectionShell>

          <SectionShell id="finish" className="finish-section" label="Presentation complete">
            <p className="mono-kicker">END OF FIELD GUIDE / START OF A SAFER BEACH DAY</p>
            <h2>Look first.<br /><span>Then step in.</span></h2>
            <p>A safer day is not about memorizing fear. Notice change early, give hazards space, and choose the easy safe action.</p>
            <div className="finish-actions">
              <button className="bw-button bw-button--light" type="button" onClick={() => jumpTo("directory")}>
                Review the directory <BookOpen aria-hidden="true" />
              </button>
              <button className="bw-button" type="button" onClick={() => jumpTo("top")}>
                Start again <RotateCcw aria-hidden="true" />
              </button>
            </div>
          </SectionShell>
        </main>

        <footer className="scroll-footer">
          <span>Beach/Signals — an educational field guide.</span>
          <span>Follow local lifeguards, warnings and emergency services.</span>
        </footer>
      </div>
    </MotionConfig>
  );
}
