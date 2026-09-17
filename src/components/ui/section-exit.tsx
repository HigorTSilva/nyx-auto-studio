"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useMediaQuery } from "@/lib/utils";

// Mesmo efeito de saída do Hero (fade + leve zoom-out + desfoque), mas
// medido só no último trecho de rolagem da seção, do momento em que a
// borda de baixo toca o fundo da tela até ela sumir no topo. Pra não
// desfocar o conteúdo enquanto a seção ainda está sendo lida. No mobile o
// início é adiado ainda mais — a rolagem por toque é mais rápida/curta, e
// começar tarde demais fazia o efeito quase não dar tempo de aparecer.
export function SectionExit({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end end", "end start"] });

  // Duas transformações fixas em vez de uma com o intervalo trocado na
  // marra: o useTransform da Framer Motion trava o intervalo passado na
  // primeira chamada, então mudar o array condicionalmente não teria
  // efeito depois que isMobile atualiza no cliente.
  const opacityDesktop = useTransform(scrollYProgress, [0.45, 1], [1, 0]);
  const opacityMobile = useTransform(scrollYProgress, [0.7, 1], [1, 0]);
  const scaleDesktop = useTransform(scrollYProgress, [0.45, 1], [1, 0.94]);
  const scaleMobile = useTransform(scrollYProgress, [0.7, 1], [1, 0.94]);
  const blurPxDesktop = useTransform(scrollYProgress, [0.65, 1], [0, 6]);
  const blurPxMobile = useTransform(scrollYProgress, [0.85, 1], [0, 6]);

  const opacity = isMobile ? opacityMobile : opacityDesktop;
  const scale = isMobile ? scaleMobile : scaleDesktop;
  const blurPx = isMobile ? blurPxMobile : blurPxDesktop;
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.div ref={ref} style={prefersReducedMotion ? undefined : { opacity, scale, filter }}>
      {children}
    </motion.div>
  );
}
