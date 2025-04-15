"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";

interface AuroraBlobProps {
  className?: string;
  style?: React.CSSProperties;
  initial?: any; // Using 'any' for Framer Motion props; refine as needed.
  animate?: any;
  transition?: any;
}

const AuroraBlob = memo(
  ({ className, style, initial, animate, transition }: AuroraBlobProps) => (
    <motion.div
      className={`aurora-blob ${className}`}
      style={{
        ...style,
        willChange: "transform, opacity", // Hardware acceleration hint
      }}
      initial={initial}
      animate={animate}
      transition={transition}
    />
  )
);

AuroraBlob.displayName = "AuroraBlob";

export default AuroraBlob;
