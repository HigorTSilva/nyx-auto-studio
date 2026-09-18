"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExpandIcon } from "@/components/ui/icons";
import { getSliceProgress } from "@/lib/scroll";
import { cn, useMediaQuery } from "@/lib/utils";
import { fadeUp, staggerContainer, useDirectionalReveal } from "@/lib/animations";

type ServiceName = "Detailing" | "Polimento" | "Vitrificação" | "Envelopamento" | "Som" | "Motos";

interface AlbumPhoto {
  src: string;
  alt: string;
}

interface Project {
  service: ServiceName;
  scatter: { x: string; y: string; rotate: number };
  photos: AlbumPhoto[];
}

const PROJECTS: Project[] = [
  {
    service: "Detailing",
    scatter: { x: "-24vw", y: "-10vh", rotate: -11 },
    photos: [
      { src: "/images/detailing-1.jpg", alt: "Plymouth 'Cuda azul detalhado no estúdio Nyx" },
      { src: "/images/detailing-2.jpg", alt: "Limpeza do interior de um carro com pano de microfibra" },
      { src: "/images/detailing-3.jpg", alt: "Limpeza da fresta da porta com pincel de detalhamento" },
    ],
  },
  {
    service: "Polimento",
    scatter: { x: "21vw", y: "-15vh", rotate: 9 },
    photos: [
      { src: "/images/polimento-1.jpg", alt: "Pintura vermelha polida refletindo a luz do teto" },
      { src: "/images/polimento-2.jpg", alt: "Politriz aplicando polimento no capô de um BMW" },
      { src: "/images/polimento-3.jpg", alt: "Técnico medindo a espessura da pintura com paquímetro" },
    ],
  },
  {
    service: "Vitrificação",
    scatter: { x: "-26vw", y: "12vh", rotate: 7 },
    photos: [
      { src: "/images/vitrificacao-1.jpg", alt: "Gotas d'água perolando sobre pintura vitrificada" },
      { src: "/images/vitrificacao-2.jpg", alt: "Aplicação de vitrificação cerâmica na lateral do carro" },
      { src: "/images/vitrificacao-3.jpg", alt: "Reflexo profundo da pintura após a vitrificação" },
    ],
  },
  {
    service: "Envelopamento",
    scatter: { x: "23vw", y: "9vh", rotate: -8 },
    photos: [
      { src: "/images/envelopamento-1.jpg", alt: "BMW M4 envelopado em preto fosco no estúdio" },
      { src: "/images/envelopamento-2.jpg", alt: "Instalador aplicando envelopamento azul com soprador térmico" },
      { src: "/images/envelopamento-3.jpg", alt: "Detalhe do acabamento do envelopamento no retrovisor" },
    ],
  },
  {
    service: "Som",
    scatter: { x: "-14vw", y: "-18vh", rotate: 13 },
    photos: [
      { src: "/images/som-1.jpg", alt: "Porta-malas com subwoofer e módulo de som instalados" },
      { src: "/images/som-2.jpg", alt: "Técnico instalando a fiação de um alto-falante na porta" },
      { src: "/images/som-3.jpg", alt: "Ajuste do som no painel multimídia do carro" },
    ],
  },
  {
    service: "Motos",
    scatter: { x: "16vw", y: "16vh", rotate: -6 },
    photos: [
      { src: "/images/motos-1.jpg", alt: "Ducati Panigale detalhada no estúdio" },
      { src: "/images/motos-2.jpg", alt: "Ponteira cromada de moto polida e reflexiva" },
      { src: "/images/motos-3.jpg", alt: "Limpeza da roda da moto com flanela de microfibra" },
    ],
  },
];

// Sequência extraída do vídeo real do carro vindo em direção à câmera
// (public/videos/mustang_video.mp4), desenhada em canvas e mapeada pelo
// scroll, em vez de tocada como vídeo, pra ficar perfeitamente reversível
// e sem engasgo ao rolar pra cima. Esticada pelo progresso inteiro da
// seção, então o carro segue crescendo até o fim das fotos.
const FRAME_COUNT = 71;
const FRAME_PATH = (frameNumber: number) => `/images/mustang-frames/frame-${String(frameNumber).padStart(3, "0")}.webp`;
const CAR_APPROACH_END = 1;

// Janela em que as fotos existem. Antes e depois dela é só o carro,
// sem nenhuma foto na tela.
const PHOTOS_INTRO_END = 0.08;
const PHOTOS_OUTRO_START = 0.92;

function useFramePreload(count: number, shouldLoad: boolean) {
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    if (!shouldLoad) return;
    let cancelled = false;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= count; i++) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = FRAME_PATH(i);
      img.onload = () => {
        if (!cancelled) setLoaded((value) => value + 1);
      };
      images[i - 1] = img;
    }

    framesRef.current = images;
    return () => {
      cancelled = true;
    };
  }, [count, shouldLoad]);

  return { framesRef, loaded };
}

function CarFrameSequence({
  scrollYProgress,
  framesRef,
  loaded,
}: {
  scrollYProgress: MotionValue<number>;
  framesRef: RefObject<HTMLImageElement[]>;
  loaded: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawnFrameRef = useRef(1);

  const drawFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[frameNumber - 1];
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return;

    const { width, height } = canvas;
    const imageRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;
    const drawWidth = canvasRatio > imageRatio ? width : height * imageRatio;
    const drawHeight = canvasRatio > imageRatio ? width / imageRatio : height;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
  }, [framesRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = canvas!.clientWidth * dpr;
      canvas!.height = canvas!.clientHeight * dpr;
      drawFrame(drawnFrameRef.current);
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawFrame]);

  useEffect(() => {
    if (loaded > 0) drawFrame(drawnFrameRef.current);
  }, [loaded, drawFrame]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const maxLoadedFrame = Math.min(loaded, FRAME_COUNT);
    if (maxLoadedFrame < 1) return;

    const approachProgress = Math.min(Math.max(value / CAR_APPROACH_END, 0), 1);
    const frameNumber = Math.round(approachProgress * (maxLoadedFrame - 1)) + 1;

    if (frameNumber !== drawnFrameRef.current) {
      drawnFrameRef.current = frameNumber;
      drawFrame(frameNumber);
    }
  });

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

function ProjectCard({
  project,
  index,
  total,
  scrollYProgress,
  activeIndex,
  photosVisibility,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  activeIndex: MotionValue<number>;
  photosVisibility: MotionValue<number>;
  onOpen: () => void;
}) {
  const cover = project.photos[0];
  const sliceSize = 1 / total;
  const sliceStart = index * sliceSize;
  const sliceEnd = sliceStart + sliceSize;
  // Só 55% de cada fatia é usado pro ciclo de entrada/pico/saída. O resto
  // fica como espaço morto entre uma foto e outra, pra dar tempo de ver o
  // carro se aproximando entre um foco e o próximo.
  const gap = (sliceSize * (1 - 0.55)) / 2;

  const start = sliceStart + gap;
  const end = sliceEnd - gap;
  // O pico vira um platô (peakStart→peakEnd) em vez de um instante só, pra
  // segurar o álbum em foco por mais tempo de scroll.
  const arrive = start + (end - start) * 0.15;
  const peakStart = start + (end - start) * 0.35;
  const peakEnd = start + (end - start) * 0.65;
  const leave = start + (end - start) * 0.85;
  const stops = [start, arrive, peakStart, peakEnd, leave, end];

  const { x: scatterX, y: scatterY, rotate: scatterRotate } = project.scatter;

  const restOpacity = useTransform(scrollYProgress, stops, [0.55, 1, 1, 1, 1, 0.55]);
  const opacity = useTransform<number, number>(
    [restOpacity, photosVisibility],
    ([rest, visibility]) => rest * visibility,
  );
  const scale = useTransform(scrollYProgress, stops, [0.72, 1.02, 1.12, 1.12, 1.02, 0.72]);
  const x = useTransform(scrollYProgress, stops, [scatterX, "0vw", "0vw", "0vw", "0vw", scatterX]);
  const y = useTransform(scrollYProgress, stops, [scatterY, "0vh", "0vh", "0vh", "0vh", scatterY]);
  const rotate = useTransform(scrollYProgress, stops, [scatterRotate, 0, 0, 0, 0, scatterRotate]);
  // A foto em foco precisa cobrir todas as outras por completo. Sem isso,
  // uma foto vizinha com z-index fixo mais alto podia aparecer por cima
  // dela ainda desfocada/borrada.
  const zIndex = useTransform(activeIndex, (active) => (active === index ? 100 : 30 + index));
  // Só o álbum em foco pode ser aberto. Os outros, espalhados/borrados ao
  // fundo, ficam com o clique desligado até chegar a vez deles.
  const pointerEvents = useTransform(activeIndex, (active) => (active === index ? "auto" : "none"));
  const buttonRef = useRef<HTMLButtonElement>(null);
  useMotionValueEvent(activeIndex, "change", (active) => {
    if (buttonRef.current) buttonRef.current.tabIndex = active === index ? 0 : -1;
  });

  // Quanto mais o card se aproxima do pico (foco), mais destaque o título
  // do álbum ganha, pra pessoa já saber que aquilo é clicável.
  const focusAmount = useTransform(scale, [0.72, 1.02, 1.12], [0, 0.4, 1]);
  const titleFontSizePx = useTransform(focusAmount, [0, 1], [11, 22]);
  const titleFontSize = useTransform(titleFontSizePx, (v) => `${v}px`);
  const titleTrackingPx = useTransform(focusAmount, [0, 1], [4, 1]);
  const titleTracking = useTransform(titleTrackingPx, (v) => `${v}px`);
  const titleWeight = useTransform(focusAmount, [0, 1], [600, 800]);
  const scrimOpacity = useTransform(focusAmount, [0, 1], [0, 0.85]);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={onOpen}
        aria-label={`Abrir álbum: ${project.service}`}
        style={{ opacity, scale, x, y, rotate, zIndex, pointerEvents }}
        className="relative aspect-3/2 w-[75vw] cursor-pointer overflow-hidden rounded-xl text-left shadow-2xl shadow-black/60 sm:w-[55vw] lg:w-[40vw]"
      >
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 40vw, (min-width: 640px) 55vw, 75vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-onyx/85 via-transparent to-transparent" />
        <motion.div
          aria-hidden="true"
          style={{ opacity: scrimOpacity }}
          className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-onyx to-transparent"
        />
        <motion.span
          style={{ fontSize: titleFontSize, fontWeight: titleWeight, letterSpacing: titleTracking }}
          className="absolute inset-x-0 bottom-3 text-center text-accent-light"
        >
          {project.service.toUpperCase()}
        </motion.span>
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-onyx/70 text-foreground">
          <ExpandIcon className="h-4 w-4" />
        </span>
      </motion.button>
    </div>
  );
}

function ProjectsShowcase({ onOpen }: { onOpen: (index: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  // As 71 imagens da sequência do carro (~2,2MB) só começam a baixar quando
  // a seção está perto de entrar na tela — sem isso, todo mundo pagava esse
  // download logo na primeira visita, competindo com o vídeo do Hero por
  // banda, mesmo quem nunca rola até aqui.
  const [shouldLoadFrames, setShouldLoadFrames] = useState(false);
  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadFrames(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { framesRef, loaded } = useFramePreload(FRAME_COUNT, shouldLoadFrames);

  const overlayOpacity = useTransform(scrollYProgress, [0, CAR_APPROACH_END, 1], [0.35, 0.3, 0.5]);
  const photosVisibility = useTransform(
    scrollYProgress,
    [0, PHOTOS_INTRO_END, PHOTOS_OUTRO_START, 1],
    [0, 1, 1, 0],
  );

  const activeIndex = useTransform(scrollYProgress, (value) => getSliceProgress(value, PROJECTS.length).index);
  const activeLabel = useTransform(activeIndex, (index) => String(PROJECTS[index]?.service ?? ""));
  const activeCounter = useTransform(activeIndex, (index) => String(index + 1).padStart(2, "0"));

  return (
    <section ref={trackRef} className="relative h-[640vh] bg-onyx">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CarFrameSequence scrollYProgress={scrollYProgress} framesRef={framesRef} loaded={loaded} />
        </div>
        <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 z-10 bg-onyx" />
        <AnimatePresence>
          {loaded < FRAME_COUNT ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute right-4 top-4 z-30 flex items-center gap-2 rounded-full border border-neutral/20 bg-onyx/70 px-3 py-1.5 text-xs text-neutral backdrop-blur-sm sm:right-6 sm:top-6"
            >
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent-light" />
              Carregando sequência {Math.round((loaded / FRAME_COUNT) * 100)}%
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-20 h-72 bg-[linear-gradient(to_bottom,var(--color-onyx)_0%,var(--color-onyx)_10%,transparent_100%)] sm:h-96"
        />

        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.service}
            project={project}
            index={index}
            total={PROJECTS.length}
            scrollYProgress={scrollYProgress}
            activeIndex={activeIndex}
            photosVisibility={photosVisibility}
            onOpen={() => onOpen(index)}
          />
        ))}

        <div
          aria-hidden="true"
          style={{ zIndex: 140 }}
          className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-onyx to-transparent sm:h-48"
        />
        <div style={{ zIndex: 150 }} className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-1 px-6 text-center">
          <span className="font-heading text-xs tracking-[0.4em] text-accent-light">
            <motion.span>{activeCounter}</motion.span> / {String(PROJECTS.length).padStart(2, "0")}
          </span>
          <motion.span className="font-heading text-xl font-bold tracking-wide text-foreground sm:text-2xl">
            {activeLabel}
          </motion.span>
        </div>
      </div>
    </section>
  );
}

function StaticProjectsRow({ onOpen }: { onOpen: (index: number) => void }) {
  return (
    <section className="bg-onyx px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto pb-2">
        {PROJECTS.map((project, index) => (
          <button
            key={project.service}
            type="button"
            onClick={() => onOpen(index)}
            aria-label={`Abrir álbum: ${project.service}`}
            className="relative aspect-3/2 w-64 shrink-0 cursor-pointer overflow-hidden rounded-xl text-left"
          >
            <Image src={project.photos[0].src} alt={project.photos[0].alt} fill className="object-cover" sizes="256px" />
            <div className="absolute inset-0 bg-linear-to-t from-onyx/75 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 text-xs tracking-[0.3em] text-accent-light">
              {project.service.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

// Alternativa pro celular ao efeito de carro em canvas: mais leve (só
// transform, sem redesenhar imagem a cada pixel de scroll), mas com a
// mesma sensação de "prender o scroll e ir pro lado até o último álbum".
const MOBILE_CARD_VW = 78;
const MOBILE_GAP_VW = 4;
const MOBILE_STEP_VW = MOBILE_CARD_VW + MOBILE_GAP_VW;
const MOBILE_VH_PER_ALBUM = 70;

function MobileProjectCard({
  project,
  index,
  activeIndex,
  onOpen,
}: {
  project: Project;
  index: number;
  activeIndex: MotionValue<number>;
  onOpen: () => void;
}) {
  const cover = project.photos[0];
  const scale = useTransform(activeIndex, (active) => (active === index ? 1 : 0.92));
  const opacity = useTransform(activeIndex, (active) => (active === index ? 1 : 0.55));

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Abrir álbum: ${project.service}`}
      style={{ scale, opacity, width: `${MOBILE_CARD_VW}vw` }}
      className="relative aspect-3/4 shrink-0 cursor-pointer overflow-hidden rounded-xl text-left"
    >
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        className="object-cover"
        sizes={`${MOBILE_CARD_VW}vw`}
      />
      <div className="absolute inset-0 bg-linear-to-t from-onyx via-onyx/20 to-transparent" />
      <span className="absolute inset-x-0 bottom-4 text-center text-lg font-bold tracking-wide text-accent-light">
        {project.service.toUpperCase()}
      </span>
    </motion.button>
  );
}

function MobileProjectsCarousel({ onOpen }: { onOpen: (index: number) => void }) {
  const trackWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackWrapRef, offset: ["start start", "end end"] });

  const trackX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(PROJECTS.length - 1) * MOBILE_STEP_VW}vw`],
  );
  const activeIndex = useTransform(scrollYProgress, (value) => getSliceProgress(value, PROJECTS.length).index);

  // O carro visualmente anda pro lado, mas quem prende a rolagem é o
  // scroll vertical — o gesto mais natural de quem vê isso num celular é
  // arrastar o dedo pro lado, não pra cima/baixo. Aqui a gente traduz um
  // arraste horizontal em rolagem vertical equivalente, na mesma proporção
  // (1px de dedo = 1px de card), pra que os dois gestos deem no mesmo
  // resultado. Só escuta na própria faixa de cards (não no resto da seção,
  // que tem título e legenda — arrastar ali não deveria mexer no carrossel),
  // e trava nos limites do primeiro/último álbum, pra um arraste rápido não
  // vazar rolagem pra seção anterior/seguinte. Um gesto majoritariamente
  // vertical não é interceptado, pra não atrapalhar a rolagem normal.
  useEffect(() => {
    const node = trackRef.current;
    const section = trackWrapRef.current;
    if (!node || !section) return;

    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let isHorizontal = false;
    // Geometria calculada uma vez por gesto (no touchstart), não a cada
    // touchmove — ler getBoundingClientRect/offsetHeight repetidas vezes
    // durante o arraste, logo após escrever o scroll, força um reflow a
    // cada evento.
    let sectionTop = 0;
    let sectionBottom = 0;
    let factor = 1;

    function handleTouchStart(event: TouchEvent) {
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      lastX = touch.clientX;
      isHorizontal = false;

      sectionTop = section!.getBoundingClientRect().top + window.scrollY;
      const scrollRangePx = section!.offsetHeight - window.innerHeight;
      sectionBottom = sectionTop + scrollRangePx;
      const trackRangePx = ((PROJECTS.length - 1) * MOBILE_STEP_VW * window.innerWidth) / 100;
      factor = trackRangePx > 0 ? scrollRangePx / trackRangePx : 1;
    }

    function handleTouchMove(event: TouchEvent) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - lastX;

      if (!isHorizontal) {
        const totalDeltaX = touch.clientX - startX;
        const totalDeltaY = touch.clientY - startY;
        if (Math.abs(totalDeltaX) < 8 || Math.abs(totalDeltaX) < Math.abs(totalDeltaY)) {
          lastX = touch.clientX;
          return;
        }
        isHorizontal = true;
      }

      event.preventDefault();
      const target = window.scrollY - deltaX * factor;
      const clamped = Math.min(Math.max(target, sectionTop), sectionBottom);
      // `behavior: "instant"` explícito, senão herda o `scroll-behavior:
      // smooth` do <html> e cada chamada vira uma animação que se atropela
      // com a próxima — o dedo fica sempre um passo atrás do dedo.
      window.scrollTo({ top: clamped, left: 0, behavior: "instant" });
      lastX = touch.clientX;
    }

    node.addEventListener("touchstart", handleTouchStart, { passive: true });
    node.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      node.removeEventListener("touchstart", handleTouchStart);
      node.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
  const activeLabel = useTransform(activeIndex, (index) => String(PROJECTS[index]?.service ?? ""));
  const activeCounter = useTransform(activeIndex, (index) => String(index + 1).padStart(2, "0"));

  return (
    <section
      ref={trackWrapRef}
      style={{ height: `${PROJECTS.length * MOBILE_VH_PER_ALBUM}vh` }}
      className="relative bg-onyx"
    >
      <div className="sticky top-0 flex min-h-screen flex-col justify-center gap-8 py-12">
        <div className="px-6">
          <h2 className="font-heading text-3xl font-bold tracking-wide text-foreground">Projetos</h2>
          <p className="mt-3 max-w-xs text-neutral">
            A cada rolagem, um carro mais perto e um serviço em foco.
          </p>
        </div>

        <div className="overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x: trackX, gap: `${MOBILE_GAP_VW}vw` }}
            className="flex pl-[11vw]"
          >
            {PROJECTS.map((project, index) => (
              <MobileProjectCard
                key={project.service}
                project={project}
                index={index}
                activeIndex={activeIndex}
                onOpen={() => onOpen(index)}
              />
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-1 px-6 text-center">
          <span className="font-heading text-xs tracking-[0.4em] text-accent-light">
            <motion.span>{activeCounter}</motion.span> / {String(PROJECTS.length).padStart(2, "0")}
          </span>
          <motion.span className="font-heading text-xl font-bold tracking-wide text-foreground">
            {activeLabel}
          </motion.span>
        </div>
      </div>
    </section>
  );
}

function AlbumViewer({
  album,
  photoIndex,
  onClose,
  onSelect,
}: {
  album: Project;
  photoIndex: number;
  onClose: () => void;
  onSelect: (index: number) => void;
}) {
  const [direction, setDirection] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const wheelLockRef = useRef(false);
  const activePhoto = album.photos[photoIndex];
  const canGoPrev = photoIndex > 0;
  const canGoNext = photoIndex < album.photos.length - 1;

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= album.photos.length) return;
      setDirection(index > photoIndex ? 1 : -1);
      onSelect(index);
    },
    [album.photos.length, onSelect, photoIndex],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goTo(photoIndex + 1);
      if (event.key === "ArrowLeft") goTo(photoIndex - 1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goTo, onClose, photoIndex]);

  // Trava o scroll da página enquanto o álbum tá aberto. O scroll vira
  // navegação entre fotos em vez de rolar o site por trás. Compensa a
  // largura da barra de rolagem que some, senão o conteúdo pula pro lado.
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  // Prende o foco de teclado dentro do modal (tab não escapa pro resto da
  // página) e devolve o foco pra quem abriu o álbum ao fechar.
  useEffect(() => {
    const container = modalRef.current;
    if (!container) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    function getFocusable() {
      return Array.from(
        container!.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
    }

    getFocusable()[0]?.focus();

    function handleTabKey(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", handleTabKey);
    return () => {
      container.removeEventListener("keydown", handleTabKey);
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      if (wheelLockRef.current || Math.abs(event.deltaY) < 10) return;
      wheelLockRef.current = true;
      goTo(event.deltaY > 0 ? photoIndex + 1 : photoIndex - 1);
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 450);
    }

    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, [goTo, photoIndex]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) goTo(photoIndex + 1);
    else if (info.offset.x > 60) goTo(photoIndex - 1);
  }

  // Com object-contain, a caixa do <img> ocupa o espaço todo do container,
  // mesmo nas bordas vazias (letterbox) onde a foto não aparece de fato.
  // Por isso calculamos aqui se o clique caiu dentro da área realmente
  // visível da imagem. Só aí o álbum continua aberto.
  function handlePhotoAreaClick(event: React.MouseEvent) {
    event.stopPropagation();
    const img = imageRef.current;
    if (!img || !img.naturalWidth || !img.naturalHeight) {
      onClose();
      return;
    }

    const rect = img.getBoundingClientRect();
    const naturalRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = rect.width / rect.height;

    const visibleWidth = boxRatio > naturalRatio ? rect.height * naturalRatio : rect.width;
    const visibleHeight = boxRatio > naturalRatio ? rect.height : rect.width / naturalRatio;
    const visibleLeft = rect.left + (rect.width - visibleWidth) / 2;
    const visibleTop = rect.top + (rect.height - visibleHeight) / 2;

    const isInsideVisiblePhoto =
      event.clientX >= visibleLeft &&
      event.clientX <= visibleLeft + visibleWidth &&
      event.clientY >= visibleTop &&
      event.clientY <= visibleTop + visibleHeight;

    if (!isInsideVisiblePhoto) onClose();
  }

  return (
    <motion.div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Álbum: ${album.service}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-60 flex flex-col bg-onyx/97 backdrop-blur-sm"
    >
      <div onClick={(event) => event.stopPropagation()} className="flex items-start justify-between gap-4 p-5 sm:p-8">
        <div>
          <p className="text-xs tracking-[0.35em] text-accent-light">ÁLBUM</p>
          <h3 className="font-heading text-3xl font-bold tracking-wide text-foreground sm:text-4xl">
            {album.service}
          </h3>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface text-foreground transition-colors hover:text-accent-light"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>

      <motion.div
        ref={stageRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="relative min-h-0 flex-1 touch-pan-y px-4 sm:px-12"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activePhoto.src}
            custom={direction}
            onClick={handlePhotoAreaClick}
            initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-4 sm:inset-12"
          >
            <Image
              ref={imageRef}
              src={activePhoto.src}
              alt={activePhoto.alt}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          aria-label="Foto anterior"
          disabled={!canGoPrev}
          onClick={(event) => {
            event.stopPropagation();
            goTo(photoIndex - 1);
          }}
          className="absolute left-1 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-surface text-foreground transition-colors hover:text-accent-light disabled:pointer-events-none disabled:opacity-25 sm:left-3"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <button
          type="button"
          aria-label="Próxima foto"
          disabled={!canGoNext}
          onClick={(event) => {
            event.stopPropagation();
            goTo(photoIndex + 1);
          }}
          className="absolute right-1 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-surface text-foreground transition-colors hover:text-accent-light disabled:pointer-events-none disabled:opacity-25 sm:right-3"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </motion.div>

      <div onClick={(event) => event.stopPropagation()} className="shrink-0 overflow-x-auto px-5 py-5 sm:px-8">
        <div className="mx-auto flex w-max gap-3">
          {album.photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ver foto ${index + 1}`}
              className={cn(
                "relative h-20 w-28 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-opacity sm:h-24 sm:w-32",
                index === photoIndex ? "border-accent-light opacity-100" : "border-transparent opacity-50 hover:opacity-80",
              )}
            >
              <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="128px" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Gallery() {
  const prefersReducedMotion = useReducedMotion();
  // O carro em canvas é redesenhado a cada pixel de scroll — em celular isso
  // costuma engasgar (menos GPU, barra de endereço mudando a altura da tela
  // no meio da rolagem). Abaixo do breakpoint de tablet, troca pelo
  // carrossel horizontal (só transform, sem canvas nem vídeo).
  const isMobile = useMediaQuery("(max-width: 767px)");
  const useCarousel = isMobile && !prefersReducedMotion;
  const [openAlbumIndex, setOpenAlbumIndex] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const openAlbum = openAlbumIndex !== null ? PROJECTS[openAlbumIndex] : null;
  const { ref: headerRef, controls: headerControls } = useDirectionalReveal(0.5);

  function openAlbumAt(index: number) {
    setOpenAlbumIndex(index);
    setPhotoIndex(0);
  }

  function closeAlbum() {
    setOpenAlbumIndex(null);
  }

  return (
    <>
      {/* No carrossel mobile o título entra dentro do próprio bloco fixo,
          junto com os cards — aqui fica só a âncora de rolagem "#projetos". */}
      <section id="projetos" className={cn("bg-onyx px-6 sm:px-10 lg:px-16", useCarousel ? "" : "pt-24 pb-8")}>
        {useCarousel ? null : (
          <motion.div
            ref={headerRef}
            initial="hidden"
            animate={headerControls}
            variants={staggerContainer(0.1, 0)}
            className="mx-auto max-w-6xl"
          >
            <motion.h2
              variants={fadeUp}
              className="font-heading text-3xl font-bold tracking-wide text-foreground sm:text-4xl"
            >
              Projetos
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-lg text-neutral">
              A cada rolagem, um carro mais perto e um serviço em foco.
            </motion.p>
          </motion.div>
        )}
      </section>

      {prefersReducedMotion ? (
        <StaticProjectsRow onOpen={openAlbumAt} />
      ) : useCarousel ? (
        <MobileProjectsCarousel onOpen={openAlbumAt} />
      ) : (
        <ProjectsShowcase onOpen={openAlbumAt} />
      )}

      <AnimatePresence>
        {openAlbum ? (
          <AlbumViewer album={openAlbum} photoIndex={photoIndex} onClose={closeAlbum} onSelect={setPhotoIndex} />
        ) : null}
      </AnimatePresence>
    </>
  );
}
