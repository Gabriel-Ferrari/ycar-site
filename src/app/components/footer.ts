import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTATO, MARCA, MENU } from '../content/site-content';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="container footer__inner">
        <img
          class="footer__logo"
          src="/images/logo-ycar.webp"
          alt="{{ marca.nomeCompleto }}"
          width="94"
          height="66"
          loading="lazy"
        />
        <p class="footer__info">
          @if (contato.cnpj) {
            CNPJ {{ contato.cnpj }} ·
          }
          {{ contato.cidade }} · © {{ ano }} {{ marca.nomeCompleto }} — Todos os direitos
          reservados
        </p>
        <nav class="footer__nav" aria-label="Links do rodapé">
          @for (item of menu; track item.destino) {
            @if (item.externo) {
              <a [href]="item.destino" target="_blank" rel="noopener">{{ item.rotulo }}</a>
            } @else {
              <a [href]="item.destino">{{ item.rotulo }}</a>
            }
          }
          <a href="#reserva">Reserve Agora!</a>
        </nav>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      border-block-start: 1px solid var(--color-border);
      padding-block: var(--space-4);
    }

    .footer__inner {
      display: flex;
      align-items: center;
      gap: var(--space-2) var(--space-4);
      flex-wrap: wrap;
    }

    .footer__logo {
      block-size: 4rem;
      inline-size: auto;
    }

    .footer__info {
      color: var(--color-text-2);
      font-size: var(--text-small);
    }

    .footer__nav {
      margin-inline-start: auto;
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .footer__nav a {
      color: var(--color-text-2);
      font-size: var(--text-small);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      transition: color var(--duration-fast) var(--ease-out);
    }

    .footer__nav a:hover {
      color: var(--color-text);
    }

    @media (max-width: 47.99em) {
      .footer__nav {
        margin-inline-start: 0;
      }
    }
  `,
})
export class Footer {
  protected readonly marca = MARCA;
  protected readonly menu = MENU;
  protected readonly contato = CONTATO;
  protected readonly ano = new Date().getFullYear();
}
