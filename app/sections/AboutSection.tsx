"use client";
import React, { useRef, useState, useCallback, useMemo, forwardRef, useEffect } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { MdArrowForward, MdCode, MdMood, MdOutlineMail, MdRocketLaunch, MdStar } from "react-icons/md";
import { rafThrottle, useIsMobile, useEntranceStagger } from "@lib/hooks";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@lib/constants";
import { projects } from "@/content/projects";

const round = (num: number, fix = 2) => parseFloat(num.toFixed(fix));
interface AboutSectionProps {
  onViewPortfolio?: () => void;
  onContact?: () => void;
}

const visibleProjectCount = projects.filter((project) => !project.hidden).length;
const githubUrl = "https://github.com/maxburleigh";
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const signOr = (value: number, fallback: number) => {
  if (Math.abs(value) < 0.01) return fallback;
  return value < 0 ? -1 : 1;
};

type PortraitPointerState = {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  velocityX: number;
  velocityY: number;
  edgePowerX: number;
  edgePowerY: number;
};

const AboutSection = forwardRef<HTMLDivElement, AboutSectionProps>(function AboutSection({ onViewPortfolio, onContact }, ref) {
  // Local mobile detection for layout tweaks
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Tilt effect state
  const portraitRef = useRef<HTMLDivElement>(null);
  const rotateY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const flipRotateY = useMotionValue(0);
  const flipRotateX = useMotionValue(0);
  const flipRotateZ = useMotionValue(0);
  const flickX = useMotionValue(0);
  const flickY = useMotionValue(0);
  // Increase base perspective to 1000px for realistic 3D (200px was fisheye)
  // Revised: 600px for more dramatic 3D effect without fisheye
  const transformPerspective = useMotionValue(600);

  // Use slightly heavier, critical damping for a "premium glass" feel
  const rotateYSpring = useSpring(rotateY, { damping: 20, stiffness: 150 });
  const rotateXSpring = useSpring(rotateX, { damping: 20, stiffness: 150 });
  const transformPerspectiveSpring = useSpring(transformPerspective, {
    damping: 30,
    stiffness: 200,
  });
  const portraitRotateY = useTransform(() => rotateYSpring.get() + flipRotateY.get());
  const portraitRotateX = useTransform(() => rotateXSpring.get() + flipRotateX.get());

  // Dynamic shadow based on tilt (lift effect)
  const shadowX = useTransform(rotateYSpring, (val) => -val * 2);
  const shadowY = useTransform(rotateXSpring, (val) => val * 2 + 10);
  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px 24px rgba(0, 0, 0, 0.4)`;

  const [isAnimating, setAnimating] = useState(false);
  const isAnimatingRef = useRef(isAnimating);
  const isFlippingRef = useRef(false);
  const pointerStateRef = useRef<PortraitPointerState | null>(null);
  const flipControlsRef = useRef<Array<{ stop: () => void }>>([]);
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);
  useEffect(() => {
    return () => {
      flipControlsRef.current.forEach((control) => control.stop());
    };
  }, []);

  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const entranceRef = useRef<HTMLDivElement>(null);

  const handlePortraitMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isFlippingRef.current || pointerStateRef.current) return;
      setAnimating(true);
      if (!portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      const absolute = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      const percent = {
        x: round((100 / rect.width) * absolute.x),
        y: round((100 / rect.height) * absolute.y),
      };
      const center = { x: percent.x - 50, y: percent.y - 50 };
      // Increased rotation range: /6 instead of /12, and /8 instead of /16
      rotateY.set(round(center.x / 6));
      rotateX.set(round(-center.y / 8));
      // Keep perspective stable at 1000px for realistic 3D
      transformPerspective.set(1000);
      setGlare({ x: percent.x, y: percent.y, opacity: 0.4 });
    },
    [rotateY, rotateX, transformPerspective]
  );

  const throttledPortraitMouseMove = useMemo(
    () => rafThrottle<React.MouseEvent<HTMLDivElement>>(handlePortraitMouseMove),
    [handlePortraitMouseMove]
  );

  const handlePortraitMouseLeave = () => {
    if (isFlippingRef.current || pointerStateRef.current) return;
    setAnimating(false);
    isAnimatingRef.current = false;
    rotateY.set(0);
    rotateX.set(0);
    transformPerspective.set(1000);
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const runPortraitFlick = useCallback(
    ({
      clientX,
      clientY,
      velocityX = 0,
      velocityY = 0,
      dragX = 0,
      dragY = 0,
    }: {
      clientX?: number;
      clientY?: number;
      velocityX?: number;
      velocityY?: number;
      dragX?: number;
      dragY?: number;
    } = {}) => {
      if (!portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      const x = clientX ?? rect.left + rect.width * 0.82;
      const y = clientY ?? rect.top + rect.height * 0.42;
      const localX = clamp(x - rect.left, 0, rect.width);
      const localY = clamp(y - rect.top, 0, rect.height);
      const normalizedX = localX / rect.width - 0.5;
      const normalizedY = localY / rect.height - 0.5;
      const edgePowerX = clamp(Math.abs(normalizedX) * 2, 0, 1);
      const edgePowerY = clamp(Math.abs(normalizedY) * 2, 0, 1);
      const horizontalIntent = Math.abs(velocityX) + Math.abs(dragX) * 0.012 + edgePowerX * 0.46;
      const verticalIntent = Math.abs(velocityY) + Math.abs(dragY) * 0.012 + edgePowerY * 0.46;
      const useVerticalSpin = verticalIntent > horizontalIntent * 1.06;
      const side = useVerticalSpin ? (normalizedY < 0 ? 1 : -1) : normalizedX < 0 ? -1 : 1;
      const direction = useVerticalSpin ? signOr(-(velocityY || dragY), side) : signOr(velocityX || dragX, side);
      const edgePower = useVerticalSpin ? edgePowerY : edgePowerX;
      const speed = Math.hypot(velocityX, velocityY);
      const axisVelocity = useVerticalSpin ? -velocityY : velocityX;
      const axisDrag = useVerticalSpin ? -dragY : dragX;
      const impulse = Math.abs(axisVelocity) + Math.abs(axisDrag) * 0.012 + edgePower * 0.38;
      const rotationCount = prefersReducedMotion ? 0 : clamp(Math.ceil(0.72 + impulse * 0.72), 1, 2);
      const targetAngle = direction * 360 * rotationCount;
      const angularVelocity = prefersReducedMotion
        ? 0
        : direction * clamp(420 + Math.abs(axisVelocity) * 520 + Math.abs(axisDrag) * 3.2 + edgePower * 260, 430, 1260);
      const preKick = prefersReducedMotion ? 5 : 4 + edgePower * 8 + clamp(speed * 1.1, 0, 4);
      const crossWobble = prefersReducedMotion
        ? (useVerticalSpin ? normalizedX : normalizedY) * -4
        : useVerticalSpin
          ? normalizedX * 13 + clamp(velocityX * 2.3, -7, 7) + clamp(dragX * 0.025, -4, 4)
          : normalizedY * -13 + clamp(velocityY * 2.3, -7, 7) + clamp(dragY * -0.025, -4, 4);
      const lateralKick = prefersReducedMotion
        ? 0
        : useVerticalSpin
          ? clamp(normalizedX * 10 + velocityX * 2 + dragX * 0.018, -10, 10)
          : direction * clamp(4 + edgePower * 6 + speed * 2, 5, 12);
      const liftKick = prefersReducedMotion
        ? 0
        : useVerticalSpin
          ? -direction * clamp(4 + edgePower * 7 + Math.abs(velocityY) * 2, 5, 13)
          : clamp(-5 - edgePower * 5 + dragY * 0.02 + velocityY * 1.1, -14, 4);
      const rollKick = prefersReducedMotion ? 0 : -direction * clamp(1.8 + speed * 0.6 + edgePower * 1.2, 1.8, 4.2);
      const percentX = round((localX / rect.width) * 100);
      const percentY = round((localY / rect.height) * 100);

      flipControlsRef.current.forEach((control) => control.stop());
      flipControlsRef.current = [];
      isFlippingRef.current = true;
      setAnimating(true);
      rotateY.set(0);
      rotateX.set(0);
      flipRotateY.set(0);
      flipRotateX.set(0);
      flipRotateZ.set(0);
      flickX.set(0);
      flickY.set(0);
      transformPerspective.set(1040);
      setGlare({ x: percentX, y: percentY, opacity: 0.45 });

      const finishFlip = () => {
        flipRotateY.set(0);
        flipRotateX.set(0);
        flipRotateZ.set(0);
        flickX.set(0);
        flickY.set(0);
        transformPerspective.set(1000);
        setGlare({ x: 50, y: 50, opacity: 0 });
        isFlippingRef.current = false;
        setAnimating(false);
      };

      const primarySpin = useVerticalSpin ? flipRotateX : flipRotateY;
      const crossAxisSpin = useVerticalSpin ? flipRotateY : flipRotateX;
      primarySpin.set(prefersReducedMotion ? direction * preKick : direction * -preKick);
      crossAxisSpin.set(crossWobble);
      flipRotateZ.set(rollKick);
      flickX.set(lateralKick);
      flickY.set(liftKick);

      const spinControl = animate(primarySpin, prefersReducedMotion ? 0 : targetAngle, {
        type: "spring",
        stiffness: prefersReducedMotion ? 260 : 42,
        damping: prefersReducedMotion ? 28 : 13.5,
        mass: prefersReducedMotion ? 0.7 : 1.55,
        velocity: angularVelocity,
        restDelta: 0.18,
        restSpeed: 5,
        onComplete: finishFlip,
      });
      const crossAxisControl = animate(crossAxisSpin, 0, {
        type: "spring",
        stiffness: prefersReducedMotion ? 260 : 70,
        damping: prefersReducedMotion ? 28 : 15,
        mass: prefersReducedMotion ? 0.7 : 1.35,
        velocity: useVerticalSpin ? velocityX * 38 : velocityY * -38,
      });
      const zControl = animate(flipRotateZ, 0, {
        type: "spring",
        stiffness: prefersReducedMotion ? 260 : 58,
        damping: prefersReducedMotion ? 28 : 14,
        mass: prefersReducedMotion ? 0.7 : 1.45,
        velocity: -direction * speed * 26,
      });
      const nudgeXControl = animate(flickX, 0, {
        type: "spring",
        stiffness: prefersReducedMotion ? 260 : 62,
        damping: prefersReducedMotion ? 28 : 13.5,
        mass: prefersReducedMotion ? 0.7 : 1.55,
        velocity: velocityX * 46,
      });
      const nudgeYControl = animate(flickY, 0, {
        type: "spring",
        stiffness: prefersReducedMotion ? 260 : 58,
        damping: prefersReducedMotion ? 28 : 13,
        mass: prefersReducedMotion ? 0.7 : 1.6,
        velocity: velocityY * 46,
      });
      flipControlsRef.current = [spinControl, crossAxisControl, zControl, nudgeXControl, nudgeYControl];
    },
    [flickX, flickY, flipRotateX, flipRotateY, flipRotateZ, prefersReducedMotion, rotateX, rotateY, transformPerspective]
  );

  const handlePortraitPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (!portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      const localX = clamp(e.clientX - rect.left, 0, rect.width);
      const localY = clamp(e.clientY - rect.top, 0, rect.height);
      const normalizedX = localX / rect.width - 0.5;
      const normalizedY = localY / rect.height - 0.5;
      const edgePowerX = clamp(Math.abs(normalizedX) * 2, 0, 1);
      const edgePowerY = clamp(Math.abs(normalizedY) * 2, 0, 1);
      const useVerticalSpin = edgePowerY > edgePowerX * 1.06;
      const side = useVerticalSpin ? (normalizedY < 0 ? 1 : -1) : normalizedX < 0 ? -1 : 1;
      const edgePower = useVerticalSpin ? edgePowerY : edgePowerX;

      flipControlsRef.current.forEach((control) => control.stop());
      flipControlsRef.current = [];
      isFlippingRef.current = false;
      pointerStateRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        lastTime: e.timeStamp,
        velocityX: 0,
        velocityY: 0,
        edgePowerX,
        edgePowerY,
      };

      e.currentTarget.setPointerCapture(e.pointerId);
      setAnimating(true);
      if (useVerticalSpin) {
        rotateX.set(side * (4 + edgePower * 6));
        rotateY.set(clamp(normalizedX * 8, -6, 6));
      } else {
        rotateY.set(side * (4 + edgePower * 6));
        rotateX.set(clamp(normalizedY * -10, -8, 8));
      }
      flipRotateY.set(0);
      flipRotateX.set(0);
      flipRotateZ.set(0);
      flickX.set(0);
      flickY.set(0);
      transformPerspective.set(900);
      setGlare({ x: round((localX / rect.width) * 100), y: round((localY / rect.height) * 100), opacity: 0.48 });
    },
    [flickX, flickY, flipRotateX, flipRotateY, flipRotateZ, rotateX, rotateY, transformPerspective]
  );

  const handlePortraitPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const pointerState = pointerStateRef.current;
      if (!pointerState || pointerState.pointerId !== e.pointerId || !portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      const now = e.timeStamp;
      const dt = Math.max(now - pointerState.lastTime, 16);
      const velocityX = (e.clientX - pointerState.lastX) / dt;
      const velocityY = (e.clientY - pointerState.lastY) / dt;
      const dragX = e.clientX - pointerState.startX;
      const dragY = e.clientY - pointerState.startY;
      const localX = clamp(e.clientX - rect.left, 0, rect.width);
      const localY = clamp(e.clientY - rect.top, 0, rect.height);
      const normalizedX = localX / rect.width - 0.5;
      const normalizedY = localY / rect.height - 0.5;
      const horizontalIntent = Math.abs(dragX) * 0.014 + pointerState.edgePowerX * 0.46;
      const verticalIntent = Math.abs(dragY) * 0.014 + pointerState.edgePowerY * 0.46;
      const useVerticalSpin = verticalIntent > horizontalIntent * 1.06;
      const edgePower = useVerticalSpin ? pointerState.edgePowerY : pointerState.edgePowerX;
      const axisSide = useVerticalSpin ? signOr(-dragY, normalizedY < 0 ? 1 : -1) : signOr(dragX, normalizedX < 0 ? -1 : 1);
      const windUp = axisSide * (5 + edgePower * 7) + (useVerticalSpin ? dragY * -0.075 : dragX * 0.075);

      pointerStateRef.current = {
        ...pointerState,
        lastX: e.clientX,
        lastY: e.clientY,
        lastTime: now,
        velocityX,
        velocityY,
      };

      if (useVerticalSpin) {
        rotateX.set(clamp(windUp, -18, 18));
        rotateY.set(clamp(normalizedX * 10 + dragX * 0.025, -12, 12));
      } else {
        rotateY.set(clamp(windUp, -18, 18));
        rotateX.set(clamp(normalizedY * -11 + dragY * -0.025, -12, 12));
      }
      setGlare({ x: round((localX / rect.width) * 100), y: round((localY / rect.height) * 100), opacity: 0.52 });
    },
    [rotateX, rotateY]
  );

  const finishPortraitPointer = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const pointerState = pointerStateRef.current;
      if (!pointerState || pointerState.pointerId !== e.pointerId) return;
      pointerStateRef.current = null;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      runPortraitFlick({
        clientX: e.clientX,
        clientY: e.clientY,
        velocityX: pointerState.velocityX,
        velocityY: pointerState.velocityY,
        dragX: e.clientX - pointerState.startX,
        dragY: e.clientY - pointerState.startY,
      });
    },
    [runPortraitFlick]
  );

  const cancelPortraitPointer = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const pointerState = pointerStateRef.current;
      if (!pointerState || pointerState.pointerId !== e.pointerId) return;
      pointerStateRef.current = null;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      rotateY.set(0);
      rotateX.set(0);
      setGlare({ x: 50, y: 50, opacity: 0 });
      setAnimating(false);
    },
    [rotateX, rotateY]
  );

  const handlePortraitKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      runPortraitFlick();
    },
    [runPortraitFlick]
  );

  // Entrance stagger for hero elements (runs after intro reveal completes)
  useEntranceStagger(entranceRef, { baseDelay: 0, step: 90 });
  return (
    <section ref={ref} id="about" className="section about-section relative w-screen min-h-dvh mx-auto flex flex-col justify-center items-center z-[2]">
      <div className="portfolio-stage about-stage">
        <header className="stage-topline" aria-label="Portfolio identity and social links">
          <a href="#about" className="stage-wordmark" aria-label="Max Burleigh home">
            <span>Max</span>
            <span>Burleigh</span>
          </a>
          <div className="stage-socials" aria-label="Social links">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <SiLinkedin aria-hidden="true" />
            </a>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <SiGithub aria-hidden="true" />
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email Max">
              <MdOutlineMail aria-hidden="true" />
            </a>
          </div>
        </header>

        <div
          ref={entranceRef}
          data-entrance="hero"
          className="about-stage-content"
        >
          <div className="hero-copy">
            <p data-entrance-item className="hero-eyebrow">
              Hey there <span aria-hidden="true">👋</span>
            </p>
            <h1 data-entrance-item className="hero-title">
              I&apos;m Max<br />Burleigh
            </h1>
            <div data-entrance-item className="hero-title-rule" aria-hidden="true" />
            <p data-entrance-item className="hero-subcopy">
              Web developer, designer, and tech support specialist focused on thoughtful, reliable digital products.
            </p>

            <div className="hero-actions" data-entrance-item>
              <motion.button
                type="button"
                onClick={onViewPortfolio}
                className="hero-button hero-button-primary"
                whileHover={{ scale: 1.035, x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View My Work</span>
                <MdArrowForward aria-hidden="true" />
              </motion.button>
              <motion.button
                type="button"
                onClick={onContact}
                className="hero-button hero-button-secondary"
                whileHover={{ scale: 1.035, x: 2 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>Connect</span>
                <MdOutlineMail aria-hidden="true" />
              </motion.button>
            </div>
          </div>

          <div data-entrance-item className="flex-shrink-0">
            <motion.div
              ref={portraitRef}
              role="button"
              tabIndex={0}
              aria-label="Flick Max Burleigh portrait"
              className="portrait-frame hero-portrait"
              style={{
                rotateY: portraitRotateY,
                rotateX: portraitRotateX,
                rotateZ: flipRotateZ,
                x: flickX,
                y: flickY,
                transformPerspective: transformPerspectiveSpring,
                boxShadow,
                transformStyle: "preserve-3d",
                transformOrigin: "center",
                willChange: "transform",
              }}
              initial={false}
              transition={{ duration: 0.5 }}
              whileHover={isMobile ? undefined : { scale: 1.05, transition: { duration: 0.2 } }}
              onMouseMove={isMobile ? undefined : throttledPortraitMouseMove}
              onMouseLeave={isMobile ? undefined : handlePortraitMouseLeave}
              onPointerDown={handlePortraitPointerDown}
              onPointerMove={handlePortraitPointerMove}
              onPointerUp={finishPortraitPointer}
              onPointerCancel={cancelPortraitPointer}
              onKeyDown={handlePortraitKeyDown}
            >
              <motion.div
                className="portrait-glare"
                style={{
                  zIndex: 2,
                  mixBlendMode: "overlay",
                  position: "absolute",
                  transform: "translateZ(1px)",
                  width: "100%",
                  height: "100%",
                  borderRadius: "0.5rem",
                  transformStyle: "preserve-3d",
                }}
                initial={false}
                animate={{
                  background: `radial-gradient(
                  farthest-corner circle at ${glare.x}% ${glare.y}%,
                  rgba(255, 255, 255, 0.8) 10%,
                  rgba(255, 255, 255, 0.65) 20%,
                  rgba(0, 0, 0, 0.5) 90%
                )`,
                  opacity: glare.opacity,
                }}
              />
              <Image
                src="/new-headshot-portfolio.png"
                alt="Max Burleigh"
                fill
                sizes="(max-width: 768px) 640px, (max-width: 1279px) 720px, 820px"
                quality={100}
                unoptimized
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjMTkxYzIzIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+"
                className="portrait-image"
                style={{ objectFit: "cover", transform: "translateZ(20px)", borderRadius: "0.5rem" }}
                priority
              />
            </motion.div>
          </div>
        </div>

        <div className="hero-stats" data-entrance="stats">
          <div className="hero-stat">
            <span className="hero-stat-icon"><MdRocketLaunch aria-hidden="true" /></span>
            <span className="hero-stat-value">10+</span>
            <span className="hero-stat-label">Years Experience</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-icon"><MdCode aria-hidden="true" /></span>
            <span className="hero-stat-value">{visibleProjectCount}</span>
            <span className="hero-stat-label">Featured Projects</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-icon"><MdMood aria-hidden="true" /></span>
            <span className="hero-stat-value">100+</span>
            <span className="hero-stat-label">Happy Clients</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-icon"><MdStar aria-hidden="true" /></span>
            <span className="hero-stat-value">100%</span>
            <span className="hero-stat-label">Commitment</span>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AboutSection;
