import { CSSProperties, ReactNode } from "react";

export interface ProjectCardProps {
  title: string;
  description: ReactNode;
  websiteUrl?: string;
  techStack?: {
    icon: ReactNode;
    label: string;
  }[];
  previewUrl?: string; // previously iframeUrl
  previewTitle?: string; // previously iframeTitle
  previewClassName?: string; // previously iframeClassName
  imageUrl?: string;
  imageAlt?: string;
  imageTitle?: string;
  imageClassName?: string;
  imageBlurDataURL?: string; // Custom blur placeholder for image loading
  reverseLayout?: boolean;
  disablePhoneMockup?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  // For special interactions like the Full Leaf Tea example
  onMouseEnter?: () => void;
  onClick?: () => void;
}
