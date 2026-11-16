import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CONTATO, MENSAGEM_PADRAO, MENU, RESERVA, UI, linkWhatsApp } from '../content/site-content';
import { Icon } from './icon';
import { SeletorIdioma } from './seletor-idioma';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, SeletorIdioma],
  template: `
    <header class="header">
      <div class="container header__inner">
        <a class="header__brand" href="#inicio" [attr.aria-label]="ui.voltarInicio">
          <img
            src="/images/logo-ycar-header.webp"
            alt="YCar Executive"
            width="91"
            height="64"
            fetchpriority="high"
          />
        </a>
        <nav class="header__nav" [attr.aria-label]="ui.secoes">
          @for (item of menu(); track $index) {
            @if (item.externo) {
              <a [href]="item.destino" target="_blank" rel="noopener">{{ item.rotulo }}</a>
            } @else {
              <a [href]="item.destino" [attr.aria-current]="ativa() === item.destino ? 'true' : null">
                {{ item.rotulo }}
              </a>
            }
          }
        </nav>
        <app-seletor-idioma class="header__idiomas" />
        <a class="btn btn--primary header__cta" [href]="reserva().plataformaUrl" target="_blank" rel="noopener">
          <span class="header__cta-longo">{{ reserva().cta.rotulo }}</span>
          <span class="header__cta-curto">{{ ui.reservarCurto }}</span>
        </a>
        <button
          type="button"
          class="header__menu-btn"
          aria-haspopup="dialog"
          aria-controls="menu-mobile"
          [attr.aria-label]="ui.abrirMenu"
          [attr.aria-expanded]="aberto()"
          (click)="abrir()"
        >
          <span class="burger" aria-hidden="true"><span></span><span></span></span>
        </button>
      </div>
    </header>

    <dialog
      #menuDialogo
      id="menu-mobile"
      class="menu"
      [attr.aria-label]="ui.menuPrincipal"
      (close)="aoFechar()"
    >
      <!-- Mesma barra do cabeçalho: a folha desce a partir dela e só o ícone muda -->
      <div class="container header__inner menu__topo">
        <a
          class="header__brand"
          href="#inicio"
          [attr.aria-label]="ui.voltarInicio"
          (click)="irPara($event, '#inicio')"
        >
          <img src="/images/logo-ycar-header.webp" alt="YCar Executive" width="91" height="64" />
        </a>
        <button
          type="button"
          class="header__menu-btn"
          autofocus
          aria-expanded="true"
          [attr.aria-label]="ui.fecharMenu"
          (click)="fechar()"
        >
          <span class="burger burger--x" aria-hidden="true"><span></span><span></span></span>
        </button>
      </div>

      <div class="container menu__corpo">
        <nav [attr.aria-label]="ui.secoes">
          <ul class="menu__lista">
            @for (item of secoes(); track $index) {
              <li class="menu__entra" [style.--i]="$index">
                <a [href]="item.destino" (click)="irPara($event, item.destino)">{{ item.rotulo }}</a>
              </li>
            }
          </ul>
        </nav>

        <div class="menu__rodape menu__entra" [style.--i]="secoes().length">
          <div class="menu__grupo">
            <span class="menu__rotulo">{{ ui.contato }}</span>
            <a [href]="waHref()" target="_blank" rel="noopener">
              <app-icon name="whatsapp" [size]="18" />
              {{ contato().whatsappExibicao }}
            </a>
            <a [href]="contato().instagramUrl" target="_blank" rel="noopener">
              <app-icon name="instagram" [size]="18" />
              {{ contato().instagramUsuario }}
            </a>
            <app-seletor-idioma />
          </div>
          <a class="btn btn--primary btn--lg menu__cta" [href]="reserva().plataformaUrl" target="_blank" rel="noopener">
            {{ reserva().cta.rotulo }}
          </a>
        </div>
      </div>
    </dialog>
  `,
  styles: `
    .header {
      position: fixed;
      inset-block-start: 0;
      inset-inline: 0;
      z-index: 100;
      background: rgba(5, 5, 5, 0.82);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-block-end: 1px solid var(--color-border);
    }

    .header__inner {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      min-height: 4.5rem;
      padding-block: 0.5rem;
    }

    .header__brand {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
    }

    .header__brand img {
      block-size: 3.25rem;
      inline-size: auto;
    }

    .header__nav {
      display: flex;
      gap: var(--space-3);
      margin-inline-start: auto;
    }

    .header__nav a {
      color: var(--color-text-2);
      text-decoration: none;
      font-size: var(--text-small);
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      transition: color var(--duration-fast) var(--ease-out);
    }

    .header__nav a:hover,
    .header__nav a[aria-current] {
      color: var(--color-text);
    }

    .header__nav a[aria-current] {
      text-decoration: underline;
      text-decoration-color: var(--color-accent);
      text-underline-offset: 0.5em;
    }

    .header__cta {
      min-height: 44px;
      padding: 0.5rem 1.25rem;
      font-size: var(--text-small);
      white-space: nowrap;
    }

    .header__cta-curto {
      display: none;
    }

    .header__menu-btn {
      display: none;
      align-items: center;
      justify-content: center;
      inline-size: 44px;
      block-size: 44px;
      padding: 0;
      background: transparent;
      border: 0;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }

    /* Duas linhas que se juntam no centro e giram até virar ✕ (e o contrário ao fechar) */
    .burger {
      position: relative;
      inline-size: 20px;
      block-size: 12px;
    }

    .burger span {
      position: absolute;
      inset-inline: 0;
      inset-block-start: calc(50% - 0.75px);
      block-size: 1.5px;
      border-radius: 1px;
      background: var(--color-text);
      transition:
        translate 160ms var(--ease-out) 160ms,
        rotate 160ms var(--ease-out);
    }

    .burger span:first-child {
      translate: 0 -4px;
    }

    .burger span:last-child {
      translate: 0 4px;
    }

    .menu[open] .burger--x span {
      translate: 0 0;
      transition:
        translate 160ms var(--ease-out),
        rotate 160ms var(--ease-out) 160ms;
    }

    .menu[open] .burger--x span:first-child {
      rotate: 45deg;
    }

    .menu[open] .burger--x span:last-child {
      rotate: -45deg;
    }

    @starting-style {
      .menu[open] .burger--x span:first-child {
        translate: 0 -4px;
        rotate: 0deg;
      }

      .menu[open] .burger--x span:last-child {
        translate: 0 4px;
        rotate: 0deg;
      }
    }

    /* Abaixo de 64em os links não cabem em linha: viram ícone de menu com folha em tela cheia */
    @media (max-width: 63.99em) {
      .header__inner {
        gap: var(--space-1);
      }

      .header__nav {
        display: none;
      }

      .header__idiomas {
        margin-inline-start: auto;
      }

      .header__menu-btn {
        display: inline-flex;
      }
    }

    @media (max-width: 29.99em) {
      .header__brand img {
        block-size: 2.75rem;
      }

      .header__cta {
        padding-inline: 0.875rem;
      }

      .header__cta-longo {
        display: none;
      }

      .header__cta-curto {
        display: inline;
      }
    }

    /* Folha: nasce da barra do topo (a faixa de 4.5rem já aparece) e desce até cobrir a tela.
       Ao fechar, os itens somem primeiro e a folha recolhe; display/overlay seguram o
       <dialog> na tela até o fim. Navegador sem @starting-style abre e fecha sem animar. */
    .menu {
      position: fixed;
      inset: 0;
      inline-size: 100%;
      block-size: 100dvh;
      max-inline-size: none;
      max-block-size: none;
      margin: 0;
      padding: 0;
      border: 0;
      color: var(--color-text);
      background: rgba(5, 5, 5, 0.94);
      backdrop-filter: blur(20px) saturate(140%);
      -webkit-backdrop-filter: blur(20px) saturate(140%);
      clip-path: inset(0 0 calc(100% - 4.5rem) 0);
      transition:
        clip-path 300ms var(--ease-apple) 120ms,
        display 420ms allow-discrete,
        overlay 420ms allow-discrete;
    }

    .menu[open] {
      display: flex;
      flex-direction: column;
      clip-path: inset(0);
      transition: clip-path 380ms var(--ease-apple);
    }

    @starting-style {
      .menu[open] {
        clip-path: inset(0 0 calc(100% - 4.5rem) 0);
      }
    }

    .menu::backdrop {
      background: transparent;
    }

    .menu__topo {
      border-block-end: 1px solid var(--color-border);
    }

    .menu__topo .header__brand {
      margin-inline-end: auto;
    }

    .menu__topo .header__menu-btn {
      display: inline-flex;
    }

    .menu__corpo {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: var(--space-6);
      padding-block-start: var(--space-4);
      overflow-y: auto;
    }

    .menu__lista {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: var(--space-1);
    }

    .menu__lista a {
      display: block;
      padding-block: 0.375rem;
      font-family: var(--font-display);
      font-size: clamp(1.75rem, 7vw, 2.25rem);
      line-height: 1.15;
      color: var(--color-text);
      text-decoration: none;
      transition: color var(--duration-fast) var(--ease-out);
    }

    .menu__lista a:hover,
    .menu__lista a:focus-visible {
      color: var(--color-accent);
    }

    /* Cascata de cima para baixo depois que a folha abre; saída rápida antes de ela recolher */
    .menu__entra {
      opacity: 0;
      translate: 0 -8px;
      transition:
        opacity 120ms var(--ease-out),
        translate 120ms var(--ease-out);
    }

    .menu[open] .menu__entra {
      opacity: 1;
      translate: 0 0;
      transition:
        opacity 320ms var(--ease-out) calc(150ms + var(--i) * 45ms),
        translate 320ms var(--ease-out) calc(150ms + var(--i) * 45ms);
    }

    @starting-style {
      .menu[open] .menu__entra {
        opacity: 0;
        translate: 0 -8px;
      }
    }

    .menu__rodape {
      display: grid;
      gap: var(--space-3);
      padding-block-end: max(var(--space-4), env(safe-area-inset-bottom));
    }

    .menu__grupo {
      display: grid;
      justify-items: start;
    }

    .menu__rotulo {
      font-size: var(--text-overline);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--color-text-2);
      margin-block-end: var(--space-1);
    }

    .menu__grupo > a {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 44px;
      font-size: var(--text-small);
      color: var(--color-text);
      text-decoration: none;
    }

    .menu__grupo app-icon {
      color: var(--color-accent);
    }

    /* Cada sigla é centrada num alvo de 2rem: recua para alinhar com os links acima */
    .menu__grupo app-seletor-idioma {
      margin-inline-start: -0.5rem;
    }

    .menu__cta {
      inline-size: 100%;
    }

    @media (prefers-reduced-motion: reduce) {
      .menu,
      .menu[open],
      .menu__entra,
      .menu[open] .menu__entra,
      .burger span {
        transition-duration: 1ms;
        transition-delay: 0ms;
        translate: none;
      }
    }
  `,
})
export class Header {
  private readonly documento = inject(DOCUMENT);
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('menuDialogo');
  private destinoPendente: string | null = null;

  protected readonly ui = UI.cabecalho;
  protected readonly menu = MENU;
  protected readonly secoes = computed(() => MENU().filter((item) => !item.externo));
  protected readonly contato = CONTATO;
  protected readonly reserva = RESERVA;
  protected readonly waHref = computed(() => linkWhatsApp(MENSAGEM_PADRAO()));
  protected readonly aberto = signal(false);
  /** Âncora da seção que cruza o meio da tela, marcada no menu do computador */
  protected readonly ativa = signal<string | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const visiveis = new Set<string>();
      const io = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            const destino = `#${e.target.id}`;
            if (e.isIntersecting) visiveis.add(destino);
            else visiveis.delete(destino);
          }
          // Faixa fina no meio da tela: no máximo uma seção por vez
          this.ativa.set(this.secoes().find((s) => visiveis.has(s.destino))?.destino ?? null);
        },
        { rootMargin: '-50% 0px -50% 0px' },
      );
      for (const { destino } of this.secoes()) {
        const secao = this.documento.querySelector(destino);
        if (secao) io.observe(secao);
      }
      destroyRef.onDestroy(() => io.disconnect());
    });
  }

  protected abrir(): void {
    this.dialogo().nativeElement.showModal();
    this.documento.documentElement.classList.add('menu-aberto');
    this.aberto.set(true);
  }

  protected fechar(): void {
    this.dialogo().nativeElement.close();
  }

  // Rolagem só depois de fechar: com o menu aberto a página está travada
  protected irPara(evento: Event, destino: string): void {
    evento.preventDefault();
    this.destinoPendente = destino;
    this.fechar();
  }

  protected aoFechar(): void {
    this.documento.documentElement.classList.remove('menu-aberto');
    this.aberto.set(false);
    if (!this.destinoPendente) return;
    this.documento.querySelector(this.destinoPendente)?.scrollIntoView();
    history.replaceState(null, '', this.destinoPendente);
    this.destinoPendente = null;
  }
}
