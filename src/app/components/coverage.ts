import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AREA_ATENDIMENTO } from '../content/site-content';
import { Icon } from './icon';

@Component({
  selector: 'app-coverage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section class="section" id="area" aria-labelledby="area-titulo">
      <div class="container area">
        <div>
          <p class="overline">Área de atendimento</p>
          <h2 class="section-titulo" id="area-titulo">{{ area.titulo }}</h2>
          <p class="area__descricao">{{ area.descricao }}</p>
        </div>

        <div class="area__listas">
          <div>
            <h3 class="area__subtitulo">Aeroportos</h3>
            <ul class="chips chips--ouro">
              @for (aeroporto of area.aeroportos; track aeroporto) {
                <li>
                  <app-icon name="plane" [size]="16" />
                  {{ aeroporto }}
                </li>
              }
            </ul>
          </div>
          <div>
            <h3 class="area__subtitulo">Regiões</h3>
            <ul class="chips">
              @for (regiao of area.regioes; track regiao) {
                <li>
                  <app-icon name="pin" [size]="16" />
                  {{ regiao }}
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .area {
      display: grid;
      grid-template-columns: 5fr 6fr;
      gap: var(--space-8);
      align-items: start;
    }

    .section-titulo {
      font-size: var(--text-h2);
      margin-block: var(--space-1) var(--space-3);
    }

    .area__descricao {
      color: var(--color-text-2);
      max-width: 50ch;
    }

    .area__listas {
      display: grid;
      gap: var(--space-4);
    }

    .area__subtitulo {
      font-family: var(--font-body);
      font-size: var(--text-small);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-text-2);
      margin-block-end: var(--space-2);
    }

    .chips {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1);
    }

    .chips li {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 44px;
      padding: 0.5rem 1rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-pill);
      background: var(--color-surface);
      font-size: var(--text-small);
    }

    .chips li :first-child {
      color: var(--color-text-2);
    }

    .chips--ouro li {
      border-color: rgba(201, 162, 39, 0.35);
    }

    .chips--ouro li :first-child {
      color: var(--color-accent);
    }

    @media (max-width: 63.99em) {
      .area {
        grid-template-columns: 1fr;
        gap: var(--space-6);
      }
    }
  `,
})
export class Coverage {
  protected readonly area = AREA_ATENDIMENTO;
}
