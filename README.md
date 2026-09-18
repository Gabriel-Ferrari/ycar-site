# YCAR EXECUTIVE — site institucional

Site de página única da YCar Executive, empresa de transporte executivo em São Paulo: transfers,
receptivo em aeroportos, viagens, city tour e frota do sedã ao ônibus, incluindo blindados.

**Ver online: <https://ycar-site.ferrari-gabriel2002.workers.dev/>**

O objetivo do site é converter em WhatsApp: um decisor corporativo chega pelo link, confia na
empresa em poucos segundos e abre uma conversa. Não há backend, banco, login nem cookies — todo o
conteúdo é estático e pré-renderizado. O PRD completo está em [docs/PRD.md](docs/PRD.md).

## Stack

- **Angular 22** com componentes standalone, `ChangeDetectionStrategy.OnPush` e signals
- **SSG**: `outputMode: "static"`, uma única rota pré-renderizada em build, hidratada no cliente
- **SCSS** com design tokens em [src/styles/\_tokens.scss](src/styles/_tokens.scss)
- **Cloudflare Workers** servindo os assets estáticos ([wrangler.jsonc](wrangler.jsonc))
- Fontes self-hosted (Inter e Fraunces) — nenhuma requisição a terceiros em runtime

## Como rodar

```bash
npm install
npm start          # http://localhost:4200
```

Build de produção em `dist/ycar-site/browser`:

```bash
npm run build
```

Deploy para o Cloudflare (o `wrangler` não é dependência do projeto; o `npx` o baixa na hora):

```bash
npm run build && npx wrangler deploy
```

O runner de testes está configurado (`npm test`, Vitest), mas o projeto ainda não tem specs.

## Estrutura

```
src/
  app/
    components/     uma seção do site por arquivo (hero, services, fleet, about, …)
    content/        site-content.ts — fonte única de texto, links e imagens
    directives/     parallax, reveal-on-scroll, count-up
  styles/           design tokens
public/
  images/           fotos em WebP, com variantes responsivas
  fonts/            woff2 com subset dos glifos usados
scripts/            utilitários de build de assets
docs/               PRD e plano de implementação
```

Todo o texto visível vive em [src/app/content/site-content.ts](src/app/content/site-content.ts).
Editar conteúdo é mexer nesse arquivo, nunca no template de um componente.

## Imagens responsivas

As fotos dos cards de serviços e frota são servidas via `srcset` nas larguras 400/560/672/900. O
arquivo sem sufixo é a maior (900w) e serve de fallback; as variantes ficam ao lado dele como
`<nome>-<largura>.webp`.

**Ao adicionar ou trocar uma foto em `public/images/servicos` ou `public/images/frota`, rode:**

```bash
python3 scripts/gerar-variantes-imagens.py
```

Sem isso o `srcset` aponta para arquivos que não existem. As larguras geradas precisam continuar
espelhando `LARGURAS_CARD` em `site-content.ts`.

## Decisões de performance

O site é a primeira impressão de um cliente que muitas vezes abre o link no 4G, andando pelo
aeroporto. Algumas escolhas existem por causa disso:

- **Sem `@angular/router`.** A navegação é por âncoras e não existe `router-outlet`, então o router
  saía do bundle sem perder nada — cerca de 30 KiB de transferência.
- **Fontes com subset.** Os `.woff2` em `public/fonts` contêm apenas os glifos usados no site
  (latim com acentuação pt-BR e pontuação tipográfica), não o subset `latin` inteiro. Trocar uma
  fonte significa gerar o subset de novo, e um caractere fora do conjunto cai no fallback do
  sistema.
- **Imagem do hero antes das fontes no `<head>`.** Ela é o elemento de LCP; a ordem dos `preload`
  em [src/index.html](src/index.html) é intencional.
- **Tudo em WebP.** Nenhum PNG de conteúdo — só o ícone do iOS e a imagem de Open Graph, que não
  são baixados na renderização da página.

## Acessibilidade

Contraste AA verificado nas duas paletas (escura e bege), alvos de toque de no mínimo 44px, menu
mobile em `<dialog>` nativo com foco gerenciado, e animações de entrada que respeitam
`prefers-reduced-motion`. Sem JavaScript, nenhum conteúdo fica oculto: os estados iniciais de
animação só se aplicam sob `html.js`.
