"use client";

import { useEffect } from "react";

export function ControlViewport(): null {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const resizeViewport = () => {
      const viewport = document.querySelector("meta[name=viewport]");
      if (!viewport) return;
      viewport.setAttribute(
        "content",
        window.outerWidth > 400
          ? `width=device-width,initial-scale=1.0,maximum-scale=1.0`
          : `width=400,maximum-scale=1.0`
      );
    };

    window.addEventListener("resize", resizeViewport);
    return () => window.removeEventListener("resize", resizeViewport);
  }, []);

  return null;
}
