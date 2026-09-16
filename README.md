# Nyx Auto Studio

Site institucional da Nyx Auto Studio, um estúdio de estética automotiva completa
(detailing, polimento, vitrificação, envelopamento, som automotivo) pra carros e
motos, em Nova Friburgo. Uma página só, com bastante animação, pensada pra passar a
mesma sensação de cuidado e capricho que o próprio serviço da Nyx entrega.

## Stack

- **Next.js** (App Router) — framework em cima do React, cuida da estrutura das
  páginas, das rotas e da otimização pra SEO e performance.
- **TypeScript** — verifica os tipos dos dados antes do site ir pro ar, evita erro
  bobo de digitação virar bug em produção.
- **Tailwind CSS** — estilização direto no código, sem arquivo de CSS separado por
  componente.
- **Framer Motion** — todas as animações do site: entrada de seção ao rolar a
  página, efeitos de mouse, transições de layout.

Sem CMS, sem painel administrativo. O conteúdo (textos, imagens, links) vive dentro
do próprio código.

## Como o projeto está organizado

```
src/
  app/            páginas (home, política de privacidade, robots, sitemap...)
  components/     uma seção do site por arquivo (hero, serviços, contato...)
    ui/           botões, ícones e outras peças pequenas reutilizáveis
  lib/            funções e configuração compartilhada entre componentes
public/
  images/         fotos do site
  videos/         vídeo de fundo do topo e o vídeo do carro usado na Galeria
```

Cada seção da página é um componente próprio, então dá pra abrir só o arquivo da
parte que precisa mexer sem se perder no resto.

## Configuração

Os dados de contato, endereço e horário de funcionamento ficam centralizados em
`src/lib/site-config.ts`. Antes de publicar de verdade, vale conferir se o número de
WhatsApp, o endereço e o link do Instagram já estão com os valores reais — hoje
alguns campos ainda estão com placeholder.
