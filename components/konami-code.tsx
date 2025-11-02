"use client";

import { useEffect, useState } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiCode() {
  const [keys, setKeys] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const newKeys = [...prev, e.key].slice(-KONAMI_CODE.length);
        
        if (newKeys.join(",") === KONAMI_CODE.join(",") && !activated) {
          setActivated(true);
          playNetflixIntro();
          setTimeout(() => setActivated(false), 5000);
          return [];
        }
        
        return newKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activated]);

  const playNetflixIntro = () => {
    const intro = document.createElement("div");
    intro.className = "netflix-intro-overlay";
    intro.innerHTML = `
      <div class="netflix-intro-animation">
        <div class="netflix-logo-big">VEDANT</div>
      </div>
    `;
    document.body.appendChild(intro);
    setTimeout(() => intro.remove(), 4000);
  };

  return null;
}
