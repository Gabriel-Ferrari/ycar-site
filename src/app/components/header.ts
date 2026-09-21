import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CONTATO, MENSAGEM_PADRAO, MENU, RESERVA, linkWhatsApp } from '../content/site-content';
import { Icon } from './icon';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <header class="header">
      <div class="container header__inner">
        <a class="header__brand" href="#inicio" aria-label="YCar Executive — voltar ao início">
          <img
            src="/images/logo-ycar-header.webp"
            alt="YCar Executive"
            width="91"
            height="64"
            fetchpriority="high"
          />
        </a>
        <nav class="header__nav" aria-label="Seções do site">
          @for (item of menu; track item.destino) {
            @if (item.externo) {
              <a [href]="item.destino" target="_blank" rel="noopener">{{ item.rotulo }}</a>
            } @else {
              <a [href]="item.destino">{{ item.rotulo }}</a>
            }
          }
        </nav>
        <a class="btn btn--primary header__cta" [href]="reservaHref" target="_blank" rel="noopener">
          <span class="header__cta-longo">Reserve Agora!</span>
          <span class="header__cta-curto">Reservar</span>
        </a>
        <button
          type="button"
          class="header__menu-btn"
          aria-haspopup="dialog"
          aria-controls="menu-mobile"
          [attr.aria-expanded]="aberto()"
          (click)="abrir()"
        >
          <app-icon name="menu" [size]="22" />
          <span>Menu</span>
        </button>
      </div>
    </header>

    <dialog
      #menuDialogo
      id="menu-mobile"
      class="menu"
      aria-label="Menu principal"
      (close)="aoFechar()"
    >
      <div class="container menu__topo">
        <a
          class="header__brand"
          href="#inicio"
          aria-label="YCar Executive — voltar ao início"
          (click)="irPara($event, '#inicio')"
        >
          <img src="/images/logo-ycar-header.webp" alt="YCar Executive" width="91" height="64" />
        </a>
        <button type="button" class="header__menu-btn" autofocus (click)="fechar()">
          <app-icon name="close" [size]="22" />
          <span>Fechar</span>
        </button>
      </div>

      <div class="container menu__corpo">
        <nav aria-label="Seções do site">
          <ol class="menu__lista">
            @for (item of secoes; track item.destino) {
              <li [style.--i]="$index">
                <a [href]="item.destino" (click)="irPara($event, item.destino)">
                  <span class="menu__num" aria-hidden="true">0{{ $index + 1 }}</span>
                  {{ item.rotulo }}
                </a>
              </li>
            }
          </ol>
        </nav>

        <div class="menu__rodape">
          <a class="btn btn--primary btn--lg menu__cta" [href]="reservaHref" target="_blank" rel="noopener">
            Reserve Agora!
          </a>
          <div class="menu__contatos">
            <a [href]="waHref" target="_blank" rel="noopener">
              <app-icon name="whatsapp" [size]="20" />
              {{ contato.whatsappExibicao }}
            </a>
            <a [href]="contato.instagramUrl" target="_blank" rel="noopener">
              <app-icon name="instagram" [size]="20" />
              {{ contato.instagramUsuario }}
            </a>
          </div>
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
      gap: var(--space-2);
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
      padding-inline: 0.25rem;
      transition: color var(--duration-fast) var(--ease-out);
    }

    .header__nav a:hover {
      color: var(--color-text);
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
      gap: 0.375rem;
      min-height: 44px;
      padding: 0.5rem 0.75rem;
      font: inherit;
      font-size: var(--text-small);
      font-weight: 500;
      color: var(--color-text);
      background: transparent;
      border: 1px solid rgba(247, 226, 185, 0.35);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: border-color var(--duration-fast) var(--ease-out);
    }

    .header__menu-btn:hover {
      border-color: var(--color-accent);
    }

    .header__menu-btn app-icon {
      color: var(--color-accent);
    }

    /* Abaixo de 64em os links não cabem em linha: viram botão Menu com painel em tela cheia */
    @media (max-width: 63.99em) {
      .header__inner {
        gap: var(--space-2);
      }

      .header__nav {
        display: none;
      }

      .header__cta {
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
        padding-inline: 1rem;
      }

      .header__cta-longo {
        display: none;
      }

      .header__cta-curto {
        display: inline;
      }
    }

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
      background: var(--color-bg);
    }

    .menu[open] {
      display: flex;
      flex-direction: column;
      animation: menu-entrada 200ms var(--ease-out);
    }

    .menu::backdrop {
      background: var(--color-bg);
    }

    .menu__topo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 4.5rem;
      padding-block: 0.5rem;
      border-block-end: 1px solid var(--color-border);
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
      overflow-y: auto;
    }

    .menu__lista {
      list-style: none;
      margin: var(--space-3) 0 0;
      padding: 0;
    }

    .menu__lista li {
      border-block-end: 1px solid var(--color-border);
      animation: menu-item 240ms var(--ease-out) both;
      animation-delay: calc(var(--i) * 30ms + 40ms);
    }

    .menu__lista a {
      display: flex;
      align-items: baseline;
      gap: var(--space-2);
      min-height: 3rem;
      padding-block: 0.75rem;
      font-family: var(--font-display);
      font-size: clamp(1.375rem, 5.5vw, 1.75rem);
      line-height: 1.15;
      color: var(--color-text);
      text-decoration: none;
      transition: color var(--duration-fast) var(--ease-out);
    }

    .menu__lista a:hover,
    .menu__lista a:focus-visible {
      color: var(--color-accent);
    }

    .menu__num {
      min-inline-size: 1.75rem;
      font-family: var(--font-body);
      font-size: var(--text-overline);
      letter-spacing: 0.14em;
      color: var(--color-accent);
    }

    .menu__rodape {
      display: grid;
      gap: var(--space-2);
      padding-block: 0 max(var(--space-4), env(safe-area-inset-bottom));
    }

    .menu__cta {
      inline-size: 100%;
    }

    .menu__contatos {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0 var(--space-4);
    }

    .menu__contatos a {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 44px;
      font-size: var(--text-small);
      color: var(--color-text-2);
      text-decoration: none;
    }

    .menu__contatos app-icon {
      color: var(--color-accent);
    }

    @keyframes menu-entrada {
      from {
        opacity: 0;
      }
    }

    @keyframes menu-item {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .menu[open],
      .menu__lista li {
        animation: none;
      }
    }
  `,
})
export class Header {
  private readonly documento = inject(DOCUMENT);
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('menuDialogo');
  private destinoPendente: string | null = null;

  protected readonly menu = MENU;
  protected readonly secoes = MENU.filter((item) => !item.externo);
  protected readonly contato = CONTATO;
  protected readonly reservaHref = RESERVA.plataformaUrl;
  protected readonly waHref = linkWhatsApp(MENSAGEM_PADRAO);
  protected readonly aberto = signal(false);

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
