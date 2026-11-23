# Arco 3 — site do estúdio

Site one-page da **Arco 3** ([@arco3.arq](https://www.instagram.com/arco3.arq/)), com estrutura e ritmo inspirados em [santalarch.com](https://santalarch.com): grade de 8 colunas com linhas-guia, logotipo em escala de fachada, menu com marcações, seções fixas dirigidas pelo scroll e transição final por um arco que ocupa a tela.

## Rodar

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/
npm run preview   # serve o build
```

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Todo o texto, contato, projetos, equipe | `src/content/site.ts` |
| Cores da marca (papel, tinta, cinza) | `src/index.css` → `:root` |
| Marca (bloco com três arcos) | `src/components/brand/ArcoMark.tsx` |
| Fotos de projetos | `public/projetos/…` + campo `image` em `site.ts` |

Campos com `null` ou listas vazias **não aparecem** no site. Assim nada inventado é publicado: telefone, e-mail, WhatsApp, endereço, equipe, ano e local dos projetos ficam ocultos até serem preenchidos. Enquanto um projeto não tem foto, o card mostra uma prancha técnica gerada em SVG.

## Seções

1. **Preloader**: "A arquitetura é compreendida em camadas", contador e cortina (GSAP).
2. **Herói**: logotipo `ARCO3` de ponta a ponta, menu fixo com `mix-blend-difference`, diagonal de construção.
3. **Filosofia**: a frase acende palavra por palavra; depois a câmera atravessa uma colunata de arcos em wireframe (Three.js) com palavras nas paredes; termina em "Nós ver / ouvir / tocar / sentir".
4. **Nossa visão**: Firme (relevo perfurado em shader GLSL), Preciso (malha em perspectiva) e Sereno (papel).
5. **Nossa abordagem**: quatro princípios; a prancha técnica central é traçada conforme o scroll.
6. **Projetos**: grade editorial com foco no hover (Aceternity Focus Cards) e "Carregar mais".
7. **Nós fazemos**: trilho horizontal de serviços e faixa que reage à velocidade do scroll.
8. **Processo**: etapas em acordeão (shadcn/ui).
9. **Estúdio**: manifesto revelado no scroll e três princípios (arco pleno, ogival, abatido).
10. **Passagem**: três arcos; o central cresce até virar a página de contato.
11. **Contato + rodapé**: CTA magnético para o Direct do Instagram e logotipo gigante.

O botão **Inverter cor** troca papel e tinta no site inteiro, inclusive nas cenas 3D.

## Bibliotecas

- **React 19 + Vite + TypeScript**, **Tailwind CSS v4**
- **shadcn/ui**: Accordion, Button, Sheet (menu móvel)
- **Framer Motion**: scroll-linked transforms, trocas com `AnimatePresence`, traço de SVG
- **GSAP**: preloader, entrada do herói, SplitText/ScrollTrigger (via React Bits)
- **Three.js / @react-three/fiber**: colunata de arcos e shader de relevo, carregados sob demanda
- **Lenis**: scroll suave sincronizado ao ticker do GSAP
- **React Bits**: SplitText, ScrollReveal, ScrollVelocity, DecryptedText, CountUp, Magnet, Noise (`src/components/reactbits/`)
- **Aceternity UI**: Text Generate Effect, Focus Cards, adaptados à identidade (`src/components/aceternity/`)
- **Lucide React**: ícones
- **SVG**: marca, arcos e seis pranchas técnicas procedurais (`src/components/drawings/`)

Respeita `prefers-reduced-motion` (sem scroll suave nem traços animados).
