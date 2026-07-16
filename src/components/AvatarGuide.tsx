"use client";

import { motion } from "framer-motion";
import type { MascotReaction } from "@/src/data/hazards";

type AvatarGuideProps = {
  reaction?: MascotReaction | "confident";
  label?: string;
  size?: "small" | "medium" | "large";
  className?: string;
};

export function AvatarGuide({
  reaction = "neutral",
  label = "Beach safety guide mascot",
  size = "medium",
  className = "",
}: AvatarGuideProps) {
  return (
    <motion.figure
      className={`avatar-guide avatar-guide--${size} avatar-guide--${reaction} ${className}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      aria-label={label}
      role="img"
    >
      <span className="avatar-guide__halo" aria-hidden="true" />
      <span className="avatar-guide__frame">
        {/* The 48 KB WebP is already optimized and is also used as a WebGL texture. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mascot.webp" alt="" draggable="false" />
      </span>
      <span className="avatar-guide__reaction" aria-hidden="true"><i /><i /><i /></span>
    </motion.figure>
  );
}

export default AvatarGuide;
