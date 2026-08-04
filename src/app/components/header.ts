import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MENSAGEM_PADRAO, linkWhatsApp } from '../content/site-content';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="header">
      <div class="container header__inner">
        <a class="header__brand" href="#inicio" aria-label="YCar Executive — voltar ao início">
          <img
            src="/images/logo-ycar-header.png"
            alt="YCar Executive"
            width="91"
            height="64"
            fetchpriority="high"
          />
        </a>
        <nav class="header__nav" aria-label="Seções do site">
          <a href="#servicos">Serviços</a>
          <a href="#quem-somos">Quem Somos</a>
          <a href="#como-trabalhamos">Como Trabalhamos</a>
          <a href="#frota">Frota</a>
        </nav>
        <a class="btn btn--primary header__cta" [href]="waHref" target="_blank" rel="noopener">
          Reserve Agora!
        </a>
      </div>
    </header>
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
      flex-wrap: wrap;
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
      overflow-x: auto;
      /* Âncoras roláveis no mobile: sem JS, sempre visíveis */
      scrollbar-width: none;
    }

    .header__nav::-webkit-scrollbar {
      display: none;
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
    }

    @media (max-width: 47.99em) {
      .header__inner {
        row-gap: 0;
      }

      .header__nav {
        order: 3;
        flex-basis: 100%;
        margin-inline-start: 0;
      }

      .header__cta {
        margin-inline-start: auto;
      }
    }
  `,
})
export class Header {
  protected readonly waHref = linkWhatsApp(MENSAGEM_PADRAO);
}
