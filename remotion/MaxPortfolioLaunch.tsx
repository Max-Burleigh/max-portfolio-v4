import React, { CSSProperties } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { launchCopy, projectShots } from "./videoData";

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeSoft = Easing.bezier(0.65, 0, 0.35, 1);

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const container: CSSProperties = {
  background:
    "radial-gradient(circle at 82% 12%, rgba(137, 92, 233, 0.34), transparent 32%), radial-gradient(circle at 8% 82%, rgba(53, 243, 235, 0.18), transparent 30%), linear-gradient(135deg, #04101d 0%, #0a1427 52%, #1f1b42 100%)",
  color: "white",
  fontFamily:
    "Manrope, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  overflow: "hidden",
};

const glass: CSSProperties = {
  border: "1px solid rgba(173, 214, 255, 0.22)",
  background: "linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.035))",
  boxShadow: "0 24px 90px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
  backdropFilter: "blur(22px)",
};

const seconds = (
  frame: number,
  fps: number,
  points: number[],
  values: number[],
  easing = easeOut
) =>
  interpolate(
    frame,
    points.map((point) => point * fps),
    values,
    { ...clamp, easing }
  );

const TextIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: CSSProperties;
}> = ({ children, delay = 0, y = 28, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = seconds(frame, fps, [delay, delay + 0.55], [0, 1]);
  const translateY = seconds(frame, fps, [delay, delay + 0.75], [y, 0]);

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)`, ...style }}>
      {children}
    </div>
  );
};

const AuroraField = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const drift = frame / fps;
  const sweep = interpolate(frame, [0, durationInFrames], [-940, 1180], clamp);

  return (
    <>
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 760,
          borderRadius: "50%",
          left: -220 + Math.sin(drift * 0.52) * 44,
          bottom: -260 + Math.cos(drift * 0.42) * 34,
          background: "radial-gradient(circle, rgba(53, 243, 235, 0.2), transparent 62%)",
          filter: "blur(24px)",
          opacity: 0.78,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 920,
          height: 920,
          borderRadius: "50%",
          right: -270 + Math.cos(drift * 0.38) * 52,
          top: -340 + Math.sin(drift * 0.48) * 38,
          background: "radial-gradient(circle, rgba(159, 112, 255, 0.28), transparent 60%)",
          filter: "blur(28px)",
          opacity: 0.78,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.052) 48%, transparent 57%)",
          transform: `translateX(${sweep}px) skewX(-14deg)`,
          opacity: 0.38,
        }}
      />
    </>
  );
};

const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOpacity = seconds(frame, fps, [7.4, 8.6], [1, 0], easeSoft);
  const cardScale = seconds(frame, fps, [0.2, 8.4], [0.94, 1.02], easeSoft);
  const cardLift = seconds(frame, fps, [7.4, 8.6], [0, -28], easeSoft);
  const headshotRotate = seconds(frame, fps, [0.8, 7.3], [-7, 3], easeSoft);

  return (
    <AbsoluteFill
      style={{
        opacity: exitOpacity,
        transform: `translateY(${cardLift}px)`,
        padding: 84,
      }}
    >
      <div
        style={{
          ...glass,
          position: "relative",
          height: "100%",
          borderRadius: 42,
          overflow: "hidden",
          transform: `scale(${cardScale})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 78% 12%, rgba(137, 92, 233, 0.25), transparent 34%), radial-gradient(circle at 0% 88%, rgba(53,243,235,0.11), transparent 30%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 2, padding: "72px 82px" }}>
          <TextIn delay={0.15} style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 12, textTransform: "uppercase" }}>
              {launchCopy.eyebrow}
            </div>
            <div style={{ color: "#35f3eb", fontSize: 22, fontWeight: 850 }}>New site live</div>
          </TextIn>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 430px", gap: 90, alignItems: "center" }}>
            <div style={{ paddingTop: 132 }}>
              <TextIn delay={0.45}>
                <div style={{ color: "#35f3eb", fontSize: 27, fontWeight: 900, letterSpacing: 10 }}>
                  PORTFOLIO REDESIGN
                </div>
              </TextIn>
              <TextIn delay={0.68}>
                <h1
                  style={{
                    margin: "28px 0 0",
                    fontSize: 112,
                    lineHeight: 0.9,
                    maxWidth: 900,
                    letterSpacing: 0,
                    fontWeight: 950,
                  }}
                >
                  {launchCopy.title}
                </h1>
              </TextIn>
              <TextIn delay={1.1}>
                <p
                  style={{
                    margin: "36px 0 0",
                    maxWidth: 700,
                    color: "rgba(238,246,255,0.76)",
                    fontSize: 34,
                    lineHeight: 1.22,
                    fontWeight: 650,
                  }}
                >
                  {launchCopy.subtitle}
                </p>
              </TextIn>
            </div>

            <TextIn delay={0.95} y={70}>
              <div style={{ position: "relative", width: 410, height: 545, marginLeft: "auto" }}>
                <div
                  style={{
                    ...glass,
                    position: "absolute",
                    inset: "26px 32px",
                    borderRadius: 36,
                    transform: `rotate(${headshotRotate}deg)`,
                    overflow: "hidden",
                  }}
                >
                  <Img
                    src={staticFile("new-headshot-portfolio.png")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    right: -4,
                    bottom: 38,
                    width: 256,
                    borderRadius: 26,
                    padding: "26px 28px",
                    background: "rgba(5,18,34,0.76)",
                    border: "1px solid rgba(53,243,235,0.28)",
                    boxShadow: "0 18px 55px rgba(0,0,0,0.3)",
                  }}
                >
                  <div style={{ color: "#35f3eb", fontSize: 34, fontWeight: 900 }}>Take a look.</div>
                  <div style={{ marginTop: 6, color: "rgba(255,255,255,0.72)", fontSize: 20, lineHeight: 1.2 }}>
                    {launchCopy.cta}
                  </div>
                </div>
              </div>
            </TextIn>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ProjectCard: React.FC<(typeof projectShots)[number] & { index: number }> = ({
  title,
  label,
  image,
  accent,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = seconds(frame, fps, [0.2 + index * 0.12, 0.9 + index * 0.12], [0, 1]);
  const float = Math.sin((frame + index * 18) / 34) * 6;

  return (
    <div
      style={{
        ...glass,
        width: 322,
        height: 560,
        borderRadius: 32,
        padding: 18,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 62 + float}px) scale(${0.94 + progress * 0.06})`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.34), 0 0 44px ${accent}26`,
      }}
    >
      <div
        style={{
          height: 398,
          borderRadius: 24,
          overflow: "hidden",
          background: "rgba(3,10,20,0.58)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Img
          src={staticFile(image)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <div style={{ padding: "22px 8px 0" }}>
        <div style={{ color: accent, fontSize: 28, fontWeight: 900, lineHeight: 1.05 }}>{title}</div>
        <div style={{ marginTop: 8, color: "rgba(238,246,255,0.7)", fontSize: 20, lineHeight: 1.2 }}>{label}</div>
      </div>
    </div>
  );
};

const WorkScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitOpacity = seconds(frame, fps, [7.0, 8.0], [1, 0], easeSoft);
  const exitY = seconds(frame, fps, [7.0, 8.0], [0, -22], easeSoft);

  return (
    <AbsoluteFill style={{ opacity: exitOpacity, transform: `translateY(${exitY}px)`, padding: "84px 104px" }}>
      <TextIn delay={0.08}>
        <div style={{ color: "#35f3eb", fontSize: 24, fontWeight: 900, letterSpacing: 10 }}>
          RECENT WORK
        </div>
      </TextIn>
      <TextIn delay={0.28}>
        <h2 style={{ margin: "20px 0 0", fontSize: 74, lineHeight: 0.98, maxWidth: 760, fontWeight: 950 }}>
          A few builds from the portfolio.
        </h2>
      </TextIn>

      <div
        style={{
          position: "absolute",
          left: 104,
          right: 104,
          bottom: 76,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 26,
        }}
      >
        {projectShots.map((project, index) => (
          <ProjectCard key={project.title} {...project} index={index} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const introOpacity = seconds(frame, fps, [0.35, 1.25], [0, 1]);
  const introScale = seconds(frame, fps, [0.35, 1.35], [0.965, 1], easeSoft);
  const shine = interpolate(frame, [20, 190], [-420, 680], clamp);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 122,
        opacity: introOpacity,
        transform: `scale(${introScale})`,
      }}
    >
      <div
        style={{
          ...glass,
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 46,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 22%, rgba(53,243,235,0.17), transparent 42%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 420,
            height: "140%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
            transform: `translateX(${shine}px) rotate(17deg)`,
            opacity: 0.46,
          }}
        />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <TextIn delay={0.55}>
            <div style={{ color: "#35f3eb", fontSize: 28, fontWeight: 900, letterSpacing: 12 }}>
              NOW LIVE
            </div>
          </TextIn>
          <TextIn delay={0.82}>
            <h2 style={{ margin: "26px auto 0", fontSize: 118, lineHeight: 0.9, maxWidth: 1120, fontWeight: 950 }}>
              Come check it out.
            </h2>
          </TextIn>
          <TextIn delay={1.25}>
            <div
              style={{
                margin: "54px auto 0",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                border: "1px solid rgba(53,243,235,0.42)",
                padding: "23px 42px",
                background: "rgba(53,243,235,0.12)",
                color: "white",
                fontSize: 34,
                fontWeight: 900,
                boxShadow: "0 0 42px rgba(53,243,235,0.22)",
              }}
            >
              {launchCopy.cta}
            </div>
          </TextIn>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MaxPortfolioLaunch = () => (
  <AbsoluteFill style={container}>
    <AuroraField />
    <Sequence from={0} durationInFrames={270}>
      <IntroScene />
    </Sequence>
    <Sequence from={258} durationInFrames={240}>
      <WorkScene />
    </Sequence>
    <Sequence from={498} durationInFrames={252}>
      <CtaScene />
    </Sequence>
  </AbsoluteFill>
);

export const LaunchThumbnail = () => (
  <AbsoluteFill style={container}>
    <AuroraField />
    <CtaScene />
  </AbsoluteFill>
);
