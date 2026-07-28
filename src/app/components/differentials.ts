import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DIFERENCIAIS } from '../content/site-content';
import { Icon, IconName } from './icon';

@Component({
  selector: 'app-differentials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section class="section" id="diferenciais" aria-labelledby="diferenciais-titulo">
      <div class="container">
        <p class="overline">Diferenciais</p>
        <h2 class="section-titulo" id="diferenciais-titulo">
          Por que YCar e não um aplicativo?
        </h2>

        <div class="itens">
          @for (item of diferenciais; track item.titulo) {
            <div class="item">
              <app-icon class="item__icone" [name]="icone(item.icone)" [size]="28" />
              <h3 class="item__titulo">{{ item.titulo }}</h3>
              <p class="item__descricao">{{ item.descricao }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .section-titulo {
      font-size: var(--text-h2);
      margin-block: var(--space-1) var(--space-6);
      max-width: 20ch;
    }

    .itens {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-4);
    }

    .item {
      display: grid;
      gap: var(--space-1);
      align-content: start;
      padding-block-start: var(--space-3);
      border-block-start: 1px solid rgba(201, 162, 39, 0.4);
    }

    .item__icone {
      color: var(--color-accent);
      margin-block-end: var(--space-1);
    }

    .item__titulo {
      font-size: 1.125rem;
    }

    .item__descricao {
      font-size: var(--text-small);
      color: var(--color-text-2);
    }

    @media (max-width: 63.99em) {
      .itens {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 39.99em) {
      .itens {
        grid-template-columns: 1fr;
        gap: var(--space-3);
      }
    }
  `,
})
export class Differentials {
  protected readonly diferenciais = DIFERENCIAIS;

  protected icone(nome: string): IconName {
    return nome as IconName;
  }
}
