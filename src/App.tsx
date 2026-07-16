"use client";

import { lazy, Suspense, useState } from "react";
import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { ArrowDown, ArrowRight, Menu, ShieldCheck, Sparkles, X } from "lucide-react";
import { hazards } from "@/src/data/hazards";
import { useMediaQuery } from "./hooks/useMediaQuery";
import AvatarGuide from "./components/AvatarGuide";
import BeachMap, { type BeachHotspot } from "./components/BeachMap";
import FooterScene from "./components/FooterScene";
import HazardOrbit from "./components/HazardOrbit";
import HazardSection from "./components/HazardSection";
import SafetyChecklist from "./components/SafetyChecklist";

const HeroScene = lazy(() => import("./components/HeroScene"));

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mapHotspot, setMapHotspot] = useState<BeachHotspot | null>(null);
  const compact = useMediaQuery("(max-width: 740px)");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.25 });

  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Beach Signals home">
          <span className="brand__mark"><ShieldCheck aria-hidden="true" /></span>
          <span>Beach<span>/</span>Signals</span>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="site-nav" aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav id="site-nav" className={menuOpen ? "is-open" : ""} aria-label="Primary navigation">
          <a href="#hazards" onClick={() => setMenuOpen(false)}>Danger orbit</a>
          <a href="#stories" onClick={() => setMenuOpen(false)}>Field notes</a>
          <a href="#beach-map" onClick={() => setMenuOpen(false)}>Read a beach</a>
          <a href="#safety" className="nav-cta" onClick={() => setMenuOpen(false)}>Safety check</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero__ambient" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="hero__copy">
            <motion.p className="eyebrow hero__eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Sparkles aria-hidden="true" /> An interactive beach-safety field guide
            </motion.p>
            <motion.h1 id="hero-title" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.2 }}>
              The beach is<br />not always <em>safe.</em>
            </motion.h1>
            <motion.p className="hero__lead" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.35 }}>
              Calm water, warm sand and a clear horizon can still hide fast-moving risks. Learn the patterns, then enjoy the coast with sharper eyes.
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.48 }}>
              <a className="button button--primary" href="#hazards">Explore the dangers <ArrowDown aria-hidden="true" /></a>
              <a className="button button--secondary" href="#safety">Start the safety guide <ArrowRight aria-hidden="true" /></a>
            </motion.div>
            <motion.div className="hero__stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <span><strong>09</strong> hidden patterns</span>
              <span><strong>06</strong> calm habits</span>
              <span><strong>01</strong> safer day</span>
            </motion.div>
          </div>

          <motion.div className="hero__stage" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}>
            <div className="hero__orbit-label"><span>Guide online</span><i /> Move to explore</div>
            {compact ? (
              <div className="hero__mobile-mascot"><AvatarGuide reaction="confident" size="large" label="Black-and-gold puzzle-piece beach safety guide" /></div>
            ) : (
              <Suspense fallback={<div className="hero-scene-fallback"><AvatarGuide reaction="neutral" size="large" /></div>}>
                <HeroScene />
              </Suspense>
            )}
            <div className="hero__float hero__float--flag" aria-hidden="true">⚑</div>
            <div className="hero__float hero__float--ring" aria-hidden="true" />
            <div className="hero__float hero__float--shell" aria-hidden="true">◒</div>
          </motion.div>
          <a className="hero__scroll" href="#hazards">Scroll to enter <ArrowDown aria-hidden="true" /></a>
        </section>

        <div className="signal-strip" aria-hidden="true">
          <span>READ THE WATER</span><i /><span>WATCH THE SKY</span><i /><span>RESPECT THE SAND</span><i /><span>LEAVE EARLY</span>
        </div>

        <HazardOrbit />

        <section className="stories section" id="stories" aria-labelledby="stories-title">
          <div className="section-heading stories__heading">
            <p className="eyebrow">Nine cinematic field notes</p>
            <h2 id="stories-title">What looks ordinary can change in seconds.</h2>
            <p>Each scene turns a hidden process into a visible signal—and one action you can remember.</p>
          </div>
          <div className="stories__list">{hazards.map((hazard, index) => <HazardSection key={hazard.id} hazard={hazard} index={index} />)}</div>
        </section>

        <section className="section map-section" id="beach-map" aria-labelledby="map-title">
          <div className="section-heading section-heading--split">
            <div><p className="eyebrow">How to read a beach</p><h2 id="map-title">Notice what changed.</h2></div>
            <p>Most warning signs are environmental. Tap a gold signal on the map to practice reading the scene.</p>
          </div>
          <div className="map-section__layout">
            <BeachMap onSelect={setMapHotspot} />
            <aside className="map-guide-card">
              <AvatarGuide reaction={mapHotspot ? "warning" : "confident"} size="medium" label="Mascot looking toward the selected beach warning sign" />
              <p className="eyebrow">Guide observation</p>
              <h3>{mapHotspot?.title ?? "Start with the whole shoreline."}</h3>
              <p>{mapHotspot?.description ?? "Scan the flag, water, sky and land before choosing where to sit or swim."}</p>
              <span>{mapHotspot ? "Signal identified" : "Choose a hotspot"}</span>
            </aside>
          </div>
        </section>

        <SafetyChecklist />
        <FooterScene />
      </main>
      <footer className="site-footer"><span>Beach/Signals — an educational field guide.</span><span>Look first. Then step in.</span></footer>
    </MotionConfig>
  );
}
