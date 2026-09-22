"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { WhatsAppIcon } from "@/components/ui/icons";
import { useMagneticHover } from "@/lib/animations";
import { siteConfig } from "@/lib/site-config";

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagneticHover<HTMLAnchorElement>(
    0.16,
    !!prefersReducedMotion,
  );

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const pastHero = scrollY > viewportHeight * 0.6;
      const distanceFromBottom = documentHeight - (scrollY + viewportHeight);
      setVisible(pastHero && distanceFromBottom > 160);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 24 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.a
            ref={ref}
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conversar no WhatsApp"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ x, y }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent-light text-onyx shadow-lg shadow-black/40"
          >
            <span className="motion-safe:animate-ping absolute inset-0 -z-10 rounded-full bg-accent-light/50" />
            <WhatsAppIcon className="h-7 w-7" />
          </motion.a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
