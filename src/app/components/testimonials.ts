import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DEPOIMENTOS } from '../content/site-content';
import { RevealOnScroll } from '../directives/reveal-on-scroll';

@Component({
  selector: 'app-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScroll],
  template: `
    <!-- Seção some inteira se o array estiver vazio — critério 2.6 do plano -->
    @if (depoimentos.length > 0) {
      <section class="section" id="clientes" aria-labelledby="clientes-titulo">
        <div class="container">
          <p class="overline reveal" appReveal>Clientes</p>
          <h2 class="section-titulo reveal" id="clientes-titulo" appReveal [revealDelay]="80">
            Quem contrata, volta
          </h2>

          <div class="cards">
            @for (depoimento of depoimentos; track depoimento.autor) {
              <figure class="card reveal" appReveal [revealDelay]="$index * 90">
                <span class="card__aspas" aria-hidden="true">“</span>
                <blockquote class="card__citacao">{{ depoimento.citacao }}</blockquote>
                <figcaption class="card__autor">
                  <strong>{{ depoimento.autor }}</strong>
                  <span>{{ depoimento.contexto }}</span>
                </figcaption>
              </figure>
            }
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    .section-titulo {
      font-size: var(--text-h2);
      margin-block: var(--space-1) var(--space-6);
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-3);
    }

    .card {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      margin: 0;
      padding: var(--space-4);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }

    .card__aspas {
      font-family: var(--font-display);
      font-size: 3rem;
      line-height: 0.5;
      color: var(--color-accent);
      padding-block-start: var(--space-2);
    }

    .card__citacao {
      margin: 0;
      color: var(--color-text-2);
      flex-grow: 1;
    }

    .card__autor {
      display: grid;
      gap: 0.125rem;
      font-size: var(--text-small);
    }

    .card__autor span {
      color: var(--color-text-2);
    }

    @media (max-width: 63.99em) {
      .cards {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Testimonials {
  protected readonly depoimentos = DEPOIMENTOS;
}
