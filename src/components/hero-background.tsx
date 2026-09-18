"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface HeroBackgroundProps {
  prefersReducedMotion: boolean;
}

// O clip original (public/videos/hero-loop.mp4) não é um loop perfeito.
// O último quadro não bate exatamente com o primeiro, então o corte da
// volta ao início aparece. Sem um novo clip, a saída é mascarar esse
// ponto com um crossfade curto entre duas cópias do mesmo vídeo,
// alternando qual delas está tocando/visível.
const CROSSFADE_SECONDS = 0.6;

function HeroVideoSources() {
  return (
    <>
      <source media="(max-width: 768px)" src="/videos/hero-loop-mobile.mp4" type="video/mp4" />
      <source src="/videos/hero-loop.mp4" type="video/mp4" />
    </>
  );
}

export function HeroBackground({ prefersReducedMotion }: HeroBackgroundProps) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const crossfadingRef = useRef(false);
  const [activeIsA, setActiveIsA] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!videoA || !videoB) return;

    videoA.muted = true;
    videoB.muted = true;
    videoB.currentTime = 0;

    function handleError(event: Event) {
      const video = event.currentTarget as HTMLVideoElement;
      console.error("Hero video failed to load", {
        code: video.error?.code,
        message: video.error?.message,
        currentSrc: video.currentSrc,
      });
    }

    function handleTimeUpdate(outgoing: HTMLVideoElement, incoming: HTMLVideoElement) {
      if (crossfadingRef.current) return;
      const remaining = outgoing.duration - outgoing.currentTime;
      if (!Number.isFinite(remaining) || remaining > CROSSFADE_SECONDS) return;

      crossfadingRef.current = true;
      incoming.currentTime = 0;
      incoming.play().catch(() => {});
      setActiveIsA(incoming === videoA);

      window.setTimeout(() => {
        outgoing.pause();
        outgoing.currentTime = 0;
        crossfadingRef.current = false;
      }, CROSSFADE_SECONDS * 1000);
    }

    function handleTimeUpdateA() {
      handleTimeUpdate(videoA!, videoB!);
    }
    function handleTimeUpdateB() {
      handleTimeUpdate(videoB!, videoA!);
    }

    videoA.addEventListener("error", handleError);
    videoB.addEventListener("error", handleError);
    videoA.addEventListener("timeupdate", handleTimeUpdateA);
    videoB.addEventListener("timeupdate", handleTimeUpdateB);
    videoA.play().catch((error) => console.warn("Hero video autoplay was blocked", error));

    return () => {
      videoA.removeEventListener("error", handleError);
      videoB.removeEventListener("error", handleError);
      videoA.removeEventListener("timeupdate", handleTimeUpdateA);
      videoB.removeEventListener("timeupdate", handleTimeUpdateB);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <Image
        src="/images/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover"
      />
    );
  }

  const sharedClassName =
    "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-[600ms] ease-linear";

  return (
    <>
      <video
        ref={videoARef}
        autoPlay
        playsInline
        muted
        preload="auto"
        poster="/images/hero-poster.jpg"
        aria-hidden="true"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        style={{ opacity: activeIsA ? 1 : 0 }}
        className={sharedClassName}
      >
        <HeroVideoSources />
      </video>
      <video
        ref={videoBRef}
        playsInline
        muted
        preload="auto"
        aria-hidden="true"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        style={{ opacity: activeIsA ? 0 : 1 }}
        className={sharedClassName}
      >
        <HeroVideoSources />
      </video>
    </>
  );
}
