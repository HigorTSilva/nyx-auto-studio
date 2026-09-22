"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { DragHandleIcon, DropletIcon, PolishIcon, ShieldIcon } from "@/components/ui/icons";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SectionExit } from "@/components/ui/section-exit";
import { fadeUp, staggerContainer, useDirectionalReveal } from "@/lib/animations";
import { scrollToId } from "@/lib/utils";

const STAGES = [
  { icon: DropletIcon, label: "Lavagem técnica" },
  { icon: PolishIcon, label: "Correção de pintura" },
  { icon: ShieldIcon, label: "Vitrificação" },
];

export function BeforeAfter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  const position = useMotionValue(50);
  const clipPath = useTransform(position, (v) => `inset(0px ${100 - v}% 0px 0px)`);
  const dividerLeft = useTransform(position, (v) => `${v}%`);
  const percentLabel = useTransform(position, (v) => `${Math.round(v)}%`);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 150, damping: 16 });
  const rotateY = useSpring(rawRotateY, { stiffness: 150, damping: 16 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          return;
        }
        if (entry.boundingClientRect.top > 0) {
          setHasEnteredView(false);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEnteredView || hasInteracted) return;
    const controls = animate(position, [50, 72, 30, 50], {
      duration: 2.4,
      times: [0, 0.3, 0.65, 1],
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [hasEnteredView, hasInteracted, position]);

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const bounds = el.getBoundingClientRect();
    const pct = ((clientX - bounds.left) / bounds.width) * 100;
    position.set(Math.min(100, Math.max(0, pct)));
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    setHasInteracted(true);
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (draggingRef.current) {
      updateFromClientX(event.clientX);
    }
    if (prefersReducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    rawRotateY.set(px * 4);
    rawRotateX.set(py * -4);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function handlePointerLeave() {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }

  const stages = useMemo(() => STAGES, []);
  const { ref: textRef, controls: textControls } = useDirectionalReveal(0.3);
  const { ref: imageRef, controls: imageControls } = useDirectionalReveal(0.4);

  return (
    <SectionExit>
      <section
        id="antes-depois"
        ref={sectionRef}
        className="overflow-hidden bg-surface px-6 py-24 sm:px-10 lg:px-16"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <motion.div
            ref={textRef}
            initial="hidden"
            animate={textControls}
            variants={staggerContainer(0.1, 0)}
          >
            <motion.h2
              variants={fadeUp}
              className="font-heading text-3xl font-bold tracking-wide text-foreground sm:text-4xl"
            >
              Não é photoshop, é processo
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-md text-neutral">
              Arraste pra comparar. Cada imagem aqui saiu direto do nosso estúdio, sem edição.
            </motion.p>

            <motion.ul variants={fadeUp} className="mt-8 flex flex-col gap-3">
              {stages.map(({ icon: Icon, label }, index) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-light/30 bg-onyx text-accent-light">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-foreground">{label}</span>
                  {index < stages.length - 1 ? (
                    <span aria-hidden="true" className="h-px flex-1 bg-neutral/15" />
                  ) : null}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="mt-8">
              <MagneticButton variant="secondary" size="sm" onClick={() => scrollToId("projetos")}>
                Ver mais resultados
              </MagneticButton>
            </motion.div>
          </motion.div>

          <motion.div
            ref={imageRef}
            initial="hidden"
            animate={imageControls}
            variants={{
              hidden: { opacity: 0, scale: 0.94, filter: "blur(8px)" },
              visible: {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="relative"
            style={{ perspective: 1000 }}
          >
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-4xl bg-accent-light/10 blur-2xl"
            />

            <motion.div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              style={{
                rotateX: prefersReducedMotion ? 0 : rotateX,
                rotateY: prefersReducedMotion ? 0 : rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative aspect-4/3 w-full cursor-grab touch-none select-none overflow-hidden rounded-2xl shadow-2xl shadow-black/50 active:cursor-grabbing sm:aspect-video"
            >
              <motion.div style={{ y: parallaxY }} className="absolute inset-x-0 inset-y-[-8%]">
                <Image
                  src="/images/antes-depois-depois.jpg"
                  alt="Mesmo carro após o envelopamento, em prateado escuro"
                  fill
                  className="pointer-events-none object-cover"
                  sizes="(min-width: 1024px) 640px, 100vw"
                />
              </motion.div>

              <motion.div
                style={{ clipPath }}
                className="pointer-events-none absolute inset-0 overflow-hidden"
              >
                <motion.div style={{ y: parallaxY }} className="absolute inset-x-0 inset-y-[-8%]">
                  <Image
                    src="/images/antes-depois-antes.jpg"
                    alt="Carro branco com leve sujeira, antes do envelopamento"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 640px, 100vw"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                style={{ left: dividerLeft }}
                className="pointer-events-none absolute inset-y-0 w-0.5 bg-foreground/80"
              >
                <motion.div
                  animate={hasInteracted ? undefined : { scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.6, repeat: hasInteracted ? 0 : Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-foreground shadow-lg shadow-black/30 backdrop-blur-md"
                >
                  <DragHandleIcon className="h-4 w-4" />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full ring-1 ring-accent-light/40"
                  />
                </motion.div>
                <motion.span className="absolute top-1/2 left-1/2 mt-8 -translate-x-1/2 whitespace-nowrap rounded-full bg-onyx/70 px-2 py-0.5 text-[10px] tabular-nums text-neutral backdrop-blur-sm">
                  {percentLabel}
                </motion.span>
              </motion.div>

              <span className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-onyx/70 px-3 py-1.5 text-xs font-medium tracking-[0.15em] text-foreground backdrop-blur-sm">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-neutral" />
                ANTES
              </span>
              <span className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-accent-light/30 bg-onyx/70 px-3 py-1.5 text-xs font-medium tracking-[0.15em] text-foreground backdrop-blur-sm">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-light" />
                DEPOIS
              </span>

              <motion.span
                animate={{ opacity: hasInteracted ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-onyx/70 px-4 py-1.5 text-xs tracking-[0.15em] text-neutral backdrop-blur-sm"
              >
                ARRASTE PARA COMPARAR
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </SectionExit>
  );
}
