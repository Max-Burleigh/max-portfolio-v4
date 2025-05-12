import React from "react";

export interface TechItem {
  icon: React.ReactNode;
  label: string;
}

export interface TechStackProps {
  items: TechItem[];
  className?: string;
  style?: React.CSSProperties;
}

const TechStack: React.FC<TechStackProps> = ({
  items,
  className = "",
  style = {},
}) => (
  <div
    className={`tech-stack ${className}`}
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      alignItems: "center",
      justifyContent: "flex-start",
      ...style,
    }}
  >
    {items.map((item, index) => (
      <span
        className="tech-item"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "clamp(0.75rem, 2vw, 1rem)",
        }}
        key={index}
      >
        {item.icon}
        {item.label}
      </span>
    ))}
  </div>
);

export default TechStack;
