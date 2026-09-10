"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type InteractiveArtCardProps = {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
};

const springConfig = {
  stiffness: 180,
  damping: 20,
  mass: 0.7
};

export function InteractiveArtCard({ children, className = "", maxTilt = 6 }: InteractiveArtCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, springConfig);
  const springY = useSpring(rotateY, springConfig);

  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const update = () => {
      setCanTilt(mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  const tiltDisabled = prefersReducedMotion || !canTilt;

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (tiltDisabled || !cardRef.current) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const x = (0.5 - py) * maxTilt;
    const y = (px - 0.5) * maxTilt;

    rotateX.set(x);
    rotateY.set(y);
  }

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{
        rotateX: tiltDisabled ? 0 : springX,
        rotateY: tiltDisabled ? 0 : springY,
        transformStyle: "preserve-3d"
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      whileHover={tiltDisabled ? undefined : { scale: 1.018 }}
      transition={{ type: "spring", stiffness: 180, damping: 20, mass: 0.7 }}
    >
      {children}
    </motion.div>
  );
}
