"use client";
// react-scan must be imported before react
import { scan } from "react-scan";
import { useEffect } from "react";

export function ReactScan() {
  useEffect(() => {
    // Enable only in development; default import is dev-only
    scan({ enabled: process.env.NODE_ENV !== "production" });
  }, []);

  return null;
}

