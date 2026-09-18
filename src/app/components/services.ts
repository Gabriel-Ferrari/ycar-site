import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SERVICOS, SERVICOS_INTRO, SIZES_CARD, srcsetCard } from '../content/site-content';
import { RevealOnScroll } from '../directives/reveal-on-scroll';
import { Icon, IconName } from './icon';

@Component({
  selector: 'app-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RevealOnScroll],
  template: `
    <section class="section" id="servicos" aria-labelledby="servicos-titulo">
      <div class="container">
        <p class="overline reveal" appReveal>Serviços</p>
        <h2 class="section-titulo reveal" id="servicos-titulo" appReveal [revealDelay]="80">
          {{ intro.titulo }}
        </h2>
        <p class="section-sub reveal" appReveal [revealDelay]="160">
          {{ intro.descricao }}
        </p>

        <div class="cards">
          @for (servico of servicos; track servico.titulo) {
            <article class="card reveal" appReveal [revealDelay]="($index % 3) * 90">
              <img
                class="card__foto"
                [src]="servico.imagem"
                [srcset]="servico.srcset"
                [sizes]="sizes"
                [style.object-position]="servico.foco"
                alt=""
                width="900"
                height="1350"
                loading="lazy"
                decoding="async"
              />
              <div class="card__conteudo">
                <app-icon class="card__icone" [name]="icone(servico.icone)" [size]="32" />
                <h3 class="card__titulo">{{ servico.titulo }}</h3>
                <p class="card__descricao">{{ servico.descricao }}</p>
              </div>
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
      justify-content: flex-start;
      min-block-size: 24rem;
      overflow: hidden;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      transition: transform var(--duration-fast) var(--ease-out);
    }

    .card__foto {
      position: absolute;
      inset: 0;
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
      z-index: 0;
      filter: brightness(0.92);
      transition: transform var(--duration-base) var(--ease-out);
    }

    /* Véu escuro garante contraste AA do texto sobre qualquer região da foto */
    .card::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(
        165deg,
        rgba(5, 5, 5, 0.96) 0%,
        rgba(5, 5, 5, 0.86) 26%,
        rgba(5, 5, 5, 0.45) 50%,
        rgba(5, 5, 5, 0.05) 72%
      );
    }

    .card__conteudo {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-1);
      padding: var(--space-6) var(--space-4) var(--space-4);
    }

    /* Elevação via pseudo-elemento com opacity — box-shadow nunca é animada */
    .card::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 3;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-card);
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--duration-fast) var(--ease-out);
    }

    .card:hover {
      transform: translateY(-4px);
    }

    .card:hover .card__foto {
      transform: scale(1.06);
    }

    .card:hover::after {
      opacity: 1;
    }

    .card__icone {
      color: var(--color-accent);
      margin-block-end: var(--space-1);
    }

    .card__titulo {
      font-size: var(--text-h3);
    }

    .card__descricao {
      color: var(--color-text-2);
      font-size: var(--text-small);
      max-width: 32ch;
    }

    @media (prefers-reduced-motion: reduce) {
      .card:hover .card__foto {
        transform: none;
      }
    }

    @media (max-width: 63.99em) {
      .cards {
        grid-template-columns: repeat(2, 1fr);
      }

      /* Card órfão na última linha ocupa a largura toda */
      .card:last-child:nth-child(odd) {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 47.99em) {
      .cards {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Services {
  protected readonly servicos = SERVICOS.map((servico) => ({
    ...servico,
    srcset: srcsetCard(servico.imagem),
  }));
  protected readonly intro = SERVICOS_INTRO;
  protected readonly sizes = SIZES_CARD;

  protected icone(nome: string): IconName {
    return nome as IconName;
  }
}
