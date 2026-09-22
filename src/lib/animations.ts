import { useEffect, useRef } from "react";
import { useAnimationControls, useMotionValue, useSpring, type Variants } from "framer-motion";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export function staggerContainer(stagger = 0.12, delayChildren = 0.1): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

export const wordReveal: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

export function useDirectionalReveal<T extends HTMLElement = HTMLDivElement>(amount = 0.3) {
  const ref = useRef<T>(null);
  const controls = useAnimationControls();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
          return;
        }
        if (entry.boundingClientRect.top > 0) {
          controls.set("hidden");
        }
      },
      { threshold: amount },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [amount, controls]);

  return { ref, controls };
}

export function useMagneticHover<T extends HTMLElement>(strength = 0.3, disabled = false) {
  const ref = useRef<T>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 16, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 200, damping: 16, mass: 0.4 });

  function onMouseMove(event: React.MouseEvent<T>) {
    if (disabled) return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    rawX.set((event.clientX - (bounds.left + bounds.width / 2)) * strength);
    rawY.set((event.clientY - (bounds.top + bounds.height / 2)) * strength);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return { ref, x, y, onMouseMove, onMouseLeave };
}
