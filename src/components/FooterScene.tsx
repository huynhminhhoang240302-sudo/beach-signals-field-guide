"use client";

import { ArrowUp, LifeBuoy, RotateCcw } from "lucide-react";
import AvatarGuide from "./AvatarGuide";

export function FooterScene() {
  return (
    <section className="footer-scene" aria-labelledby="footer-title">
      <div className="footer-scene__sun" aria-hidden="true" />
      <div className="footer-scene__water" aria-hidden="true"><i /><i /><i /></div>
      <div className="footer-scene__flag" aria-hidden="true"><i /></div>
      <div className="footer-scene__mascot"><AvatarGuide reaction="relieved" size="large" label="Mascot giving a relieved thumbs-up beside a safety flag" /></div>
      <div className="footer-scene__copy">
        <p className="eyebrow"><LifeBuoy aria-hidden="true" /> Leave with the tide, not the lesson</p>
        <h2 id="footer-title">Respect the Beach.<br />Enjoy It Safely.</h2>
        <p>A little awareness keeps the day open, playful and memorable for the right reasons.</p>
        <div className="hero-actions">
          <a className="button button--primary" href="#stories">Review the guide <ArrowUp aria-hidden="true" /></a>
          <a className="button button--secondary" href="#top">Explore again <RotateCcw aria-hidden="true" /></a>
        </div>
        <small>Conditions change quickly. Always follow local lifeguards, posted warnings and emergency services.</small>
      </div>
    </section>
  );
}

export default FooterScene;
