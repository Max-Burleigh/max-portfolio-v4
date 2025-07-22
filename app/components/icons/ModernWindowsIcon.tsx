"use client";
import React from "react";

const ModernWindowsIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  style,
  className,
  ...props
}) => (
  <svg
    viewBox="0 0 32 32"
    width={32}
    height={32}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
    className={className}
    {...props}
  >
    <rect x="2" y="2" width="12" height="12" fill="#fff" />
    <rect x="16" y="2" width="12" height="12" fill="#fff" />
    <rect x="2" y="16" width="12" height="12" fill="#fff" />
    <rect x="16" y="16" width="12" height="12" fill="#fff" />
  </svg>
);

export default ModernWindowsIcon;
