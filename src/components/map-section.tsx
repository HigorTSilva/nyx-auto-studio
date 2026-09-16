"use client";

import { motion } from "framer-motion";
import { ArrowUpRightIcon, ClockIcon, MapPinIcon } from "@/components/ui/icons";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SectionExit } from "@/components/ui/section-exit";
import { siteConfig } from "@/lib/site-config";
import { fadeUp, staggerContainer, useDirectionalReveal } from "@/lib/animations";

const CORNER_STYLES = [
  "top-6 left-6 border-t border-l",
  "top-6 right-6 border-t border-r",
  "bottom-6 left-6 border-b border-l",
  "bottom-6 right-6 border-b border-r",
];

export function MapSection() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.address)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteConfig.address)}`;
  const { ref, controls } = useDirectionalReveal(0.3);

  return (
    <SectionExit>
      <section className="bg-surface px-6 py-24 sm:px-10 lg:px-16">
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
            Sem segredo nenhum
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-lg text-neutral">
            Nosso estúdio existe de verdade. Venha ver o processo de perto.
          </motion.p>

          <motion.div variants={fadeUp} className="relative mt-10 h-[420px] w-full overflow-hidden sm:h-[480px]">
            <iframe
              src={mapSrc}
              title="Localização da Nyx Auto Studio"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full grayscale invert contrast-125"
            />
            <div className="pointer-events-none absolute inset-0 bg-onyx/25" />

            {CORNER_STYLES.map((position) => (
              <span
                key={position}
                aria-hidden="true"
                className={`pointer-events-none absolute h-6 w-6 border-accent-light/50 ${position}`}
              />
            ))}

            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="motion-safe:animate-ping absolute -inset-4 rounded-full bg-accent-light/40" />
              <span className="relative block h-4 w-4 rounded-full bg-accent-light shadow-lg shadow-accent-light/50" />
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-6 sm:justify-start sm:p-8">
              <div className="pointer-events-auto flex w-full max-w-sm flex-col gap-4 bg-onyx p-6 sm:p-8">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent-light" />
                  <p className="text-foreground">{siteConfig.address}</p>
                </div>
                <div className="flex items-start gap-3">
                  <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent-light" />
                  <p className="text-foreground">{siteConfig.hours}</p>
                </div>
                <MagneticButton
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="sm"
                >
                  <span className="flex items-center gap-2">
                    Como chegar
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </span>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </SectionExit>
  );
}
