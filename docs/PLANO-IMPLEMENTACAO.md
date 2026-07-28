# Plano de Implementação — Site YCar

> Executa o [PRD.md](./PRD.md). Runbook de infraestrutura (Cloudflare, DNS, e-mail): `planoimplantacao.md` (Downloads) — referenciado onde aplicável, não duplicado aqui.
> Ordem é de execução. Cada tarefa tem critério de pronto verificável. Não avançar de etapa com tarefa bloqueante aberta.

**Convenções:**
- 🔑 = tarefa bloqueante para a etapa seguinte
- Estimativas assumem sessões curtas de trabalho; propagação de DNS é o único tempo de espera real

---

## Etapa 0 — Pré-requisitos (30 min, pode rodar em paralelo com Etapa 1)

| # | Tarefa | Critério de pronto |
|---|---|---|
| 0.1 🔑 | Node 24 LTS ativo (`nvm install 24 && nvm use 24`) | `node -v` retorna 24.x (Angular 22 exige `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0`) |
| 0.2 | Conta GitHub com repositório privado `ycar-site` criado | Repositório existe e aceita push |
| 0.3 | Conta Cloudflare criada (sem cartão) | Login em dash.cloudflare.com funciona |
| 0.4 | Acesso ao Registro.br do titular de `ycarexecutive.com.br` confirmado | Login abre e o domínio aparece na conta |
| 0.5 | Enviar ao pai a lista de suposições ⚠️ (PRD §11) + pedido de 2–3 depoimentos | Mensagem enviada; respostas não bloqueiam Etapas 1–4 |

> 0.4 hoje mesmo: recuperar acesso a domínio é o item que mais atrasa projeto.

---

## Etapa 1 — Scaffold e design tokens (2–3 h)

| # | Tarefa | Critério de pronto |
|---|---|---|
| 1.1 🔑 | `ng new ycar-site --style=scss --ssr` + `outputMode: "static"` e `prerender: true` no `angular.json` | `ng build` gera `dist/ycar-site/browser/index.html`; caminho anotado |
| 1.2 | `.nvmrc` com `24` na raiz | Arquivo commitado (evita o erro nº 1 de build na Cloudflare) |
| 1.3 | Design tokens do PRD §6 em `src/styles/_tokens.scss` (custom properties em `:root`) + reset básico + `html { color-scheme: dark }` | Página de teste renderiza fundo `#0E0E10`, texto `#F2F0EB`; nenhuma cor hardcoded fora do arquivo de tokens |
| 1.4 | Fontes self-hosted: Fraunces 600 e Inter 400/500, woff2 subset latin em `public/fonts/` + `@font-face` com `font-display: swap` + preload da Fraunces no `index.html` | Aba Network mostra fontes servidas do próprio domínio; zero request a fonts.googleapis.com |
| 1.5 | Script inline no `<head>` que adiciona classe `js` ao `<html>` (estratégia anti-FOIC, PRD §7) | Com JS desabilitado, nenhum elemento fica oculto |
| 1.6 | `public/_headers`, `public/_redirects`, `public/robots.txt` conforme PRD §8.5 | Arquivos aparecem em `dist/ycar-site/browser/` após build |
| 1.7 | `site-content.ts` com interfaces do PRD §8.2 e conteúdo provisório das seções (PRD §5, incluindo marcações `PROVISÓRIO`) | Compila; todo texto do site vem deste arquivo, nenhum literal em template |
| 1.8 🔑 | Commit inicial na `main` | `git log` mostra commit; push no GitHub feito |

---

## Etapa 2 — Layout e componentes com conteúdo provisório (4–6 h)

Ordem de construção = ordem da página (PRD §4). Todos standalone, conteúdo via `site-content.ts`, imagens ainda placeholder (retângulos com gradiente escuro nas proporções finais — 16:9 hero, 4:3 galeria — para travar o CLS desde já).

| # | Tarefa | Critério de pronto |
|---|---|---|
| 2.1 | Header fixo com âncoras + CTA WhatsApp | Âncoras rolam para as seções (`scroll-behavior: smooth` via CSS, com `@media (prefers-reduced-motion) { auto }`); CTA abre `wa.me` com mensagem padrão |
| 2.2 | Hero com H1, sub, 2 CTAs e placeholder da imagem com `width`/`height` | Primeira dobra completa no mobile 360px sem scroll horizontal; H1 é o único da página |
| 2.3 | Stats (faixa de números, valores estáticos por ora) | Números renderizados no HTML prerenderizado (`view-source` mostra "5", "3", "39") |
| 2.4 | Services (5 cards, primeiro com destaque de largura dupla no desktop) | Cada card com CTA próprio abrindo `wa.me` com a mensagem específica do PRD §5.4 |
| 2.5 | Differentials (4 itens) + Vehicle (ficha + galeria para 3 fotos) + Steps (3 passos) | Seções renderizam; galeria dimensionada para exatamente 3 imagens, sem carrossel |
| 2.6 | Testimonials condicionada (`@if` array não vazio) + Coverage + Contact + Footer + FAB WhatsApp | Esvaziar array de depoimentos remove a seção inteira sem buraco de layout; FAB não cobre conteúdo nem CTA de contato |
| 2.7 | Acessibilidade estrutural: landmarks (`header/main/section/footer`), hierarquia H1→H2→H3, foco visível, alvos ≥ 44px | Tab percorre todos os links/botões com outline visível; Lighthouse a11y sem erro de heading/landmark |
| 2.8 🔑 | Responsivo 360px → 1440px | Sem scroll horizontal nem texto cortado em 360, 768, 1024, 1440 |

---

## Etapa 3 — Deploy cedo no Cloudflare Pages (30 min + verificação)

Deploy com o site ainda provisório — pipeline funcionando cedo elimina o risco de infraestrutura no fim.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 3.1 🔑 | Conectar repositório no Cloudflare Pages: preset Angular, build `npm run build`, output `dist/ycar-site/browser`, variável `NODE_VERSION=24` | Build remoto verde; site abre em `ycar-site.pages.dev` |
| 3.2 | Validar `_headers` e `_redirects` no ambiente publicado | Response headers mostram `Cache-Control` imutável em JS/CSS e `max-age=0` no `index.html` |
| 3.3 | Smoke test mobile no `.pages.dev` | Todos os CTAs de WhatsApp funcionam do celular; página usável em 4G |

> Domínio (`ycarexecutive.com.br` → nameservers Cloudflare → custom domain) pode ser feito já ou junto da Etapa 7 — seguir `planoimplantacao.md` Fase 4. Fazer cedo se o acesso ao Registro.br (0.4) estiver resolvido, para a propagação correr em paralelo.

---

## Etapa 4 — Animações (3–4 h)

Especificação completa: PRD §7. Regra de ouro: só `transform`/`opacity`, tudo atrás de `html.js` e `prefers-reduced-motion`.

| # | Tarefa | Critério de pronto |
|---|---|---|
| 4.1 | Diretiva `reveal-on-scroll` (IntersectionObserver único compartilhado, stagger via CSS custom property de delay) | Seções revelam uma vez ao entrar 15% no viewport; com reduced-motion, nada anima e tudo visível |
| 4.2 | Reveal por linha do headline do hero (CSS animation com `animation-fill-mode: both`, sem depender de JS) | H1 visível mesmo com JS off; LCP não regride vs. Etapa 3 (comparar Lighthouse antes/depois) |
| 4.3 | Diretiva `parallax` no hero (rAF, listener passivo, fator 0,15, `will-change: transform` só durante scroll) | Sem jank visível no DevTools Performance (60fps em CPU 4x slowdown); desligado com reduced-motion |
| 4.4 | Diretiva `count-up` (rAF, 1200ms, `tabular-nums`) | Valor final já está no HTML prerenderizado; animação roda uma vez; reduced-motion mostra valor direto |
| 4.5 | Reveal de imagem (scale 1.06→1 em wrapper `overflow: hidden`), linha decorativa sob H2 (`scaleX`), hovers de card/botão (sombra via pseudo-elemento com opacity) | Nenhuma animação toca propriedade fora de transform/opacity (auditar CSS com grep por `transition.*box-shadow\|width\|height\|top\|left`) |
| 4.6 🔑 | Teste em celular real (idealmente um Android de entrada) | Scroll fluido do topo ao fim; se houver jank, executar downgrade para nível "equilibrada" (remover 4.2 por-linha → fade simples, remover máscara de imagem) antes de seguir |

---

## Etapa 5 — Conteúdo real e imagens (2–3 h, depende das respostas do pai — tarefa 0.5)

| # | Tarefa | Critério de pronto |
|---|---|---|
| 5.1 | Resolver as 12 suposições do PRD §11 com o pai | Cada linha da tabela marcada como confirmada ou corrigida no PRD |
| 5.2 | Substituir textos `PROVISÓRIO` em `site-content.ts`; ajustar números da faixa de stats para valores reais | `grep -r "PROVISÓRIO" src/` retorna vazio |
| 5.3 | Depoimentos: inserir os coletados com autorização OU esvaziar o array | Nenhum depoimento inventado no ar; seção some se array vazio |
| 5.4 | Otimizar fotos: `npx sharp-cli` → WebP q78, largura máx 1600 | Hero < 200 KB; demais < 300 KB; `ls -la` das imagens confere |
| 5.5 | Trocar placeholders por `NgOptimizedImage`: `priority` no hero, lazy no resto, `width`/`height`, `alt` descritivo com a cor real do carro | Lighthouse sem warning de imagem; CLS < 0,1 mantido |
| 5.6 | Logo: avaliar PNG existente; se fraco, wordmark "YCAR" em Fraunces 600 (SVG) | Header e favicon usam a mesma marca; PNG original arquivado no repositório |

---

## Etapa 6 — SEO e metadados (1–2 h)

| # | Tarefa | Critério de pronto |
|---|---|---|
| 6.1 | `<title>`, meta description (150–160 chars com "São Paulo"), `lang="pt-BR"`, canonical | `view-source` do build confere todos |
| 6.2 | Open Graph completo + imagem 1200×630 (foto do carro tratada, < 300 KB) | Link colado em conversa de WhatsApp mostra preview com foto e título |
| 6.3 | JSON-LD `LocalBusiness` com nome, telefone, `areaServed`, `url`, CNPJ se fornecido | Rich Results Test do Google valida sem erro |
| 6.4 | `sitemap.xml` na raiz (conferir saída do prerender) + favicon + apple-touch-icon | `curl https://…/sitemap.xml` retorna 200; favicon aparece na aba |
| 6.5 | Search Console: propriedade verificada + sitemap enviado | Console mostra sitemap "Êxito" |
| 6.6 | Cloudflare Web Analytics (snippet no `index.html`) | Visita de teste aparece no painel; aba Application segue sem cookie/storage |

---

## Etapa 7 — Auditoria de performance e acessibilidade + go-live (2 h + propagação DNS)

| # | Tarefa | Critério de pronto |
|---|---|---|
| 7.1 | Domínio apontado (se não feito na Etapa 3): nameservers no Registro.br, custom domains no Pages, SSL Full (strict), Always Use HTTPS | `https://ycarexecutive.com.br` abre com cadeado; `www` e `http://` redirecionam |
| 7.2 | E-mail: Cloudflare Email Routing, `contato@ycarexecutive.com.br` → Gmail do pai (`planoimplantacao.md` Fase 5) | E-mail de teste chega na caixa dele; senão, remover e-mail da seção contato (suposição ⚠️ 9) |
| 7.3 🔑 | PageSpeed Insights mobile no domínio final | Score ≥ 90; LCP < 2,0s; CLS < 0,1 — imprimir/salvar o relatório |
| 7.4 | Orçamento de JS | Transferência inicial < 150 KB comprimido na aba Network |
| 7.5 | Auditoria de acessibilidade: contraste com ferramenta (todos os pares), teclado, reduced-motion, JS off, leitor de tela rápido (rotor de headings) | Critérios de aceite 8–13 do PRD §9 todos "sim" |
| 7.6 | Checklist final de aceite: percorrer PRD §9 itens 1–22 | Todos marcados; item que falhar vira bloqueio de go-live |
| 7.7 | Testes de campo: celular real em 4G, link mandado no próprio WhatsApp, 2 pessoas leigas acham o WhatsApp em 5 s | Os três testes passam |
| 7.8 | Google Business Profile criado no dia do go-live (categoria "Serviço de transporte executivo", mesmas fotos, link do site) | Perfil publicado; pedido de avaliação enviado a clientes antigos |

---

## Pós-go-live (manutenção mínima)

| Frequência | O quê |
|---|---|
| Mensal | Web Analytics: visitas e origem; contagem de cliques em WhatsApp (métrica primária do PRD §1) |
| Trimestral | `ng update`; build ainda verde |
| Anual | Renovar domínio (lembrete 30 dias antes — `.com.br` expirado fica público) |
| Sob demanda | Foto nova → sharp → `git push` |

---

## Riscos e mitigação

| Risco | Mitigação já embutida |
|---|---|
| Build remoto falha por Node antigo | `.nvmrc` (1.2) + `NODE_VERSION=24` (3.1) |
| Animação marcante trava celular de entrada | Gate 4.6 com downgrade definido antes de seguir |
| Pai demora com fotos/respostas | Etapas 1–4 não dependem; placeholders com proporção final travam layout |
| Depoimentos não chegam | Seção condicionada a array (2.6) — some sem refação |
| Acesso ao Registro.br perdido | Tarefa 0.4 no dia 1, antes de qualquer código |
