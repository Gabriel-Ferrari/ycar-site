import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FROTA, FROTA_INTRO } from '../content/site-content';
import { RevealOnScroll } from '../directives/reveal-on-scroll';
import { Icon, IconName } from './icon';

@Component({
  selector: 'app-fleet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RevealOnScroll],
  template: `
    <section class="section section--alt" id="frota" aria-labelledby="frota-titulo">
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
              <img
                class="card__foto"
                [src]="categoria.imagem"
                alt=""
                width="900"
                height="720"
                loading="lazy"
                decoding="async"
              />
              <span class="card__lugares">{{ categoria.lugares }}</span>
              <div class="card__conteudo">
                <app-icon class="card__icone" [name]="icone(categoria.icone)" [size]="32" />
                <h3 class="card__titulo">{{ categoria.nome }}</h3>
                <p class="card__descricao">{{ categoria.descricao }}</p>
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
      min-block-size: 24rem;
      overflow: hidden;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      transition: transform var(--duration-fast) var(--ease-out);
    }

    /* Veículo fica no centro-direita da foto: ancorar à direita e descer a foto tira o carro de baixo do texto */
    .card__foto {
      position: absolute;
      inset: 4rem 0 auto 0;
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
      object-position: right center;
      -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 22%);
      mask-image: linear-gradient(180deg, transparent 0, #000 22%);
      z-index: 0;
      filter: brightness(0.92);
      transition: transform var(--duration-base) var(--ease-out);
    }

    /* Véu escurece a coluna de texto à esquerda e o topo (badge); o veículo à direita fica limpo */
    .card::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      background:
        linear-gradient(
          90deg,
          rgba(5, 5, 5, 0.94) 0%,
          rgba(5, 5, 5, 0.78) 34%,
          rgba(5, 5, 5, 0.25) 62%,
          rgba(5, 5, 5, 0) 82%
        ),
        linear-gradient(180deg, rgba(5, 5, 5, 0.55) 0%, rgba(5, 5, 5, 0) 32%);
    }

    .card__conteudo {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-1);
      inline-size: 64%;
      padding: var(--space-4) 0 var(--space-4) var(--space-4);
    }

    .card__lugares {
      position: absolute;
      inset-block-start: var(--space-3);
      inset-inline-end: var(--space-3);
      z-index: 2;
      font-size: var(--text-overline);
      font-weight: 500;
      letter-spacing: 0.04em;
      color: var(--color-accent);
      background: rgba(5, 5, 5, 0.55);
      border: 1px solid rgba(247, 226, 185, 0.35);
      border-radius: var(--radius-pill);
      padding: 0.25rem 0.75rem;
      white-space: nowrap;
    }

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

    @media (prefers-reduced-motion: reduce) {
      .card:hover .card__foto {
        transform: none;
      }
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
    }

    /* Card órfão em linha própria: coluna de texto à esquerda, foto só no lado direito */
    @media (min-width: 48em) {
      .card:last-child:nth-child(3n + 1) {
        grid-column: 1 / -1;
        min-block-size: 26rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: var(--space-3);
        padding: var(--space-6);
        border-color: rgba(247, 226, 185, 0.35);
      }

      .card:last-child:nth-child(3n + 1) .card__foto {
        inset: 0 0 0 auto;
        inline-size: 68%;
        object-position: right 60%;
        -webkit-mask-image: none;
        mask-image: none;
      }

      /* Badge entra no fluxo abaixo da descrição: no canto direito disputaria com o texto impresso na parede da foto */
      .card:last-child:nth-child(3n + 1) .card__lugares {
        position: relative;
        inset: auto;
        order: 1;
      }

      .card:last-child:nth-child(3n + 1)::before {
        background: linear-gradient(
          90deg,
          var(--color-bg) 32%,
          rgba(5, 5, 5, 0.55) 44%,
          rgba(5, 5, 5, 0) 58%
        );
      }

      .card:last-child:nth-child(3n + 1) .card__conteudo {
        inline-size: min(100%, 26rem);
        padding: 0;
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

      .card__conteudo {
        inline-size: 74%;
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
