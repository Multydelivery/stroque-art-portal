"use client";

import { motion, useReducedMotion } from "motion/react";

type BlobConfig = {
  className: string;
  animate: {
    x: number[];
    y: number[];
    scale: number[];
    rotate: number[];
  };
  duration: number;
};

const BLOBS: BlobConfig[] = [
  {
    className: "-left-24 top-[-8rem] h-[32rem] w-[32rem] bg-[radial-gradient(circle_at_30%_30%,rgba(162,70,255,0.5),rgba(36,20,60,0.12)_68%,transparent_72%)]",
    animate: {
      x: [0, 42, 10, 0],
      y: [0, 24, 58, 0],
      scale: [1, 1.08, 0.98, 1],
      rotate: [0, 5, -3, 0]
    },
    duration: 19
  },
  {
    className: "right-[-7rem] top-[14%] h-[28rem] w-[28rem] bg-[radial-gradient(circle_at_50%_45%,rgba(245,98,171,0.46),rgba(58,21,52,0.15)_65%,transparent_72%)]",
    animate: {
      x: [0, -45, -18, 0],
      y: [0, 40, 8, 0],
      scale: [1, 0.95, 1.06, 1],
      rotate: [0, -4, 2, 0]
    },
    duration: 23
  },
  {
    className: "bottom-[-10rem] left-[22%] h-[34rem] w-[34rem] bg-[radial-gradient(circle_at_48%_38%,rgba(240,146,63,0.36),rgba(66,34,20,0.12)_66%,transparent_74%)]",
    animate: {
      x: [0, -30, 20, 0],
      y: [0, -40, -15, 0],
      scale: [1, 1.05, 0.96, 1],
      rotate: [0, 3, -2, 0]
    },
    duration: 21
  },
  {
    className: "bottom-[5%] right-[18%] h-[22rem] w-[22rem] bg-[radial-gradient(circle_at_42%_35%,rgba(97,177,230,0.24),rgba(24,40,66,0.08)_64%,transparent_74%)]",
    animate: {
      x: [0, 16, -14, 0],
      y: [0, -18, 10, 0],
      scale: [1, 1.04, 0.98, 1],
      rotate: [0, 2, -2, 0]
    },
    duration: 17
  }
];

export function LivingArtBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#120f14]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(255,211,120,0.08),transparent_44%),radial-gradient(circle_at_88%_18%,rgba(155,102,255,0.08),transparent_40%),linear-gradient(160deg,#120f14_0%,#17101f_52%,#0c0c10_100%)]" />

      {BLOBS.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: blob.animate.x,
                  y: blob.animate.y,
                  scale: blob.animate.scale,
                  rotate: blob.animate.rotate
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: blob.duration,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }
          }
        />
      ))}

      <div className="living-gallery-grain absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.35)_0%,rgba(12,12,15,0.54)_48%,rgba(9,9,12,0.68)_100%)]" />
    </div>
  );
}
