"use client";

import { useEffect } from "react";

// Define an interface for window that includes the MSStream property
interface WindowWithMSStream extends Window {
  MSStream?: unknown;
}

export const PlatformDetector = () => {
  useEffect(() => {
    try {
      const userAgent = window.navigator.userAgent;
      // Enhanced iOS detection (includes iPads identifying as Macs)
      const typedWindow = window as WindowWithMSStream;
      const isIOS = 
        /iPad|iPhone|iPod/.test(userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !typedWindow.MSStream);
      
      if (isIOS) {
        document.body.classList.add('is-ios-device');
      } else {
        document.body.classList.add('not-ios-device');
      }
    } catch (e) {
      console.error('Error detecting platform:', e);
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default PlatformDetector; 