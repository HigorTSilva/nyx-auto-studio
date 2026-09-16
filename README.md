# Nyx Auto Studio

Site institucional da Nyx Auto Studio, um estúdio de estética automotiva completa
(detailing, polimento, vitrificação, envelopamento, som automotivo) pra carros e
motos, em Nova Friburgo. Uma página só, com bastante animação, pensada pra passar a
mesma sensação de cuidado e capricho que o próprio serviço da Nyx entrega.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion pras animações

Sem CMS, sem painel administrativo. O conteúdo (textos, imagens, links) vive dentro
do próprio código.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

Outros comandos úteis:

```bash
npm run build   # gera a versão de produção
npm run start   # roda a versão de produção localmente
npm run lint    # confere o código com o ESLint
```

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

## Sobre a pasta "Conteúdo"

Tem uma pasta chamada `Conteúdo/` na raiz do projeto com anotações pessoais sobre a
construção do site — um material de estudo explicando o que foi usado e por quê, e um
resumo pra apresentar o projeto sem entrar em detalhe técnico. Ela fica de fora do
Git de propósito (está no `.gitignore`), porque é conteúdo pessoal, não parte do
código do site.

## Configuração

Os dados de contato, endereço e horário de funcionamento ficam centralizados em
`src/lib/site-config.ts`. Antes de publicar de verdade, vale conferir se o número de
WhatsApp, o endereço e o link do Instagram já estão com os valores reais — hoje
alguns campos ainda estão com placeholder.
