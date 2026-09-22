"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { UserIcon, WhatsAppIcon } from "@/components/ui/icons";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { SectionExit } from "@/components/ui/section-exit";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, useDirectionalReveal } from "@/lib/animations";

const SERVICE_OPTIONS = [
  "Detailing",
  "Polimento",
  "Vitrificação",
  "Envelopamento",
  "Som",
  "Motos",
  "Outro",
];

const inputStyles =
  "w-full border-b border-neutral/30 bg-transparent py-2.5 text-foreground placeholder:text-neutral/60 outline-none";

function Field({
  label,
  htmlFor,
  icon,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  icon?: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="group relative">
      <label htmlFor={htmlFor} className="text-sm text-neutral">
        {label}
      </label>
      <div className="flex items-center gap-2.5">
        {icon ? (
          <span className={cn("shrink-0 text-neutral/60 group-focus-within:text-accent-light", error && "text-error")}>
            {icon}
          </span>
        ) : null}
        {children}
      </div>
      <span
        className={cn(
          "pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent-light transition-transform duration-300 ease-out group-focus-within:scale-x-100",
          error && "scale-x-100 bg-error",
        )}
      />
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function DoubleCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 12" className={className} fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M1 6.5 4.5 10 11 2" />
      <path d="M8 6.5 11.5 10 18 2" />
    </svg>
  );
}

interface ContactErrors {
  name?: string;
  phone?: string;
}

function validateName(value: string): string | undefined {
  return value.trim() ? undefined : "Digite seu nome.";
}

function validatePhone(value: string): string | undefined {
  if (!value.trim()) return "Digite seu telefone.";
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10) return "Telefone incompleto.";
  return undefined;
}

export function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const ids = {
    name: useId(),
    phone: useId(),
    message: useId(),
  };
  const { ref: formRef, controls: formControls } = useDirectionalReveal(0.3);
  const { ref: cardRef, controls: cardControls } = useDirectionalReveal(0.3);

  function buildMessageLines() {
    return [
      `Olá! Meu nome é ${name || "..."}.`,
      `Telefone: ${phone || "..."}`,
      `Serviço de interesse: ${service}`,
      `Mensagem: ${message || "..."}`,
    ];
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ContactErrors = {
      name: validateName(name),
      phone: validatePhone(phone),
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) return;

    const lines = [
      `Olá! Meu nome é ${name}.`,
      `Telefone: ${phone}`,
      `Serviço de interesse: ${service}`,
      message ? `Mensagem: ${message}` : null,
    ].filter(Boolean);
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${siteConfig.whatsapp}?text=${text}`, "_blank", "noopener,noreferrer");
  }

  const hasInput = name || phone || message;

  return (
    <SectionExit>
      <section id="contato" className="relative overflow-hidden bg-onyx px-6 py-24 sm:px-10 lg:px-16">
        <Logo
          variant="mono"
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/2 h-105 w-105 -translate-y-1/2 text-accent/6 sm:h-140 sm:w-140"
        />

        <div className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
          <motion.div
            ref={formRef}
            initial="hidden"
            animate={formControls}
            variants={staggerContainer(0.1, 0)}
          >
            <motion.h2
              variants={fadeUp}
              className="font-heading text-3xl font-bold tracking-wide text-foreground sm:text-4xl"
            >
              Marcar é rápido. O resultado, não.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-md text-neutral">
              Preenche aqui do lado e a mensagem já sai pronta pro nosso WhatsApp.
            </motion.p>

            <motion.form variants={fadeUp} onSubmit={handleSubmit} className="mt-10 flex flex-col gap-7">
              <Field label="Nome" htmlFor={ids.name} icon={<UserIcon className="h-4 w-4" />} error={errors.name}>
                <input
                  id={ids.name}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (errors.name) setErrors((current) => ({ ...current, name: validateName(event.target.value) }));
                  }}
                  onBlur={(event) => setErrors((current) => ({ ...current, name: validateName(event.target.value) }))}
                  placeholder="Seu nome"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? `${ids.name}-error` : undefined}
                  className={inputStyles}
                />
              </Field>

              <Field
                label="Telefone / WhatsApp"
                htmlFor={ids.phone}
                icon={<WhatsAppIcon className="h-4 w-4" />}
                error={errors.phone}
              >
                <input
                  id={ids.phone}
                  type="tel"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    if (errors.phone) setErrors((current) => ({ ...current, phone: validatePhone(event.target.value) }));
                  }}
                  onBlur={(event) => setErrors((current) => ({ ...current, phone: validatePhone(event.target.value) }))}
                  placeholder="(00) 00000-0000"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? `${ids.phone}-error` : undefined}
                  className={inputStyles}
                />
              </Field>

              <div>
                <span className="text-sm text-neutral">Serviço de interesse</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SERVICE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setService(option)}
                      className={cn(
                        "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                        service === option
                          ? "border-accent-light bg-accent-light/10 text-accent-light"
                          : "border-neutral/30 text-neutral hover:border-neutral/60 hover:text-foreground",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Mensagem (opcional)" htmlFor={ids.message}>
                <textarea
                  id={ids.message}
                  rows={3}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Conte um pouco sobre o que precisa"
                  className={`${inputStyles} resize-none`}
                />
              </Field>

              <LiquidMetalButton label="Enviar pelo WhatsApp" type="submit" className="self-start" />
            </motion.form>
          </motion.div>

          <motion.div
            ref={cardRef}
            initial="hidden"
            animate={cardControls}
            variants={staggerContainer(0.1, 0.15)}
            className="flex flex-col items-center justify-center"
          >
            <motion.div
              variants={fadeUp}
              className="w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-neutral/15 bg-surface shadow-2xl shadow-black/50"
            >
              <div className="flex items-center gap-3 border-b border-neutral/10 bg-onyx/60 p-4">
                <Logo className="h-8 w-8 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{siteConfig.name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-neutral">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-light" />
                    online
                  </p>
                </div>
              </div>

              <div className="min-h-70 bg-[radial-gradient(circle_at_top,rgba(52,163,153,0.06),transparent_60%)] p-5">
                <div className="relative max-w-[85%] rounded-2xl rounded-tl-sm border border-accent-light/25 bg-accent-light/10 p-4 text-sm leading-relaxed text-foreground">
                  {buildMessageLines().map((line, index) => (
                    <p key={index} className={cn(index > 0 && "mt-1.5", !hasInput && index > 0 && "text-neutral/50")}>
                      {line}
                    </p>
                  ))}
                  <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-accent-light align-middle" />
                </div>
                <div className="mt-1.5 flex max-w-[85%] items-center justify-end gap-1 pr-1 text-[10px] text-neutral">
                  agora
                  <DoubleCheckIcon className="h-3 w-3.5 text-accent-light" />
                </div>
              </div>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-4 max-w-sm text-center text-xs text-neutral">
              É exatamente essa mensagem que chega no nosso WhatsApp assim que você clicar em enviar.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </SectionExit>
  );
}
