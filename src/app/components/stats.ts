import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ESTATISTICAS } from '../content/site-content';
import { CountUp } from '../directives/count-up';
import { RevealOnScroll } from '../directives/reveal-on-scroll';

@Component({
  selector: 'app-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CountUp, RevealOnScroll],
  template: `
    <section class="stats" aria-label="Números da YCar">
      <div class="container stats__grid">
        @for (item of estatisticas; track item.rotulo) {
          <div class="stats__item reveal" appReveal [revealDelay]="$index * 90">
            <!-- Valor final prerenderizado; count-up anima quando 50% visível -->
            <span
              class="stats__valor tabular"
              [appCountUp]="item.valor"
              [countUpSufixo]="item.sufixo ?? ''"
            >
              {{ item.valor }}{{ item.sufixo ?? '' }}
            </span>
            <span class="stats__rotulo">{{ item.rotulo }}</span>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .stats {
      background: var(--color-surface);
      border-block: 1px solid var(--color-border);
      padding-block: var(--space-6);
    }

    .stats__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-4);
    }

    .stats__item {
      display: grid;
      gap: 0.25rem;
      justify-items: center;
      text-align: center;
    }

    .stats__valor {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      line-height: 1;
      color: var(--color-accent);
    }

    .stats__rotulo {
      font-size: var(--text-small);
      color: var(--color-text-2);
      max-width: 24ch;
    }

    @media (max-width: 47.99em) {
      .stats__grid {
        grid-template-columns: 1fr;
        gap: var(--space-3);
      }
    }
  `,
})
export class Stats {
  protected readonly estatisticas = ESTATISTICAS;
}
