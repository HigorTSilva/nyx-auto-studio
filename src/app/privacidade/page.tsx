import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Privacidade, Nyx Auto Studio",
  description: "Como a Nyx Auto Studio trata os dados enviados pelo formulário de contato do site.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:px-10 sm:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-neutral transition-colors hover:text-accent-light"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Voltar ao site
      </Link>

      <Logo className="mt-10 h-10 w-10" />

      <h1 className="mt-6 font-heading text-3xl font-bold tracking-wide text-foreground sm:text-4xl">
        Política de Privacidade
      </h1>
      <p className="mt-3 text-sm text-neutral">Última atualização: setembro de 2026.</p>

      <div className="mt-10 flex flex-col gap-8 leading-relaxed text-neutral">
        <section>
          <h2 className="font-heading text-lg font-bold text-foreground">Quais dados coletamos</h2>
          <p className="mt-2">
            O único lugar do site que pede dados pessoais é o formulário de contato: nome, telefone e,
            opcionalmente, uma mensagem sobre o que você precisa. Não usamos cookies de rastreamento nem
            ferramentas de analytics neste site.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-foreground">O que fazemos com esses dados</h2>
          <p className="mt-2">
            O que você digita no formulário nunca chega a um servidor ou banco de dados nosso. Ele é usado
            só para montar, no seu próprio navegador, uma mensagem pronta que abre o WhatsApp. É você quem
            efetivamente envia essa mensagem, pelo seu próprio WhatsApp, direto para o número da Nyx Auto
            Studio.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-foreground">Compartilhamento com terceiros</h2>
          <p className="mt-2">
            Não vendemos nem compartilhamos esses dados com ninguém. A partir do momento em que a mensagem é
            enviada pelo WhatsApp, o tratamento dela passa a seguir a política de privacidade do WhatsApp
            (Meta), como em qualquer conversa nesse aplicativo.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-foreground">Seus direitos</h2>
          <p className="mt-2">
            De acordo com a Lei Geral de Proteção de Dados (LGPD), você pode pedir a qualquer momento para
            saber quais mensagens suas temos, corrigi-las ou pedir a exclusão da nossa conversa no WhatsApp.
            É só chamar a gente pelo mesmo número.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold text-foreground">Contato</h2>
          <p className="mt-2">
            Dúvidas sobre esta política podem ser enviadas para o nosso WhatsApp:{" "}
            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-light hover:underline"
            >
              {siteConfig.whatsappDisplay}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
