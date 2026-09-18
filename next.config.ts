import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // AVIF antes de WebP: mesmo navegador que já ganhava WebP passa a
    // receber um arquivo ainda menor, com fallback automático pra quem
    // não suporta nenhum dos dois.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
