"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

type FloatingArtworkProps = {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  priority?: boolean;
};

export function FloatingArtwork({ src, alt, className = "", delay = 0, priority = false }: FloatingArtworkProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.figure
      aria-hidden="true"
      className={`pointer-events-none relative overflow-hidden rounded-2xl border border-white/20 bg-white/12 p-2 shadow-[0_22px_52px_rgba(8,8,12,0.45)] backdrop-blur-md ${className}`}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      animate={
        prefersReducedMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: [0, -12, 0],
              rotate: [0, 0.8, -0.8, 0]
            }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : {
              opacity: { duration: 0.45, delay },
              y: {
                duration: 8,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay
              },
              rotate: {
                duration: 10,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay
              }
            }
      }
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/15 bg-stone-900/25">
        <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, 0px" className="object-cover" />
      </div>
    </motion.figure>
  );
}
