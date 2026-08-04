import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FROTA, FROTA_INTRO } from '../content/site-content';
import { RevealOnScroll } from '../directives/reveal-on-scroll';
import { Icon, IconName } from './icon';

@Component({
  selector: 'app-fleet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RevealOnScroll],
  template: `
    <section class="section" id="frota" aria-labelledby="frota-titulo">
      <div class="container">
        <p class="overline reveal" appReveal>Frota</p>
        <h2 class="section-titulo reveal" id="frota-titulo" appReveal [revealDelay]="80">
          {{ intro.titulo }}
        </h2>
        <p class="section-sub reveal" appReveal [revealDelay]="160">
          {{ intro.descricao }}
        </p>

        <div class="cards">
          @for (categoria of frota; track categoria.nome) {
            <article class="card reveal" appReveal [revealDelay]="($index % 3) * 90">
              <div class="card__topo">
                <app-icon class="card__icone" [name]="icone(categoria.icone)" [size]="32" />
                <span class="card__lugares">{{ categoria.lugares }}</span>
              </div>
              <h3 class="card__titulo">{{ categoria.nome }}</h3>
              <p class="card__descricao">{{ categoria.descricao }}</p>
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
      max-width: 78ch;
      margin-block-end: var(--space-6);
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-3);
    }

    .card {
      position: relative;
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

    .card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-card);
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--duration-fast) var(--ease-out);
    }

    .card:hover {
      transform: translateY(-4px);
      background: var(--color-surface-2);
    }

    .card:hover::after {
      opacity: 1;
    }

    .card__topo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      inline-size: 100%;
    }

    .card__icone {
      color: var(--color-accent);
    }

    .card__lugares {
      font-size: var(--text-overline);
      font-weight: 500;
      letter-spacing: 0.04em;
      color: var(--color-accent);
      border: 1px solid rgba(247, 226, 185, 0.35);
      border-radius: var(--radius-pill);
      padding: 0.25rem 0.75rem;
      white-space: nowrap;
    }

    .card__titulo {
      font-size: var(--text-h3);
    }

    .card__descricao {
      color: var(--color-text-2);
    }

    /* Último card órfão em linha própria → ocupa a largura toda, centralizado */
    @media (min-width: 48em) {
      .card:last-child:nth-child(3n + 1) {
        grid-column: 1 / -1;
        align-items: center;
        text-align: center;
        border-color: rgba(247, 226, 185, 0.35);
      }

      .card:last-child:nth-child(3n + 1) .card__topo {
        inline-size: auto;
        gap: var(--space-2);
      }

      .card:last-child:nth-child(3n + 1) .card__descricao {
        max-width: 60ch;
      }
    }

    @media (max-width: 63.99em) {
      .cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 47.99em) {
      .cards {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Fleet {
  protected readonly frota = FROTA;
  protected readonly intro = FROTA_INTRO;

  protected icone(nome: string): IconName {
    return nome as IconName;
  }
}
