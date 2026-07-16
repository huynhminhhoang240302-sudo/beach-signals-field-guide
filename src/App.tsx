"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  CloudLightning,
  Eye,
  Flag,
  Keyboard,
  LifeBuoy,
  MapPinned,
  Mountain,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { hazards } from "@/src/data/hazards";
import BeachMap, { type BeachHotspot } from "./components/BeachMap";
import GuideAvatar3D, {
  type GuideGesture,
  type GuideReaction,
} from "./components/GuideAvatar3D";
import HazardVisual from "./components/HazardVisual";
import PresentationControls from "./components/PresentationControls";
import { usePresentationNavigation } from "./hooks/usePresentationNavigation";

const INTRO_SLIDES = 2;
const MAP_SLIDE = INTRO_SLIDES + hazards.length;
const HABITS_SLIDE = MAP_SLIDE + 1;
const CLOSING_SLIDE = HABITS_SLIDE + 1;

const slideLabels = [
  "Welcome",
  "Choose a signal",
  ...hazards.map((hazard) => hazard.title),
  "Read a beach",
  "Six calm habits",
  "Ready for the coast",
] as const;

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
    detail: "Dig only shallow holes, supervise children and fill every hole before leaving.",
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

type AccentStyle = CSSProperties & { "--slide-accent": string };

function GuidePanel({
  reaction,
  gesture,
  eyebrow,
  title,
  children,
  compact = true,
}: {
  reaction: GuideReaction;
  gesture?: GuideGesture;
  eyebrow: string;
  title: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <aside className="guide-panel" aria-label="Scout’s guidance">
      <div className="guide-panel__avatar">
        <GuideAvatar3D
          reaction={reaction}
          gesture={gesture ?? guideGestureByReaction[reaction]}
          compact={compact}
          label={`Scout, the expressive 3D beach guide, ${reaction.replaceAll("-", " ")}`}
        />
      </div>
      <div className="guide-panel__message">
        <p>{eyebrow}</p>
        <h3>{title}</h3>
        <div>{children}</div>
      </div>
    </aside>
  );
}

function CoverSlide({ onStart }: { onStart: () => void }) {
  return (
    <div className="cover-slide">
      <div className="cover-slide__copy">
        <p className="slide-kicker"><Sparkles aria-hidden="true" /> Interactive beach safety presentation</p>
        <h1 id="slide-title-0">Meet the coast <span>before you step in.</span></h1>
        <p className="cover-slide__lead">
          Nine ordinary-looking beach scenes can change in seconds. Scout, your expressive 3D guide,
          will show you the clue to notice and the calm move to make.
        </p>
        <div className="cover-slide__actions">
          <button className="deck-button deck-button--primary" type="button" onClick={onStart}>
            Start presentation <ArrowRight aria-hidden="true" />
          </button>
          <span><Keyboard aria-hidden="true" /> Use arrow keys, click, or swipe</span>
        </div>
        <dl className="cover-slide__stats">
          <div><dt>09</dt><dd>hidden hazards</dd></div>
          <div><dt>06</dt><dd>calm habits</dd></div>
          <div><dt>01</dt><dd>guide beside you</dd></div>
        </dl>
      </div>

      <div className="cover-slide__guide" aria-label="Meet Scout, the presentation guide">
        <div className="cover-slide__orbit" aria-hidden="true"><i /><i /><i /></div>
        <GuideAvatar3D
          reaction="confident"
          gesture="wave"
          label="Scout, a charcoal-black 3D puzzle-shaped beach guide, waving hello"
        />
        <div className="cover-slide__bubble">
          <span>Guide online</span>
          <strong>Hi, I’m Scout!</strong>
          <p>I’ll change expression and point out the signal that matters on every slide.</p>
        </div>
      </div>
    </div>
  );
}

function HazardIndexSlide({ onChoose }: { onChoose: (hazardIndex: number) => void }) {
  return (
    <div className="index-slide">
      <div className="slide-heading slide-heading--row">
        <div>
          <p className="slide-kicker"><BookOpen aria-hidden="true" /> Click-interactive hazard index</p>
          <h2 id="slide-title-1">Nine signals. <span>Choose one.</span></h2>
        </div>
        <p>Pick any scene to jump there, or keep moving in order with the controls below.</p>
      </div>

      <div className="index-slide__layout">
        <div className="hazard-index" aria-label="Choose a beach hazard">
          {hazards.map((hazard, index) => (
            <button
              className="hazard-index__item"
              type="button"
              key={hazard.id}
              onClick={() => onChoose(index)}
              style={{ "--slide-accent": hazard.accentColor } as AccentStyle}
            >
              <HazardVisual sceneType={hazard.sceneType} decorative />
              <span className="hazard-index__number">{String(index + 1).padStart(2, "0")}</span>
              <span className="hazard-index__title">{hazard.title}</span>
              <ArrowRight aria-hidden="true" />
            </button>
          ))}
        </div>

        <GuidePanel
          reaction="confident-pointing"
          gesture="point-left"
          eyebrow="Scout says"
          title="Curiosity first."
        >
          <p>Nothing here is graphic. Each scene teaches one visual clue and one action worth remembering.</p>
        </GuidePanel>
      </div>
    </div>
  );
}

function HazardSlide({
  hazardIndex,
  onBackToIndex,
}: {
  hazardIndex: number;
  onBackToIndex: () => void;
}) {
  const hazard = hazards[hazardIndex];
  const reaction = hazard.mascotReaction as GuideReaction;
  const warningSign = hazard.visual?.warningSign ?? hazard.shortDescription;

  return (
    <div
      className="hazard-slide"
      style={{ "--slide-accent": hazard.accentColor } as AccentStyle}
    >
      <div className="hazard-slide__visual-column">
        <div className="hazard-slide__number">FIELD NOTE {String(hazardIndex + 1).padStart(2, "0")}</div>
        <HazardVisual
          sceneType={hazard.sceneType}
          label={hazard.visual?.sceneDescription}
        />
        <div className="hazard-slide__signal">
          <Eye aria-hidden="true" />
          <div><span>Signal to notice</span><strong>{warningSign}</strong></div>
        </div>
      </div>

      <article className="hazard-slide__lesson">
        <button className="text-button" type="button" onClick={onBackToIndex}>← Hazard index</button>
        <p className="slide-kicker">{hazard.visual?.eyebrow ?? "Beach signal"}</p>
        <h2 id={`slide-title-${hazardIndex + INTRO_SLIDES}`}>{hazard.title}</h2>
        <blockquote>{hazard.cinematicOpening}</blockquote>

        <div className="lesson-card">
          <span>Why it matters</span>
          <p>{hazard.dangerExplanation}</p>
        </div>
        <div className="lesson-card lesson-card--action">
          <ShieldCheck aria-hidden="true" />
          <div><span>Your calm move</span><p>{hazard.safetyAction}</p></div>
        </div>
      </article>

      <GuidePanel
        reaction={reaction}
        eyebrow="Scout is watching"
        title={hazard.shortDescription}
      >
        <p>{hazard.visual?.mascotCue ?? "Notice the changing conditions and make space early."}</p>
      </GuidePanel>
    </div>
  );
}

function MapSlide({
  selectedHotspot,
  onSelect,
}: {
  selectedHotspot: BeachHotspot | null;
  onSelect: (hotspot: BeachHotspot) => void;
}) {
  return (
    <div className="map-slide">
      <div className="slide-heading slide-heading--row">
        <div>
          <p className="slide-kicker"><MapPinned aria-hidden="true" /> Practice round</p>
          <h2 id={`slide-title-${MAP_SLIDE}`}>Read the whole <span>beach.</span></h2>
        </div>
        <p>Tap the markers. Start with the flag, then scan the water, sky, structures and land.</p>
      </div>
      <div className="map-slide__layout">
        <BeachMap className="presentation-map" onSelect={onSelect} />
        <GuidePanel
          reaction={selectedHotspot ? "warning" : "confident-pointing"}
          gesture={selectedHotspot ? "warning" : "point-left"}
          eyebrow={selectedHotspot ? "Signal identified" : "Scout’s scan"}
          title={selectedHotspot?.title ?? "What changed?"}
        >
          <p>{selectedHotspot?.description ?? "Choose a marker and I’ll help you read it."}</p>
        </GuidePanel>
      </div>
    </div>
  );
}

function HabitsSlide({
  checkedHabits,
  onToggle,
}: {
  checkedHabits: readonly number[];
  onToggle: (habitIndex: number) => void;
}) {
  const complete = checkedHabits.length === safetyPrinciples.length;

  return (
    <div className="habits-slide">
      <div className="slide-heading slide-heading--row">
        <div>
          <p className="slide-kicker"><ShieldCheck aria-hidden="true" /> Tap to pack each habit</p>
          <h2 id={`slide-title-${HABITS_SLIDE}`}>Your sixty-second <span>safety check.</span></h2>
        </div>
        <p>{checkedHabits.length} of {safetyPrinciples.length} ready — click each card to pack it for the beach.</p>
      </div>

      <div className="habits-slide__layout">
        <div className="habit-grid">
          {safetyPrinciples.map((principle, index) => {
            const Icon = principle.icon;
            const isChecked = checkedHabits.includes(index);
            return (
              <button
                type="button"
                className={`habit-card${isChecked ? " is-checked" : ""}`}
                key={principle.title}
                onClick={() => onToggle(index)}
                aria-pressed={isChecked}
              >
                <span className="habit-card__icon">{isChecked ? <Check aria-hidden="true" /> : <Icon aria-hidden="true" />}</span>
                <span className="habit-card__copy"><strong>{principle.title}</strong><small>{principle.detail}</small></span>
                <span className="habit-card__status">{isChecked ? "Packed" : `0${index + 1}`}</span>
              </button>
            );
          })}
        </div>

        <GuidePanel
          reaction={complete ? "relieved" : "confident"}
          gesture={complete ? "celebrate" : "point-left"}
          eyebrow={complete ? "All packed" : "Scout’s checklist"}
          title={complete ? "That’s a coast-ready routine!" : "Small checks prevent big surprises."}
        >
          <p>{complete ? "You noticed the environment, chose supervision and planned an early exit." : "Tap every habit. You can change any answer before moving on."}</p>
        </GuidePanel>
      </div>
    </div>
  );
}

function ClosingSlide({ onReplay, onReview }: { onReplay: () => void; onReview: () => void }) {
  return (
    <div className="closing-slide">
      <div className="closing-slide__copy">
        <p className="slide-kicker"><Sparkles aria-hidden="true" /> Presentation complete</p>
        <h2 id={`slide-title-${CLOSING_SLIDE}`}>Look first. <span>Then step in.</span></h2>
        <p>
          A safer beach day is not about memorizing fear. It is about noticing change early,
          giving hazards space and choosing the easy safe action.
        </p>
        <div className="closing-slide__recap">
          <span><Eye aria-hidden="true" /><strong>Notice</strong> the signal</span>
          <span><ShieldCheck aria-hidden="true" /><strong>Choose</strong> the calm move</span>
          <span><LifeBuoy aria-hidden="true" /><strong>Help</strong> others see it</span>
        </div>
        <div className="closing-slide__actions">
          <button className="deck-button deck-button--primary" type="button" onClick={onReplay}><RotateCcw aria-hidden="true" /> Replay</button>
          <button className="deck-button deck-button--secondary" type="button" onClick={onReview}>Review the hazard index</button>
        </div>
      </div>
      <div className="closing-slide__guide">
        <GuideAvatar3D reaction="relieved" gesture="celebrate" label="Scout celebrates a coast-ready presentation" />
        <div className="closing-slide__badge"><Check aria-hidden="true" /><span>Coast-ready<br /><strong>Nice work!</strong></span></div>
      </div>
    </div>
  );
}

export default function App() {
  const stageRef = useRef<HTMLElement>(null);
  const [mapHotspot, setMapHotspot] = useState<BeachHotspot | null>(null);
  const [checkedHabits, setCheckedHabits] = useState<number[]>([]);
  const navigation = usePresentationNavigation({ slideCount: slideLabels.length });
  const { currentSlide, goTo, next, previous, swipeHandlers } = navigation;

  useEffect(() => {
    stageRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSlide]);

  const toggleHabit = (habitIndex: number) => {
    setCheckedHabits((current) =>
      current.includes(habitIndex)
        ? current.filter((index) => index !== habitIndex)
        : [...current, habitIndex],
    );
  };

  const hazardIndex = currentSlide - INTRO_SLIDES;
  const slideDirection = currentSlide === 0 ? 1 : currentSlide;

  let slide: ReactNode;
  if (currentSlide === 0) {
    slide = <CoverSlide onStart={() => goTo(1)} />;
  } else if (currentSlide === 1) {
    slide = <HazardIndexSlide onChoose={(index) => goTo(INTRO_SLIDES + index)} />;
  } else if (hazardIndex >= 0 && hazardIndex < hazards.length) {
    slide = <HazardSlide hazardIndex={hazardIndex} onBackToIndex={() => goTo(1)} />;
  } else if (currentSlide === MAP_SLIDE) {
    slide = <MapSlide selectedHotspot={mapHotspot} onSelect={setMapHotspot} />;
  } else if (currentSlide === HABITS_SLIDE) {
    slide = <HabitsSlide checkedHabits={checkedHabits} onToggle={toggleHabit} />;
  } else {
    slide = <ClosingSlide onReplay={() => goTo(0)} onReview={() => goTo(1)} />;
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="presentation-shell">
        <a className="skip-link" href="#presentation-stage">Skip to current slide</a>
        <header className="presentation-header">
          <button className="presentation-brand" type="button" onClick={() => goTo(0)} aria-label="Return to the welcome slide">
            <span className="presentation-brand__mark"><Waves aria-hidden="true" /></span>
            <span>Beach<span>/</span>Signals</span>
          </button>
          <div className="presentation-header__context">
            <span>Interactive safety presentation</span>
            <strong>{slideLabels[currentSlide]}</strong>
          </div>
          <div className="presentation-header__hint"><Keyboard aria-hidden="true" /><span>← → to navigate</span></div>
        </header>

        <main
          id="presentation-stage"
          ref={stageRef}
          className="presentation-stage"
          aria-label={`Slide ${currentSlide + 1} of ${slideLabels.length}: ${slideLabels[currentSlide]}`}
          {...swipeHandlers}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              className="presentation-slide"
              key={currentSlide}
              aria-labelledby={`slide-title-${currentSlide}`}
              initial={{ opacity: 0, x: slideDirection > 0 ? 34 : -34, scale: 0.985 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -24, scale: 0.99 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              {slide}
            </motion.section>
          </AnimatePresence>
        </main>

        <PresentationControls
          currentSlide={currentSlide}
          slideCount={slideLabels.length}
          slideLabels={slideLabels}
          onPrevious={previous}
          onNext={next}
          onGoTo={goTo}
        />
      </div>
    </MotionConfig>
  );
}
