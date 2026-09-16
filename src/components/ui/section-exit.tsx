"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Mesmo efeito de saída do Hero (fade + leve zoom-out + desfoque), mas
// medido só no último trecho de rolagem da seção, do momento em que a
// borda de baixo toca o fundo da tela até ela sumir no topo. Pra não
// desfocar o conteúdo enquanto a seção ainda está sendo lida.
export function SectionExit({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end end", "end start"] });

  const opacity = useTransform(scrollYProgress, [0.45, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.45, 1], [1, 0.94]);
  const blurPx = useTransform(scrollYProgress, [0.65, 1], [0, 6]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.div ref={ref} style={prefersReducedMotion ? undefined : { opacity, scale, filter }}>
      {children}
    </motion.div>
  );
}
