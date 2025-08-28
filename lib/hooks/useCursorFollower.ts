"use client";
import { useMemo } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { rafThrottle } from "@utils/rafThrottle";

export function useCursorFollower(spring = { damping: 25, stiffness: 700 }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cursorX = useSpring(mouseX, spring);
  const cursorY = useSpring(mouseY, spring);

  const handleMouseMove = useMemo(
    () =>
      rafThrottle<React.MouseEvent<HTMLDivElement>>((e) => {
        mouseX.set(e.clientX - 50);
        mouseY.set(e.clientY - 50);
      }),
    [mouseX, mouseY]
  );

  return { cursorX, cursorY, handleMouseMove } as const;
}

