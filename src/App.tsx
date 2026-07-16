"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Check,
  CloudLightning,
  Flag,
  LifeBuoy,
  Map as MapIcon,
  Mountain,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { hazards, type Hazard } from "@/src/data/hazards";
import AccidentSceneMap from "./components/AccidentSceneMap";
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

type Chapter = {
  id: string;
  label: string;
};

const chapters: Chapter[] = [
  { id: "top", label: "Welcome" },
  { id: "directory", label: "Accident map" },
  ...hazards.map((hazard) => ({
    id: `story-${hazard.id}`,
    label: hazard.title,
  })),
  { id: "safety", label: "Safety check" },
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

function HazardStory({
  hazard,
  index,
}: {
  hazard: Hazard;
  index: number;
}) {
  return (
    <SectionShell
      id={`story-${hazard.id}`}
      className={`hazard-chapter${index % 2 ? " hazard-chapter--reverse" : ""}`}
      label={hazard.title}
    >
      <div className="hazard-chapter__visual">
        <HazardVisual sceneType={hazard.sceneType} label={hazard.visual?.sceneDescription} />
      </div>

      <article className="hazard-chapter__copy">
        <h2>{hazard.title}</h2>
        <div
          id={`${hazard.id}-action`}
          className="calm-move is-visible"
        >
          <p>{hazard.safetyAction}</p>
        </div>

        <button
          className="back-to-map"
          type="button"
          onClick={() => jumpTo("directory")}
          aria-label="Back to map"
        >
          <MapIcon aria-hidden="true" />
        </button>
      </article>
    </SectionShell>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("top");
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

  const activeChapter = chapters.find((chapter) => chapter.id === activeSection) ?? chapters[0];
  const checkedComplete = checkedHabits.length === safetyPrinciples.length;

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
              <i />
            </button>
          ))}
        </aside>

        <main className="scroll-main">
          <SectionShell id="top" className="scroll-hero" label="Welcome to Beach Signals">
            <div className="scroll-hero__copy">
              <p className="mono-kicker">A LONG-FORM INTERACTIVE SAFETY PRESENTATION</p>
              <h1>Read the coast.<br /><span>Then step in.</span></h1>
              <p>
                Every hazard has a clear signal and a safer response.
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
              <strong>HIDDEN<br />SIGNALS</strong>
              <p>SCROLL / CLICK / JUMP</p>
            </div>
            <div className="scroll-cue"><ArrowDown aria-hidden="true" /> Scroll to continue</div>
          </SectionShell>

          <SectionShell id="directory" className="whole-map-section" label="Whole beach accident map">
            <AccidentSceneMap onJump={jumpTo} />
          </SectionShell>

          {hazards.map((hazard, index) => (
            <HazardStory
              key={hazard.id}
              hazard={hazard}
              index={index}
            />
          ))}

          <SectionShell id="safety" className="safety-section" label="Calm safety habits">
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
                    {checked && <i>PACKED</i>}
                  </button>
                );
              })}
            </div>
            <div className={`safety-result${checkedComplete ? " is-complete" : ""}`}>
              <ShieldCheck aria-hidden="true" />
              <div>
                <span>{checkedComplete ? "COAST-READY" : "KEEP PACKING"}</span>
                <strong>{checkedComplete ? "Every habit is ready." : "Small checks prevent big surprises."}</strong>
              </div>
            </div>
          </SectionShell>

        </main>

        <footer className="scroll-footer">
          <span>Beach/Signals — follow local warnings and lifeguards.</span>
        </footer>
      </div>
    </MotionConfig>
  );
}
