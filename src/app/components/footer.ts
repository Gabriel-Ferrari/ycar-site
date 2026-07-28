import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTATO, MARCA } from '../content/site-content';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="container footer__inner">
        <p class="footer__marca">{{ marca.nomeCompleto }}</p>
        <p class="footer__info">
          @if (contato.cnpj) {
            CNPJ {{ contato.cnpj }} ·
          }
          {{ contato.cidade }} · © {{ ano }}
        </p>
        <nav class="footer__nav" aria-label="Links do rodapé">
          <a href="#servicos">Serviços</a>
          <a href="#veiculo">Veículo</a>
          <a href="#contato">Contato</a>
          <a [href]="contato.instagramUrl" target="_blank" rel="noopener">Instagram</a>
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

    .footer__marca {
      font-family: var(--font-display);
      font-weight: 600;
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
  protected readonly contato = CONTATO;
  protected readonly ano = new Date().getFullYear();
}
