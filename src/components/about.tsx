"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CameraIcon, ClockIcon, DropletIcon, ShieldIcon } from "@/components/ui/icons";
import { SectionExit } from "@/components/ui/section-exit";
import { cn } from "@/lib/utils";
import { EASE_OUT, fadeUp, staggerContainer, useDirectionalReveal } from "@/lib/animations";

const DIFFERENTIALS = [
  { icon: ShieldIcon, text: "Avaliação técnica antes de qualquer serviço" },
  { icon: DropletIcon, text: "Produtos e processos com procedência" },
  { icon: CameraIcon, text: "Fotos e vídeos do antes/depois de cada carro" },
  { icon: ClockIcon, text: "Prazo combinado e cumprido" },
];

const STATS = [
  { value: "300+", label: "Clientes atendidos" },
  { value: "8", label: "Anos de trabalho" },
];

function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!match) return;
    if (prefersReducedMotion) {
      count.set(target);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        animate(count, target, { duration: 1.4, ease: EASE_OUT });
        observer.disconnect();
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [count, match, prefersReducedMotion, target]);

  return (
    <motion.span ref={ref} className="font-heading text-3xl font-bold text-accent-light sm:text-4xl">
      {match ? rounded : value}
    </motion.span>
  );
}

export function About() {
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageWrapRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const { ref: textRef, controls: textControls } = useDirectionalReveal(0.3);
  const { ref: mainImageRef, controls: mainImageControls } = useDirectionalReveal(0.3);
  const { ref: smallImageRef, controls: smallImageControls } = useDirectionalReveal(0.3);

  return (
    <SectionExit>
      <section id="sobre" className="overflow-hidden bg-surface px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
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
              Por trás da Nyx
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-6 max-w-lg leading-relaxed text-neutral">
              A Nyx nasceu da ideia de que estética automotiva não devia ser tratada como
              lavagem rápida. Trabalhamos com processo, técnica e paciência. Cada carro passa
              pelo tempo que precisa, não pelo tempo que sobra. Atendemos desde quem quer manter
              o carro do dia a dia sempre em ordem até quem procura um resultado de vitrine para
              eventos e revenda.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex gap-6 border-y border-neutral/15 py-6 sm:gap-10">
              {STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn("flex-1 text-center", index > 0 && "border-l border-neutral/15 pl-6 sm:pl-10")}
                >
                  <StatValue value={stat.value} />
                  <p className="mt-1 text-xs leading-snug text-neutral">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {DIFFERENTIALS.map(({ icon: Icon, text }) => (
                <motion.div
                  key={text}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-start gap-3 border border-neutral/15 bg-onyx/40 p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-light/30 text-accent-light">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm leading-snug text-foreground">{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            ref={mainImageRef}
            initial="hidden"
            animate={mainImageControls}
            variants={{
              hidden: { opacity: 0, scale: 0.96 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE_OUT } },
            }}
            className="relative pb-10 pl-10 sm:pb-16 sm:pl-16"
          >
            <div ref={imageWrapRef} className="relative aspect-4/5 overflow-hidden">
              <motion.div style={{ y: imageY }} className="absolute inset-x-0 inset-y-[-8%]">
                <Image
                  src="/images/sobre-equipe.jpg"
                  alt="Equipe da Nyx Auto Studio trabalhando em conjunto no polimento de um carro"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 480px, 100vw"
                />
              </motion.div>
            </div>

            <motion.div
              ref={smallImageRef}
              initial="hidden"
              animate={smallImageControls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, ease: EASE_OUT } },
              }}
              className="absolute bottom-0 left-0 aspect-4/3 w-2/5 overflow-hidden border-4 border-surface shadow-2xl shadow-black/50"
            >
              <Image
                src="/images/sobre-detalhe.jpg"
                alt="Detalhe da pintura escura refletindo a luz do estúdio"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 200px, 40vw"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </SectionExit>
  );
}
