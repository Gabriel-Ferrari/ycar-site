import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTATO, MARCA, MENU, RESERVA } from '../content/site-content';

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
        <div class="footer__info">
          <p>
            @if (contato().cnpj) {
              <span class="footer__item">CNPJ {{ contato().cnpj }}</span>
              <span class="footer__sep" aria-hidden="true"> · </span>
            }
            <span class="footer__item">{{ contato().cidade }}</span>
          </p>
          <p>
            <span class="footer__item">© {{ ano }} {{ marca.nomeCompleto }}</span>
            <span class="footer__sep" aria-hidden="true"> · </span>
            <span class="footer__item">Todos os direitos reservados.</span>
          </p>
        </div>
        <nav class="footer__nav" aria-label="Links do rodapé">
          @for (item of menu(); track $index) {
            @if (item.externo) {
              <a [href]="item.destino" target="_blank" rel="noopener">{{ item.rotulo }}</a>
            } @else {
              <a [href]="item.destino">{{ item.rotulo }}</a>
            }
          }
          <a href="#reserva">{{ reserva().cta.rotulo }}</a>
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

    /* Computador: dados da empresa numa linha, copyright na outra.
       Celular: um item por linha, sem "·" (quebrando, o ponto sobrava no fim da linha). */
    .footer__info {
      display: grid;
      gap: 0.25rem;
      color: var(--color-text-2);
      font-size: var(--text-small);
    }

    .footer__info p {
      margin: 0;
    }

    .footer__item {
      white-space: nowrap;
    }

    @media (max-width: 47.99em) {
      .footer__item {
        display: block;
      }

      .footer__sep {
        display: none;
      }
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
  protected readonly reserva = RESERVA;
  protected readonly ano = new Date().getFullYear();
}
