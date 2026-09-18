"use client";

import { useMemo, useRef, useState, type ComponentType, type MouseEvent, type SVGProps } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  DropletIcon,
  LayersIcon,
  MotorcycleIcon,
  PolishIcon,
  ShieldIcon,
  SpeakerIcon,
} from "@/components/ui/icons";
import { SectionExit } from "@/components/ui/section-exit";
import { cn, useMediaQuery } from "@/lib/utils";
import { EASE_OUT, fadeUp, staggerContainer, useDirectionalReveal } from "@/lib/animations";

interface Service {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  image?: string;
  featured?: boolean;
}

// Marque `featured: true` no serviço que deve virar o card grande em telas
// lg+ — só um por vez. O layout (posição, colunas, gradiente reforçado) se
// ajusta sozinho a partir dessa marcação.
const SERVICES: Service[] = [
  {
    icon: DropletIcon,
    title: "Detailing completo",
    description:
      "Higienização interna e externa profunda, do porta-malas ao teto solar, devolvendo o carro ao estado de loja.",
    image: "/images/detailing-1.jpg",
    featured: true,
  },
  {
    icon: PolishIcon,
    title: "Polimento técnico",
    description:
      "Correção de riscos, marcas de lavagem e oxidação da pintura, com medição de espessura antes de qualquer passada.",
    image: "/images/polimento-1.jpg",
  },
  {
    icon: ShieldIcon,
    title: "Vitrificação",
    description:
      "Proteção cerâmica de longa duração, com brilho profundo e repelência a água, sujeira e raios UV.",
    image: "/images/vitrificacao-1.jpg",
  },
  {
    icon: LayersIcon,
    title: "Envelopamento",
    description:
      "Mudança de cor ou proteção da pintura original com vinil de alta qualidade, sem descaracterizar as linhas do carro.",
    image: "/images/envelopamento-1.jpg",
  },
  {
    icon: SpeakerIcon,
    title: "Som automotivo",
    description:
      "Instalação e ajuste fino de som, isolamento acústico e acessórios, sem gambiarra no chicote.",
    image: "/images/som-1.jpg",
  },
  {
    icon: MotorcycleIcon,
    title: "Motos",
    description:
      "Todos os serviços acima adaptados pra motocicletas, com atenção aos detalhes de carenagem e cromados.",
    image: "/images/motos-1.jpg",
  },
];

const DEFAULT_FEATURED_TITLE =
  SERVICES.find((service) => service.featured)?.title ?? SERVICES[0].title;

// Degradê usado nos cards em telas grandes: opacidade cai em degraus
// suaves (100 → 95 → 75 → 50 → 0) a cada 15% da altura, ficando bem escuro
// perto do texto e clareando de forma contínua até o topo do card.
const STRONG_GRADIENT =
  "linear-gradient(to top, rgba(10,12,12,1) 0%, rgba(10,12,12,1) 15%, rgba(10,12,12,0.95) 30%, rgba(10,12,12,0.75) 45%, rgba(10,12,12,0.5) 60%, rgba(10,12,12,0) 100%)";

// Mesma ideia no mobile, mas esticada por mais da altura do card — o pico
// de 100% continua só na base (não fica mais forte), só demora bem mais
// pra sumir, então o degradê fica presente até bem mais perto do topo.
const MOBILE_GRADIENT =
  "linear-gradient(to top, rgba(10,12,12,1) 0%, rgba(10,12,12,1) 20%, rgba(10,12,12,0.9) 45%, rgba(10,12,12,0.65) 70%, rgba(10,12,12,0.35) 90%, rgba(10,12,12,0) 100%)";

function ServiceCard({
  icon: Icon,
  title,
  description,
  image,
  featured,
  canFeature,
  className,
  onFeature,
}: Service & { featured: boolean; canFeature: boolean; className: string; onFeature: () => void }) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const interactive = canFeature && !featured;

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 150, damping: 14 });
  const rotateY = useSpring(rawRotateY, { stiffness: 150, damping: 14 });

  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const spotlightBackground = useMotionTemplate`radial-gradient(240px circle at ${spotlightX}px ${spotlightY}px, rgba(52, 163, 153, 0.18), transparent 70%)`;

  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  function handleMouseMove(event: MouseEvent<HTMLButtonElement>) {
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    spotlightX.set(event.clientX - bounds.left);
    spotlightY.set(event.clientY - bounds.top);
    if (prefersReducedMotion) return;
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    rawRotateY.set(px * 8);
    rawRotateX.set(py * -8);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    rawRotateX.set(0);
    rawRotateY.set(0);
  }

  return (
    <motion.button
      ref={cardRef}
      type="button"
      layout
      layoutId={`service-card-${title}`}
      transition={{ layout: { duration: 0.6, ease: EASE_OUT } }}
      variants={fadeUp}
      onClick={interactive ? onFeature : undefined}
      aria-label={interactive ? `Destacar ${title} como serviço principal` : undefined}
      tabIndex={interactive ? 0 : -1}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        transformPerspective: 900,
      }}
      className={cn(
        "group relative min-h-70 w-full overflow-hidden bg-surface text-left",
        interactive ? "cursor-pointer" : "cursor-default",
        className,
      )}
    >
      {image ? (
        <>
          <motion.div
            style={{ y: prefersReducedMotion ? 0 : parallaxY }}
            className="absolute inset-x-0 inset-y-[-12%]"
          >
            <Image
              src={image}
              alt=""
              aria-hidden="true"
              fill
              className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-110"
              // O container tem no máximo 1152px (max-w-6xl). O card grande
              // ocupa ~4/6 dessa largura, os pequenos ~2/6 — bem menos do
              // que os 50vw genéricos que os dois usavam antes, que faziam
              // os cards pequenos pedirem imagem maior do que exibem.
              sizes={featured ? "(min-width: 1024px) 760px, 100vw" : "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"}
            />
          </motion.div>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ backgroundImage: canFeature ? STRONG_GRADIENT : MOBILE_GRADIENT }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-surface via-surface to-onyx" />
      )}

      <motion.div
        aria-hidden="true"
        animate={{ opacity: isHovered && !prefersReducedMotion ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: spotlightBackground }}
        className="pointer-events-none absolute inset-0"
      />

      <div className="absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-accent-light/40" />

      {interactive ? (
        <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-accent-light/30 bg-onyx/70 px-3 py-1 text-[11px] tracking-[0.2em] text-accent-light opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          DESTACAR
        </span>
      ) : null}

      <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-6 sm:p-8">
        <Icon className="h-7 w-7 text-accent-light transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-6" />
        <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">{title}</h3>
        <p className="max-w-md text-sm leading-relaxed text-foreground/70 sm:text-base">{description}</p>
      </div>
    </motion.button>
  );
}

export function Services() {
  const { ref, controls } = useDirectionalReveal(0.2);
  const [featuredTitle, setFeaturedTitle] = useState(DEFAULT_FEATURED_TITLE);
  // O card grande só existe visualmente a partir do breakpoint lg (ver as
  // classes de col-span/row-span abaixo). No mobile todos os cards têm o
  // mesmo tamanho, então trocar qual é o "principal" não muda nada visível
  // — só deixaria os cards clicáveis à toa. Por isso a troca fica desativada
  // abaixo de lg. O mesmo booleano também escolhe qual degradê o
  // ServiceCard usa (o forte de telas grandes ou o esticado do mobile).
  const canFeature = useMediaQuery("(min-width: 1024px)");

  // O card em destaque vai pra frente da grade (posição fixa do bento
  // layout); o restante mantém a ordem original. Se sobrar uma quantidade
  // ímpar de cards pequenos, o último ganha duas colunas no tablet pra não
  // ficar órfão. Clicar em qualquer card pequeno o torna o novo destaque.
  const orderedServices = useMemo(() => {
    const featuredIndex = Math.max(
      0,
      SERVICES.findIndex((service) => service.title === featuredTitle),
    );
    return [SERVICES[featuredIndex], ...SERVICES.filter((_, index) => index !== featuredIndex)];
  }, [featuredTitle]);
  const restCount = orderedServices.length - 1;

  return (
    <SectionExit>
      <section id="servicos" className="bg-onyx px-6 py-24 sm:px-10 lg:px-16">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer(0.1, 0)}
          className="mx-auto max-w-6xl"
        >
          <motion.h2
            variants={fadeUp}
            className="font-heading text-3xl font-bold tracking-wide text-foreground sm:text-4xl"
          >
            Seis frentes, um padrão só
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-lg text-neutral">
            Do primeiro ao último carro do dia, o processo não muda.
          </motion.p>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
            {orderedServices.map((service, index) => {
              const isFeatured = index === 0;
              const isLastOfRest = !isFeatured && index === orderedServices.length - 1;
              const className = isFeatured
                ? "sm:col-span-2 lg:col-span-4 lg:row-span-2"
                : cn("lg:col-span-2", isLastOfRest && restCount % 2 === 1 && "sm:col-span-2");

              return (
                <ServiceCard
                  key={service.title}
                  {...service}
                  featured={isFeatured}
                  canFeature={canFeature}
                  className={className}
                  onFeature={() => setFeaturedTitle(service.title)}
                />
              );
            })}
          </div>
        </motion.div>
      </section>
    </SectionExit>
  );
}
