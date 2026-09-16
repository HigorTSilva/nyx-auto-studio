import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { MagneticButton } from "@/components/ui/magnetic-button";

export const metadata: Metadata = {
  title: "Página não encontrada, Nyx Auto Studio",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-onyx px-6 py-24 text-center">
      <Logo className="h-14 w-14" />
      <p className="font-heading text-7xl font-bold tracking-wide text-foreground sm:text-8xl">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-bold tracking-wide text-foreground sm:text-3xl">
          Essa página saiu de linha
        </h1>
        <p className="max-w-sm text-neutral">
          O endereço que você tentou acessar não existe ou foi movido. Volta pro estúdio.
        </p>
      </div>
      <MagneticButton href="/" variant="primary">
        Voltar ao início
      </MagneticButton>
    </main>
  );
}
