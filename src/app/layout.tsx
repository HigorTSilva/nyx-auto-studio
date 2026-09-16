import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space-grotesk",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-manrope",
});

const title = "Nyx Auto Studio, Estética Automotiva";
const description =
  "Estética automotiva completa: detailing, polimento, vitrificação, envelopamento e som automotivo, para carros e motos. Cuidado de estúdio, resultado de vitrine.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title,
  description,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title,
    description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/hero-poster.jpg",
        width: 1280,
        height: 720,
        alt: "Porsche 911 sendo detalhado no estúdio Nyx Auto Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/hero-poster.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <body className="bg-onyx font-body font-medium text-foreground antialiased">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
