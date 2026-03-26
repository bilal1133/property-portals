"use client";

import { type ReactNode, useEffect, useState } from "react";

export function CollapsingHeader({
  topBar,
  lowerBars,
}: {
  topBar: ReactNode;
  lowerBars: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setCollapsed(window.scrollY > 28);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 overflow-x-clip border-b border-line bg-white/92 shadow-[0_18px_48px_rgba(16,24,40,0.12)] backdrop-blur-md">
      {topBar}
      <div
        className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
          collapsed
            ? "pointer-events-none max-h-0 -translate-y-2 opacity-0"
            : "max-h-[16rem] translate-y-0 opacity-100"
        }`}
        aria-hidden={collapsed}
      >
        {lowerBars}
      </div>
    </header>
  );
}
