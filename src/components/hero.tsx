"use client";

import { useRef, useState, type MouseEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { HeroBackground } from "@/components/hero-background";
import { Logo } from "@/components/logo";
import { InstagramIcon } from "@/components/ui/icons";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { siteConfig } from "@/lib/site-config";
import { scrollToId } from "@/lib/utils";
import { fadeUp, staggerContainer, useMagneticHover, wordReveal } from "@/lib/animations";

const HEADLINE_WORDS = "Seu carro merece mais do que lavagem".split(" ");

// Dark in the middle, where the text lives, fading out to a lighter, more
// transparent tone on both edges so it doesn't read as a hard seam.
const SCRIM_GRADIENT =
  "rgba(10, 12, 12, 0.2) 0%, rgba(10, 12, 12, 0.85) 32%, rgba(10, 12, 12, 0.85) 68%, rgba(10, 12, 12, 0.2) 100%";

function MagneticInstagramLink({ disabled }: { disabled: boolean }) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagneticHover<HTMLAnchorElement>(0.3, disabled);

  return (
    <motion.a
      ref={ref}
      href={siteConfig.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.94 }}
      className="inline-block text-foreground/70 transition-colors hover:text-accent-light"
    >
      <InstagramIcon className="h-7 w-7 sm:h-8 sm:w-8" />
    </motion.a>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isPointerInside, setIsPointerInside] = useState(false);

  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const exitOpacity = useTransform(scrollYProgress, [0.45, 1], [1, 0]);
  const exitScale = useTransform(scrollYProgress, [0.45, 1], [1, 0.94]);
  const exitBlurPx = useTransform(scrollYProgress, [0.65, 1], [0, 6]);
  const exitBlur = useMotionTemplate`blur(${exitBlurPx}px)`;
  const spotlightBackground = useMotionTemplate`radial-gradient(280px circle at ${spotlightX}px ${spotlightY}px, rgba(52, 163, 153, 0.09), transparent 75%)`;

  function handlePointerMove(event: MouseEvent<HTMLElement>) {
    if (prefersReducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    spotlightX.set(event.clientX - bounds.left);
    spotlightY.set(event.clientY - bounds.top);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handlePointerMove}
      onMouseEnter={() => setIsPointerInside(true)}
      onMouseLeave={() => setIsPointerInside(false)}
      className="relative min-h-screen overflow-hidden bg-onyx"
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: exitOpacity, scale: exitScale, filter: exitBlur }}
        className="relative min-h-screen"
      >
        <HeroBackground prefersReducedMotion={!!prefersReducedMotion} />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{ background: `linear-gradient(to bottom, ${SCRIM_GRADIENT})` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{ background: `linear-gradient(to right, ${SCRIM_GRADIENT})` }}
        />

        <motion.div
          aria-hidden="true"
          animate={{ opacity: isPointerInside && !prefersReducedMotion ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: spotlightBackground }}
          className="pointer-events-none absolute inset-0"
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.12, 0.1)}
          className="relative z-10 flex min-h-screen w-full flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-16"
        >
          <motion.div variants={fadeUp} className="grid grid-cols-3 items-center">
            <div className="justify-self-start">
              <MagneticInstagramLink disabled={!!prefersReducedMotion} />
            </div>

            <Logo className="h-20 w-20 justify-self-center sm:h-24 sm:w-24" />

            <div className="hidden justify-self-end sm:block">
              <LiquidMetalButton label="Agendar avaliação" onClick={() => scrollToId("contato")} />
            </div>
          </motion.div>

          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <motion.h1
              variants={staggerContainer(0.05, 0)}
              className="max-w-xl font-heading text-3xl font-bold leading-[1.15] tracking-wide text-foreground sm:text-4xl lg:text-5xl"
            >
              {HEADLINE_WORDS.map((word, index) => (
                <span key={index}>
                  <span className="inline-block overflow-hidden pb-2 align-bottom">
                    <motion.span variants={wordReveal} className="inline-block">
                      {word}
                    </motion.span>
                  </span>{" "}
                </span>
              ))}
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-xs text-base leading-relaxed text-neutral sm:text-lg">
              Cuidado de estúdio, resultado de vitrine.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
              <LiquidMetalButton label="Agendar avaliação" onClick={() => scrollToId("contato")} />
              <MagneticButton href="#projetos" variant="secondary" disabled={!!prefersReducedMotion}>
                Ver projetos
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        >
          <span className="text-[10px] tracking-[0.35em] text-neutral">ROLE</span>
          <motion.span
            animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-neutral/50"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
