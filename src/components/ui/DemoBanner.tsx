"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "flash-sale-engine-demo-banner-dismissed";

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (window.sessionStorage.getItem(STORAGE_KEY) === "true") {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="demo-banner" role="note">
      <div className="container demo-banner__inner">
        <p className="demo-banner__copy">
          <span className="demo-banner__accent">Demo</span>
          <span>This project is a UI demonstration. No real products or purchases are involved.</span>
        </p>
        <button
          aria-label="Dismiss demo banner"
          className="demo-banner__close"
          onClick={() => {
            window.sessionStorage.setItem(STORAGE_KEY, "true");
            setIsVisible(false);
          }}
          type="button"
        >
          X
        </button>
      </div>
    </div>
  );
}
