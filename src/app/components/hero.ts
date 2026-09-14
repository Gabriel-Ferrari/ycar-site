import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HERO, RESERVA } from '../content/site-content';
import { Parallax } from '../directives/parallax';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Parallax],
  template: `
    <section class="hero" id="inicio" aria-labelledby="hero-titulo">
      <div class="hero__media" appParallax aria-hidden="true"></div>
      <div class="container hero__content">
        <p class="overline hero-entrada">{{ hero.overline }}</p>
        <h1 class="hero__titulo" id="hero-titulo" [attr.aria-label]="hero.titulo">
          @for (palavra of palavras; track $index) {
            <span class="hero-palavra" aria-hidden="true"
              ><span
                class="hero-palavra__inner"
                [style.--palavra-delay]="80 + $index * 70 + 'ms'"
                >{{ palavra }}</span
              ></span
            >{{ ' ' }}
          }
        </h1>
        <p class="hero__sub hero-entrada" [style.animation-delay]="'420ms'">
          {{ hero.subtitulo }}
        </p>
        <div class="hero__acoes hero-entrada" [style.animation-delay]="'540ms'">
          <a class="btn btn--primary" [href]="ctaHref" target="_blank" rel="noopener">
            {{ hero.ctaPrimario.rotulo }}
          </a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero {
      position: relative;
      min-height: 100svh;
      display: flex;
      align-items: center;
      overflow: hidden;
      /* Espaço para o header fixo */
      padding-block: 7rem var(--space-8);
    }

    .hero__media {
      position: absolute;
      inset: 0;
      /* Parallax move este bloco; 115% de altura evita expor borda */
      block-size: 115%;
      will-change: transform;
      background:
        radial-gradient(ellipse at 78% 18%, rgba(247, 226, 185, 0.08), transparent 55%),
        url('/images/principal-horizontal.webp') 70% center / cover no-repeat,
        #050505;
    }

    /* Foto clara (interior bege): véu lateral escurece o lado do texto */
    .hero__media::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(
          90deg,
          rgba(5, 5, 5, 0.92) 0%,
          rgba(5, 5, 5, 0.78) 38%,
          rgba(5, 5, 5, 0.3) 70%,
          rgba(5, 5, 5, 0.12) 100%
        ),
        var(--overlay-hero);
    }

    @media (max-width: 47.99em) {
      .hero__media {
        background: url('/images/principal-vertical.webp') center top / cover no-repeat, #050505;
      }

      .hero__media::after {
        background: linear-gradient(
          180deg,
          rgba(5, 5, 5, 0.55) 0%,
          rgba(5, 5, 5, 0.8) 45%,
          rgba(5, 5, 5, 0.94) 100%
        );
      }
    }

    .hero__content {
      position: relative;
    }

    .hero__titulo {
      font-size: var(--text-hero);
      max-width: 15ch;
      margin-block: var(--space-2) var(--space-3);
    }

    .hero__sub {
      font-size: var(--text-body-lg);
      color: var(--color-text-2);
      max-width: 52ch;
      margin-block-end: var(--space-4);
    }

    .hero__acoes {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }
  `,
})
export class Hero {
  protected readonly hero = HERO;
  protected readonly ctaHref = RESERVA.plataformaUrl;
  protected readonly palavras = HERO.titulo.split(' ');
}
