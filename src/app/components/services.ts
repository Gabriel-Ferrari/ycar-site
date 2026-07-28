import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SERVICOS, linkWhatsApp } from '../content/site-content';
import { Icon, IconName } from './icon';

@Component({
  selector: 'app-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section class="section" id="servicos" aria-labelledby="servicos-titulo">
      <div class="container">
        <p class="overline">Portfólio</p>
        <h2 class="section-titulo" id="servicos-titulo">Serviços</h2>
        <p class="section-sub">Do transfer pontual ao contrato mensal — sempre com nota fiscal.</p>

        <div class="cards">
          @for (servico of servicos; track servico.titulo) {
            <article class="card" [class.card--destaque]="servico.destaque">
              <app-icon class="card__icone" [name]="icone(servico.icone)" [size]="32" />
              <h3 class="card__titulo">{{ servico.titulo }}</h3>
              <p class="card__descricao">{{ servico.descricao }}</p>
              @if (servico.cta; as cta) {
                <a class="card__cta" [href]="linkWhatsApp(cta.mensagem)" target="_blank" rel="noopener">
                  {{ cta.rotulo }} <span aria-hidden="true">→</span>
                </a>
              }
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .section-titulo {
      font-size: var(--text-h2);
      margin-block: var(--space-1) var(--space-2);
    }

    .section-sub {
      color: var(--color-text-2);
      max-width: 50ch;
      margin-block-end: var(--space-6);
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-3);
    }

    .card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-2);
      padding: var(--space-4);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      transition:
        transform var(--duration-fast) var(--ease-out),
        background-color var(--duration-fast) var(--ease-out);
    }

    .card:hover {
      transform: translateY(-4px);
      background: var(--color-surface-2);
    }

    .card--destaque {
      grid-column: 1 / -1;
      border-color: rgba(201, 162, 39, 0.35);
    }

    .card__icone {
      color: var(--color-accent);
    }

    .card__titulo {
      font-size: var(--text-h3);
    }

    .card__descricao {
      color: var(--color-text-2);
      max-width: 60ch;
    }

    .card__cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 44px;
      margin-block-start: auto;
      color: var(--color-accent);
      font-weight: 500;
      text-decoration: none;
    }

    .card__cta:hover {
      color: var(--color-accent-hover);
      text-decoration: underline;
      text-underline-offset: 4px;
    }

    @media (max-width: 47.99em) {
      .cards {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Services {
  protected readonly servicos = SERVICOS;
  protected readonly linkWhatsApp = linkWhatsApp;

  protected icone(nome: string): IconName {
    return nome as IconName;
  }
}
