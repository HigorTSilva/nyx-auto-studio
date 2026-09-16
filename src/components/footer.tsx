"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { ChevronLeftIcon, ClockIcon, InstagramIcon, MapPinIcon, WhatsAppIcon } from "@/components/ui/icons";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { siteConfig } from "@/lib/site-config";
import { scrollToId } from "@/lib/utils";
import { fadeUp, staggerContainer, useDirectionalReveal } from "@/lib/animations";

const NAV_LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#antes-depois", label: "Antes / Depois" },
  { href: "#projetos", label: "Projetos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="group relative w-fit text-foreground transition-colors hover:text-accent-light">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent-light transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { ref: ctaRef, controls: ctaControls } = useDirectionalReveal(0.4);
  const { ref: gridRef, controls: gridControls } = useDirectionalReveal(0.3);

  return (
    <footer className="relative overflow-hidden bg-onyx">
      <div className="border-b border-neutral/15 px-6 py-16 sm:px-10 lg:px-16">
        <motion.div
          ref={ctaRef}
          initial="hidden"
          animate={ctaControls}
          variants={staggerContainer(0.1, 0)}
          className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center"
        >
          <div>
            <motion.h3
              variants={fadeUp}
              className="font-heading text-2xl font-bold tracking-wide text-foreground sm:text-3xl"
            >
              Ainda não marcou?
            </motion.h3>
            <motion.p variants={fadeUp} className="mt-2 text-neutral">
              Sua próxima avaliação tá a uma mensagem de distância.
            </motion.p>
          </div>
          <motion.div variants={fadeUp}>
            <LiquidMetalButton label="Agendar avaliação" onClick={() => scrollToId("contato")} />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        ref={gridRef}
        initial="hidden"
        animate={gridControls}
        variants={staggerContainer(0.1, 0)}
        className="mx-auto grid max-w-6xl gap-12 border-b border-neutral/15 px-6 py-12 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-16"
      >
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <Logo className="h-10 w-10" />
          <p className="max-w-xs text-sm leading-relaxed text-neutral">
            Estética automotiva completa para carros e motos. Detailing, polimento,
            vitrificação, envelopamento e som.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <span className="text-xs tracking-[0.3em] text-neutral">NAVEGAÇÃO</span>
          {NAV_LINKS.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <span className="text-xs tracking-[0.3em] text-neutral">CONTATO</span>
          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-foreground transition-colors hover:text-accent-light"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0 text-accent-light" />
            {siteConfig.whatsappDisplay}
          </a>
          <p className="flex items-start gap-2 text-neutral">
            <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-light" />
            {siteConfig.address}
          </p>
          <p className="flex items-center gap-2 text-neutral">
            <ClockIcon className="h-4 w-4 shrink-0 text-accent-light" />
            {siteConfig.hours}
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <span className="text-xs tracking-[0.3em] text-neutral">SIGA</span>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex w-fit items-center gap-2 text-foreground transition-colors hover:text-accent-light"
          >
            <InstagramIcon className="h-5 w-5" />
            Instagram
          </a>
        </motion.div>
      </motion.div>

      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden py-4">
        <span className="block text-center font-heading text-[20vw] font-bold leading-none text-foreground/5 sm:text-[16vw]">
          NYX
        </span>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 pb-8 text-sm text-neutral sm:flex-row sm:px-10 lg:px-16">
        <span className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
          <span>
            © {year} {siteConfig.name}. Todos os direitos reservados.
          </span>
          <a href="/privacidade" className="transition-colors hover:text-accent-light">
            Política de Privacidade
          </a>
        </span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex cursor-pointer items-center gap-1.5 text-neutral transition-colors hover:text-accent-light"
        >
          Voltar ao topo
          <ChevronLeftIcon className="h-3.5 w-3.5 rotate-90" />
        </button>
      </div>
    </footer>
  );
}
