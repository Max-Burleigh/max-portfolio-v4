"use client";
import React, { memo } from "react";
import { motion, TargetAndTransition, VariantLabels } from "framer-motion";

interface AuroraBlobProps {
  className?: string;
  style?: React.CSSProperties;
  initial?: boolean | TargetAndTransition | VariantLabels;
  animate?: boolean | TargetAndTransition | VariantLabels;
  transition?: Record<string, unknown>;
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
