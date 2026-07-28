# PRD — Site institucional YCar (Transporte Executivo)

> Versão 1.0 · 2026-07-28 · Single page Angular 22 SSG · Cloudflare Pages · pt-BR
> Documentos de referência: `planositetransporteexecutivo.md` e `planoimplantacao.md` (Downloads).

---

## 1. Visão e objetivo

Fazer com que um decisor corporativo (secretária de diretoria, facilities, ou o próprio executivo) que chega ao site confie na YCar em menos de 30 segundos e inicie uma conversa no WhatsApp.

**Métrica de sucesso primária:** contatos iniciados no WhatsApp (cliques nos CTAs `wa.me`, medidos via Cloudflare Web Analytics por evento de clique — sem cookies).

**Justificativa do posicionamento:** o alvo é B2B (empresas contratando transporte para diretoria e visitas). O que converte esse público não é preço, é risco zero: nota fiscal, contrato, motorista fixo e pontualidade comprovável. Todo o texto do site trabalha essas quatro alavancas.

---

## 2. Público-alvo

**Persona 1 — Renata, assistente executiva.** Agenda transporte para dois diretores de uma empresa no Itaim. Recebeu o link da YCar por indicação, abre no desktop durante o expediente. Precisa decidir se é seguro colocar o diretor nesse carro: procura sinal de empresa séria (CNPJ, nota fiscal, contrato, aparência profissional). Se confiar, chama no WhatsApp e pergunta sobre atendimento recorrente. *O site precisa parecer mais confiável que o motorista de aplicativo e mais acessível que uma locadora de blindados.*

**Persona 2 — Marcos, diretor comercial em viagem.** Desembarca em GRU às 21h, o esquema de transporte da empresa falhou. Recebeu o link pelo WhatsApp da assistente, abre no celular, no 4G, andando. Tem 20 segundos de paciência. Precisa ver na primeira tela: o que é, onde atua, e um botão de WhatsApp que funcione com o polegar. *O site precisa carregar rápido e converter na primeira dobra.*

---

## 3. Escopo

**Entra na v1:**
- Single page com rolagem contínua e âncoras no menu
- Conteúdo estático em pt-BR, prerender completo (`outputMode: "static"`)
- CTAs de WhatsApp (`wa.me` com mensagem pré-preenchida, variando por seção) e Instagram
- Animações de entrada, parallax sutil no hero, contadores animados (nível: marcante)
- SEO on-page completo: metadados, Open Graph, JSON-LD `LocalBusiness`, sitemap, robots
- `_headers` e `_redirects` para Cloudflare Pages

**Não entra na v1 (explícito):**
- Backend, banco de dados, autenticação, área de cliente
- Formulário de qualquer tipo (cotação vai para o backlog)
- Tabela de preços — cotação é caso a caso; preço na tela joga o cliente para comparação com aplicativo
- Blog, multi-idioma, seção de vans/fretamento (backlog)
- Carrossel automático, vídeo de fundo no hero
- Qualquer serviço pago, API externa em runtime, cookies/localStorage

---

## 4. Arquitetura de informação

Ordem das seções, objetivo e CTA de cada uma:

| # | Seção (âncora) | Objetivo | CTA |
|---|---|---|---|
| 0 | Header fixo | Navegação por âncoras + WhatsApp sempre visível | Botão WhatsApp compacto |
| 1 | Hero (`#inicio`) | Dizer o que é, para quem, onde — e converter o visitante apressado (Persona 2) | Primário: WhatsApp · Secundário: âncora `#servicos` |
| 2 | Números (`—`) | Prova rápida de solidez (contadores animados) | — (faixa de transição) |
| 3 | Serviços (`#servicos`) | Mostrar o portfólio com corporativo em primeiro | WhatsApp com mensagem específica por card |
| 4 | Diferenciais (`#diferenciais`) | Responder "por que não um aplicativo?" | — |
| 5 | Veículo (`#veiculo`) | Prova visual — o carro que o diretor vai ver na porta | WhatsApp |
| 6 | Como funciona (`—`) | Reduzir atrito: 3 passos, sem burocracia | WhatsApp |
| 7 | Depoimentos (`#clientes`) | Prova social B2B (slots provisórios até coleta) | — |
| 8 | Área de atendimento (`#area`) | SEO local: cidades e aeroportos por extenso | — |
| 9 | Contato (`#contato`) | Conversão final para quem rolou até o fim | WhatsApp grande + Instagram + e-mail |
| 10 | Rodapé | Credibilidade formal: CNPJ, cidade, © | — |
| — | FAB WhatsApp | Botão flutuante, visível em todas as seções após o hero | WhatsApp |

**Justificativa da ordem:** serviços antes de diferenciais porque o público B2B primeiro confere *se* a YCar faz o que ele precisa, depois *por que* ela e não outro. Depoimentos depois do veículo porque prova social pesa mais depois da prova visual.

---

## 5. Conteúdo por seção

Número do WhatsApp: `5511982998183`. Mensagem padrão pré-preenchida:
`Olá! Vim pelo site da YCar e gostaria de um orçamento de transporte executivo.`
(`https://wa.me/5511982998183?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20YCar%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20transporte%20executivo.`)

### 5.1 Header
- Logo: wordmark "YCAR" (redesenho tipográfico em Fraunces — o PNG existente vira referência; se tiver qualidade, uso o PNG com fundo transparente) <!-- PROVISÓRIO: validar qualidade do PNG -->
- Âncoras: Serviços · Diferenciais · Veículo · Clientes · Contato
- Botão: "WhatsApp" (compacto, dourado)
- Mobile: menu colapsa em âncoras horizontais roláveis ou botão hambúrguer — decidir na implementação; botão de WhatsApp permanece visível fora do menu

### 5.2 Hero
- **Overline (caps, dourado):** TRANSPORTE EXECUTIVO · SÃO PAULO
- **Headline (H1):** Transporte executivo corporativo em São Paulo
- **Subheadline:** Motorista fixo, sigilo absoluto e pontualidade monitorada — com nota fiscal em todo atendimento. Há 5 anos servindo empresas e executivos na capital e Grande São Paulo.
- **CTA primário:** Pedir proposta no WhatsApp
- **CTA secundário (ghost):** Conhecer os serviços
- **Ativos:** 1 foto do carro, externa 3/4 dianteira, paisagem, mínimo 1600px de largura, tratada com gradiente escuro de baixo para cima (`--color-overlay`). Exportada < 200 KB em WebP. É a imagem LCP: `NgOptimizedImage` com `priority`.

### 5.3 Números (faixa)
Contadores animados sobre fundo `--color-surface`:
- **5** anos de atendimento executivo
- **3** aeroportos atendidos (GRU · CGH · VCP) <!-- ⚠️ validar: ele atende os três? -->
- **39** municípios da Grande São Paulo <!-- ⚠️ validar: atende a região metropolitana inteira? Se não, trocar por outro número real. Não inventar. -->
- **Ativos:** nenhum.

### 5.4 Serviços
- **Headline (H2):** Serviços
- **Sub:** Do transfer pontual ao contrato mensal — sempre com nota fiscal.

Cards, nesta ordem de destaque (o primeiro ocupa largura dupla no desktop):

1. **Atendimento corporativo** — Contrato mensal ou demanda recorrente para diretoria, visitas de negócios e comitivas. Um único motorista dedicado à sua conta e nota fiscal em todo atendimento.
   CTA: "Pedir proposta corporativa" → `text=Olá! Gostaria de uma proposta de atendimento corporativo da YCar.`
2. **Transfer aeroporto** — GRU, CGH e VCP. Acompanhamos o status do voo: atrasou, o horário ajusta sem custo extra. Recepção no desembarque com identificação. <!-- ⚠️ validar: recepção com placa/identificação é prática dele? -->
3. **À disposição por hora ou diária** — Agenda de reuniões pela cidade, roadshow, dia de visitas. O carro espera; a agenda manda.
4. **Viagens rodoviárias** — Intermunicipais e interestaduais, ida e volta ou apenas trecho. Litoral, interior e outras capitais. <!-- PROVISÓRIO: confirmar raio real de atuação -->
5. **Eventos** — Casamentos, formaturas e eventos corporativos. Horário combinado, carro impecável, sem imprevisto.

- **Ativos:** ícones em SVG inline (traço fino, dourado). Nenhuma foto.

### 5.5 Diferenciais
- **Headline (H2):** Por que YCar e não um aplicativo?
- 4 itens em faixa:
  1. **Motorista fixo** — Sempre o mesmo profissional. Ele conhece o passageiro, os endereços e as preferências — nenhum aplicativo replica isso.
  2. **Sigilo e discrição** — Reuniões acontecem no banco de trás. O que se fala no carro fica no carro.
  3. **Pontualidade monitorada** — Voo e trânsito acompanhados em tempo real. O carro chega antes do horário, não "em até tantos minutos".
  4. **Nota fiscal e contrato** — NF em todo atendimento, para reembolso e conformidade do financeiro. Contrato para demanda recorrente.
- **Ativos:** nenhum (ícones SVG inline).

### 5.6 Veículo
- **Headline (H2):** O carro que chega na porta
- **Corpo:** Chery Tiggo 8 Pro Hybrid 2024 — SUV híbrido: deslocamento silencioso, partida sem ruído e conforto estável mesmo no trânsito de São Paulo. Higienizado a cada atendimento. <!-- PROVISÓRIO: cor do veículo, itens de bordo (água, carregador, wi-fi) — confirmar antes de prometer -->
- **Ficha curta (lista):** Modelo · Ano 2024 · Híbrido · Capacidade de passageiros e bagagem <!-- ⚠️ confirmar configuração real de lugares usados no executivo -->
- **CTA:** Reservar no WhatsApp
- **Ativos:** 2–3 fotos (interna banco traseiro, porta-malas, detalhe), proporção 4:3 ou 3:2, `loading` lazy, cada uma < 300 KB WebP. Layout de galeria compacta (1 grande + 2 menores) dimensionado para exatamente 3 fotos — sem carrossel.

### 5.7 Como funciona
- **Headline (H2):** Simples assim
- 3 passos numerados:
  1. **Chame no WhatsApp** — Diga origem, destino e horário.
  2. **Receba a proposta** — Valor fechado, sem surpresa e sem tarifa dinâmica. <!-- ⚠️ prazo de resposta: confirmar com ele antes de prometer "em X minutos" -->
  3. **Motorista no local** — Antes do horário, com o trajeto já estudado.
- **CTA:** Começar agora
- **Ativos:** nenhum.

### 5.8 Depoimentos
- **Headline (H2):** Quem contrata, volta
- 3 slots de citação (nome ou inicial + cargo/empresa). Conteúdo real a coletar — **não publicar inventado**. Até a coleta, a seção fica no layout com textos claramente provisórios para dimensionamento:
  <!-- PROVISÓRIO: substituir pelos 3 depoimentos reais com autorização. Se não coletados até o go-live, ocultar a seção via flag no conteúdo (remover do array), nunca publicar placeholder. -->
- **Ativos:** nenhum (sem foto de cliente — discrição é diferencial da marca).

### 5.9 Área de atendimento
- **Headline (H2):** Onde a YCar atende
- **Corpo (texto corrido + lista, importante para SEO local):** São Paulo capital — todas as regiões. Grande São Paulo: ABC, Guarulhos, Osasco, Barueri/Alphaville e demais municípios. Aeroportos: Guarulhos (GRU), Congonhas (CGH) e Viracopos (VCP). Viagens intermunicipais e interestaduais sob cotação.
- **Ativos:** nenhum (sem mapa embedado — mapa de terceiro viola a regra de zero requisição externa; se quiser mapa, imagem estática própria no pós-v1).

### 5.10 Contato
- **Headline (H2):** Fale com a YCar
- **Sub:** Resposta direta de quem dirige.
- Botão WhatsApp grande (largura total no mobile) + link Instagram `@ycarexecutive` + e-mail `contato@ycarexecutive.com.br` <!-- ⚠️ e-mail depende de configurar Cloudflare Email Routing — confirmar antes de publicar -->
- Horário de atendimento: <!-- ⚠️ confirmar (sugestão: "todos os dias, com agendamento prévio") -->

### 5.11 Rodapé
- YCar Transporte Executivo · CNPJ <!-- ⚠️ número a fornecer --> · São Paulo – SP · © 2026
- Links: Instagram · WhatsApp · âncoras principais

---

## 6. Design system

Paleta escolhida: **Grafite & Ouro** (contraste AA verificado: texto `#F2F0EB` sobre `#0E0E10` ≈ 17:1; secundário `#9B978F` ≈ 6,6:1; dourado `#C9A227` sobre fundo ≈ 7,9:1; texto escuro sobre botão dourado ≈ 7,9:1).

```css
:root {
  /* ---- Cor ---- */
  --color-bg:            #0E0E10;  /* fundo geral (grafite profundo) */
  --color-surface:       #17171A;  /* cards, faixas alternadas */
  --color-surface-2:     #1E1E22;  /* hover de card, elementos elevados */
  --color-accent:        #C9A227;  /* ouro: CTAs, overlines, detalhes, contadores */
  --color-accent-hover:  #E0B93E;  /* hover/focus de elementos dourados */
  --color-accent-press:  #A8871F;  /* estado pressed */
  --color-text:          #F2F0EB;  /* texto principal (off-white) */
  --color-text-2:        #9B978F;  /* texto secundário (cinza quente) */
  --color-border:        rgba(242, 240, 235, 0.08);
  --overlay-hero: linear-gradient(180deg,
      rgba(14,14,16,0.25) 0%, rgba(14,14,16,0.88) 100%);

  /* ---- Tipografia ---- */
  --font-display: 'Fraunces', Georgia, serif;      /* títulos, peso 600 */
  --font-body:    'Inter', system-ui, sans-serif;  /* corpo, 400/500 */
  --text-hero:     clamp(2.75rem, 7vw, 5rem);      /* H1, leading 1.05 */
  --text-h2:       clamp(2rem, 4.5vw, 3rem);       /* leading 1.15 */
  --text-h3:       clamp(1.25rem, 2.5vw, 1.5rem);
  --text-body-lg:  1.125rem;
  --text-body:     1rem;
  --text-small:    0.875rem;
  --text-overline: 0.8125rem;  /* caps, letter-spacing 0.14em, dourado */
  --leading-tight: 1.1;
  --leading-body:  1.6;

  /* ---- Espaçamento (base 8px) ---- */
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2rem;
  --space-6: 3rem;
  --space-8: 4rem;
  --space-section: clamp(5rem, 12vh, 8rem);  /* respiro entre seções */
  --container-max: 72rem;                    /* 1152px */

  /* ---- Forma ---- */
  --radius-sm:  6px;    /* botões */
  --radius-md:  12px;   /* cards */
  --radius-pill: 999px; /* FAB, tags */

  /* ---- Sombra (estática por estado — nunca animada continuamente) ---- */
  --shadow-card: 0 8px 24px rgba(0, 0, 0, 0.35);
  --shadow-cta:  0 4px 16px rgba(201, 162, 39, 0.25);

  /* ---- Movimento ---- */
  --ease-out:      cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 200ms;
  --duration-base: 500ms;
  --duration-slow: 700ms;
}
```

**Estados de botão (CTA primário):**

| Estado | Fundo | Texto | Extra |
|---|---|---|---|
| Default | `--color-accent` | `#0E0E10` | `--shadow-cta` |
| Hover | `--color-accent-hover` | `#0E0E10` | `translateY(-2px)`, 200ms |
| Active | `--color-accent-press` | `#0E0E10` | `translateY(0)` |
| Focus-visible | igual default | igual | `outline: 2px solid var(--color-accent-hover); outline-offset: 3px` |

CTA secundário (ghost): borda 1px `--color-accent`, texto dourado; hover preenche com `rgba(201,162,39,0.1)`. Todos os botões: `min-height: 48px`, `min-width: 48px` (alvo de toque ≥ 44px com folga).

**Uso do dourado:** acento, nunca fundo de seção. Regra prática: no máximo um elemento dourado dominante por dobra — é o que mantém a sensação de luxo (escassez do metal).

---

## 7. Especificação de movimento

Nível escolhido: **marcante**. Regra global: animar somente `transform` e `opacity`. JS total de animação ≈ 5 KB (IntersectionObserver + rAF), sem biblioteca externa.

**Estratégia anti-FOIC (conteúdo invisível se JS falhar):** um script inline no `<head>` adiciona a classe `js` ao `<html>`. Todo estado inicial oculto de animação é escopado em `html.js .reveal { opacity: 0; ... }`. Sem JS, nada é ocultado — conteúdo 100% visível e navegável.

| Animação | Gatilho | Duração / easing | Propriedades | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| Headline do hero, reveal por linha | Load (após fonte via `font-display: swap`) | 700ms, stagger 90ms/linha, `--ease-out` | `opacity 0→1`, `translateY(0.6em→0)` dentro de wrapper `overflow: hidden` | Sem animação; texto visível imediatamente |
| Sub + CTAs do hero | Load, delay 250ms | 500ms, `--ease-out` | `opacity`, `translateY(24px→0)` | Visíveis imediatamente |
| Parallax da imagem do hero | Scroll (rAF, passivo) | contínuo, fator 0,15 | `translateY` apenas; imagem 115% de altura para não expor borda | Desligado; imagem estática |
| Reveal de seção | IntersectionObserver, `threshold: 0.15`, uma vez | 500ms, stagger 90ms entre filhos, `--ease-out` | `opacity 0→1`, `translateY(24px→0)` | Desligado; tudo visível |
| Reveal de imagem (veículo) | IntersectionObserver | 700ms, `--ease-out` | `opacity 0→1`, `scale(1.06→1)` dentro de wrapper `overflow: hidden` | Desligado |
| Linha decorativa sob H2 | IntersectionObserver | 600ms, delay 200ms, `--ease-out` | `scaleX(0→1)`, `transform-origin: left` | Linha visível estática |
| Contadores (números) | IntersectionObserver, `threshold: 0.5`, uma vez | 1200ms, ease-out (rAF) | textContent numérico (não é propriedade CSS; sem layout shift — largura reservada com `font-variant-numeric: tabular-nums`) | Valor final renderizado direto (já vem no HTML prerenderizado) |
| Hover de card | hover/focus | 250ms | `translateY(-4px)`; elevação via pseudo-elemento com sombra pré-renderizada e `opacity 0→1` (não anima `box-shadow`) | Transição instantânea permitida (é discreta), mas desligada por consistência |
| Hover de botão | hover/focus | 200ms | `translateY(-2px)`, troca de cor de fundo | Só troca de cor |
| FAB WhatsApp entrada | Scroll passou do hero (IO no hero) | 300ms, `--ease-out` | `opacity`, `scale(0.8→1)` | Sempre visível, sem animação |

**Restrições reafirmadas:** nada de GSAP/AOS/Lenis/Locomotive; nenhuma animação atrasa LCP (hero image e H1 não dependem de JS para aparecer — o reveal do H1 usa `animation` CSS com estado final garantido por `animation-fill-mode`, não classe via JS); contadores têm o valor final no HTML prerenderizado (SEO e no-JS).

---

## 8. Requisitos técnicos

### 8.1 Estrutura de componentes (standalone, signals)

```
src/app/
├── app.ts                    (shell: header + seções + footer + fab)
├── content/
│   └── site-content.ts       (todo o conteúdo tipado — única fonte)
├── components/
│   ├── header/               (nav âncoras + CTA)
│   ├── hero/
│   ├── stats/                (contadores)
│   ├── services/
│   ├── differentials/
│   ├── vehicle/
│   ├── steps/                (como funciona)
│   ├── testimonials/         (renderiza só se array não vazio)
│   ├── coverage/             (área de atendimento)
│   ├── contact/
│   ├── footer/
│   └── whatsapp-fab/
└── directives/
    ├── reveal-on-scroll.ts   (IntersectionObserver compartilhado)
    ├── parallax.ts           (rAF, só no hero)
    └── count-up.ts
```

Justificativa: um componente por seção mantém o template raso e o CSS encapsulado; as três direções de animação são diretivas reutilizáveis para não duplicar observer.

### 8.2 Modelo de dados do conteúdo

```ts
// site-content.ts — editar conteúdo sem tocar em componente
interface CtaWhatsApp { rotulo: string; mensagem: string; } // mensagem vira ?text= encodado
interface Servico { titulo: string; descricao: string; icone: string; cta?: CtaWhatsApp; destaque?: boolean; }
interface Diferencial { titulo: string; descricao: string; icone: string; }
interface Veiculo {
  nome: string; ano: number; categoria: 'executivo' | 'van'; // 'van' preparado para o futuro
  destaques: string[]; fotos: { src: string; alt: string; largura: number; altura: number }[];
}
interface Depoimento { citacao: string; autor: string; contexto: string; }
interface Estatistica { valor: number; sufixo?: string; rotulo: string; }
```

`Veiculo.categoria` já existe na v1 com um único item — quando as vans chegarem, adiciona-se item no array e um filtro, sem refatoração.

### 8.3 Estratégia de imagens
- Todas em WebP; origem otimizada via `sharp-cli` (`-q 78`, largura máx. 1600px)
- Hero: `NgOptimizedImage` com `priority`, `width`/`height` declarados, < 200 KB
- Demais: `ngSrc` lazy, `width`/`height` declarados (CLS 0), < 300 KB cada
- `srcset` gerado pelo `NgOptimizedImage` com breakpoints 640/960/1280/1600
- `alt` descritivo obrigatório em todas (ex.: "Chery Tiggo 8 Pro Hybrid preto estacionado em frente a prédio corporativo" — ajustar à cor real)

### 8.4 Fontes
- **Self-hosted** (woff2 em `public/fonts/`) — Google Fonts CDN violaria "zero requisição externa em runtime"
- Fraunces: apenas peso 600, subset latin. Inter: 400 e 500, subset latin
- `font-display: swap` em ambas; `<link rel="preload">` só para a Fraunces 600 (fonte do H1/LCP)
- Fallbacks com métricas próximas (`Georgia`, `system-ui`) para minimizar layout shift no swap

### 8.5 Arquivos de plataforma (`public/`)
- `_headers`: cache imutável para `*.js`/`*.css`/`*.webp`/`fonts`, `max-age=0` para `index.html`, headers de segurança (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) — conforme runbook `planoimplantacao.md`
- `_redirects`: `https://www.ycarexecutive.com.br/* https://ycarexecutive.com.br/:splat 301!` (canônico sem www)
- `robots.txt` com `Sitemap: https://ycarexecutive.com.br/sitemap.xml`
- `favicon.ico` + `apple-touch-icon.png` (180×180) derivados do wordmark

### 8.6 SEO e metadados
- `<html lang="pt-BR">`
- `<title>`: `Transporte Executivo Corporativo em São Paulo | YCar`
- `<meta name="description">`: 150–160 caracteres, com "São Paulo", "motorista executivo" e "nota fiscal"
- Open Graph: `og:title`, `og:description`, `og:image` 1200×630 (foto do carro tratada) — preview no WhatsApp é o principal canal de divulgação
- JSON-LD `LocalBusiness` (subtipo indicado: `TaxiService` ou `LocalBusiness` genérico): nome, telefone, `areaServed` (São Paulo e RMSP), `url`, `image` <!-- ⚠️ adicionar CNPJ/endereço quando fornecidos -->
- Canonical: `https://ycarexecutive.com.br/`
- H1 único (hero); H2 por seção; sem saltos de hierarquia

### 8.7 Requisitos não-funcionais (obrigatórios)

**Performance**
- LCP < 2,0s em 4G simulado mobile · CLS < 0,1 · JS inicial < 150 KB comprimido
- PageSpeed Insights ≥ 90 mobile
- Nenhuma imagem > 300 KB; hero < 200 KB; tudo WebP
- `NgOptimizedImage` com `priority` no hero, lazy no resto, `width`/`height` sempre

**Animação**
- Somente `transform` e `opacity`; reveal via IntersectionObserver; zero biblioteca de animação; zero smooth-scroll de terceiro
- `prefers-reduced-motion: reduce` honrado em 100% das animações
- Conteúdo crítico visível sem JS (estratégia `html.js` da seção 7)

**Acessibilidade**
- Contraste AA (≥ 4,5:1 texto) — pares verificados na seção 6
- Alvos de toque ≥ 44×44px · navegação por teclado com foco visível · `alt` em tudo · HTML semântico

**Plataforma**
- Zero `localStorage`/`sessionStorage`/cookies (sem banner LGPD)
- Zero chamada a API externa em runtime (fontes self-hosted, sem mapa embedado, sem pixel de terceiro; única exceção permitida: snippet do Cloudflare Web Analytics, que não usa cookies)
- `font-display: swap` + preload da fonte do hero
- 100% estático servido por CDN (`dist/ycar-site/browser`)

---

## 9. Critérios de aceite

Cada item verificável com sim/não:

1. [ ] `ng build` gera saída 100% estática em `dist/<projeto>/browser` com `index.html` prerenderizado contendo todo o texto do site
2. [ ] Site publicado no Cloudflare Pages e acessível em `ycarexecutive.com.br` com SSL, e `www` redireciona 301 para o domínio sem www
3. [ ] PageSpeed Insights mobile ≥ 90, com LCP < 2,0s e CLS < 0,1 no relatório
4. [ ] Transferência JS inicial < 150 KB comprimido (aba Network, gzip/brotli)
5. [ ] Nenhuma imagem servida > 300 KB; hero < 200 KB; todas WebP com `width`/`height`
6. [ ] Todos os botões de WhatsApp abrem conversa com mensagem pré-preenchida correta (testado em celular real)
7. [ ] Link do Instagram abre `@ycarexecutive` em nova aba com `rel="noopener"`
8. [ ] Com "reduzir movimento" ativado no sistema: nenhuma animação roda e todo o conteúdo permanece visível e navegável
9. [ ] Com JavaScript desabilitado: todo o texto e imagens visíveis, âncoras funcionam, links de WhatsApp funcionam
10. [ ] Navegação completa por teclado: todas as âncoras e CTAs alcançáveis por Tab, com foco visível
11. [ ] Todos os pares texto/fundo passam AA (verificado com ferramenta de contraste, não a olho)
12. [ ] Todos os alvos de toque ≥ 44×44px (auditoria Lighthouse ou manual)
13. [ ] H1 único, hierarquia de headings sem saltos, `alt` descritivo em todas as imagens
14. [ ] Zero cookies, localStorage e sessionStorage (aba Application vazia após navegação completa)
15. [ ] Zero requisições a domínios externos em runtime (aba Network), exceto Cloudflare Web Analytics se ativado
16. [ ] Link enviado no WhatsApp mostra preview com imagem e título (Open Graph válido)
17. [ ] JSON-LD validado no Rich Results Test do Google sem erro
18. [ ] `sitemap.xml` e `robots.txt` acessíveis na raiz; sitemap enviado ao Search Console
19. [ ] Nenhum texto placeholder/lorem no ar; todo conteúdo provisório ou foi substituído ou a seção foi ocultada (depoimentos)
20. [ ] Nenhum preço exibido em qualquer seção
21. [ ] Testado em celular real em 4G: carrega e é usável em < 3s percebidos
22. [ ] Animações fluidas em scroll no celular (sem jank visível); se houver jank em aparelho de entrada, downgrade do nível marcante para equilibrado antes do go-live

## 10. Backlog pós-v1

1. **Seção Vans / fretamento corporativo** — quando a primeira van entrar: novo item no array de `Veiculo` (categoria `van`), filtro na galeria, seção dedicada a fretamento com texto próprio
2. **Formulário de cotação de grupo** — para fretamento (múltiplos passageiros, recorrência); exigirá decisão de backend estático (ex.: Cloudflare Workers form) e linha de LGPD
3. **Depoimentos dinâmicos** — coleta contínua + rotação; avaliar integração com avaliações do Google Business Profile
4. **Blog de SEO local** — "fretamento em São Paulo", "transfer GRU corporativo" — só quando houver capacidade de produzir conteúdo real
5. **Mapa estático da área de atendimento** — imagem própria, sem serviço de terceiro
6. **Fotos profissionais** — sessão com fotógrafo (R$ 200–500, único investimento com melhor retorno visual)
7. **Google Business Profile** — não é código, mas é o item de divulgação nº 1; fazer no mesmo dia do go-live (runbook já cobre)

## 11. Suposições em aberto (⚠️ validar antes do go-live)

| # | Suposição | Impacto se estiver errada | Onde aparece |
|---|---|---|---|
| 1 | Atende GRU, CGH **e** VCP | Trocar contador "3 aeroportos" e texto de serviços/área | §5.3, §5.4, §5.9 |
| 2 | Atende os 39 municípios da RMSP | Trocar contador por outro número **real** | §5.3, §5.9 |
| 3 | Cor do veículo e itens de bordo (água, carregador, wi-fi) | Ajustar texto do veículo e `alt` das fotos | §5.6, §8.3 |
| 4 | Configuração de lugares do Tiggo 8 no uso executivo | Ficha do veículo | §5.6 |
| 5 | Recepção no desembarque com identificação é prática dele | Remover promessa do card de transfer | §5.4 |
| 6 | Horário de atendimento ("todos os dias com agendamento prévio") | Texto de contato e JSON-LD | §5.10 |
| 7 | Prazo de resposta da proposta | Passo 2 de "Como funciona" | §5.7 |
| 8 | Número do CNPJ para rodapé e JSON-LD | Rodapé fica sem CNPJ (perde credibilidade B2B) | §5.11, §8.6 |
| 9 | E-mail `contato@ycarexecutive.com.br` será configurado (Cloudflare Email Routing) | Remover e-mail da seção de contato | §5.10 |
| 10 | PNG do logo tem qualidade para uso; senão, wordmark tipográfico | Header e favicon | §5.1 |
| 11 | Depoimentos: 2–3 clientes darão autorização | Seção oculta no go-live (flag no array) | §5.8 |
| 12 | Marca exibida: "YCar" (curto) com nome completo "YCar Transporte Executivo" no rodapé/SEO | Ajustar wordmark e metadados | §5.1, §8.6 |
