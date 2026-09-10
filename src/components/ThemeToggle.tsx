"use client";

import { useEffect, useState } from "react";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("theme", nextIsDark ? "dark" : "light");
  }

  if (!mounted) {
    return (
      <button
        aria-label="Toggle dark mode"
        className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/30 dark:bg-[#1b1b21] dark:text-stone-100 dark:focus-visible:ring-offset-[#121214]"
        type="button"
      >
        Theme
      </button>
    );
  }

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/30 dark:bg-[#1b1b21] dark:text-stone-100 dark:hover:bg-[#25252d] dark:focus-visible:ring-offset-[#121214] ${compact ? "w-full" : ""}`}
      onClick={toggleTheme}
      type="button"
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
