"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CloudLightning, Flag, LifeBuoy, Mountain, Waves } from "lucide-react";

const principles = [
  { title: "Check local warnings", detail: "Read flags, posted notices and the day’s forecast before settling in.", icon: Flag },
  { title: "Swim near lifeguards", detail: "Choose a watched area and stay within the marked swimming zone.", icon: LifeBuoy },
  { title: "Skip large sand holes", detail: "Keep digging shallow and fill holes before leaving the beach.", icon: Waves },
  { title: "Give cliffs space", detail: "Stay well back from bluff edges and away from the base of crumbling slopes.", icon: Mountain },
  { title: "Leave during storms", detail: "At thunder, move off the beach and into a substantial enclosed building.", icon: CloudLightning },
  { title: "Use licensed operators", detail: "Check the crew, weather policy and safety equipment before an activity.", icon: BadgeCheck },
];

export function SafetyChecklist() {
  return (
    <section className="section checklist-section" id="safety" aria-labelledby="checklist-title">
      <div className="section-heading section-heading--split">
        <div><p className="eyebrow">Six calm habits</p><h2 id="checklist-title">A sixty-second safety check.</h2></div>
        <p>Good beach judgment is not about fear. It is about spotting change early and choosing the easy safe action.</p>
      </div>
      <div className="checklist-grid">
        {principles.map((principle, index) => {
          const Icon = principle.icon;
          return (
            <motion.article className="checklist-tile" key={principle.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.45, delay: index * 0.05 }}>
              <span className="checklist-tile__number">0{index + 1}</span>
              <Icon aria-hidden="true" />
              <h3>{principle.title}</h3>
              <p>{principle.detail}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export default SafetyChecklist;
