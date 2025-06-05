"use client";
import React from "react";
import { motion } from "framer-motion";

interface InteractiveIframeProps {
  src: string;
  title: string;
  className?: string;
}

const InteractiveIframe: React.FC<InteractiveIframeProps> = ({
  src,
  title,
  className,
}) => {
  return (
    <div className="interactive-iframe-container">
      <iframe
        src={src}
        title={title}
        className={className}
        loading="lazy"
        allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
      <motion.div
        className="iframe-message"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="message-content">
          <div className="message-icon">✨</div>
          <p>
            For the full experience, visit{' '}
            <a href={src} target="_blank" rel="noopener noreferrer">
              the website
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveIframe;
