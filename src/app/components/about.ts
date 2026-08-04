import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QUEM_SOMOS, RESERVA, linkWhatsApp } from '../content/site-content';
import { RevealOnScroll } from '../directives/reveal-on-scroll';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScroll],
  template: `
    <section class="sobre section" id="quem-somos" aria-labelledby="sobre-titulo">
      <div class="container sobre__inner">
        <div class="sobre__texto">
          <p class="overline reveal" appReveal>Quem Somos</p>
          <h2 class="section-titulo reveal" id="sobre-titulo" appReveal [revealDelay]="80">
            {{ quemSomos.titulo }}
          </h2>
          @for (paragrafo of quemSomos.paragrafos; track $index) {
            <p class="sobre__paragrafo reveal" appReveal [revealDelay]="120 + $index * 60">
              {{ paragrafo }}
            </p>
          }
        </div>
        <aside class="sobre__destaque reveal" appReveal [revealDelay]="200">
          <img
            class="sobre__foto"
            src="/images/quem-somos.webp"
            alt="Profissional de terno escuro com braços cruzados e olhar confiante"
            width="800"
            height="1000"
            loading="lazy"
          />
          <p class="sobre__tagline">{{ quemSomos.tagline }}</p>
          <p class="sobre__chamada">{{ quemSomos.chamada }}</p>
          <a class="btn btn--primary" [href]="ctaHref" target="_blank" rel="noopener">
            {{ reserva.cta.rotulo }}
          </a>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .sobre {
      background: var(--color-surface);
      border-block: 1px solid var(--color-border);
    }

    .sobre__inner {
      display: grid;
      grid-template-columns: 7fr 5fr;
      gap: var(--space-8);
      align-items: center;
    }

    .section-titulo {
      font-size: var(--text-h2);
      margin-block: var(--space-1) var(--space-3);
    }

    .sobre__paragrafo {
      color: var(--color-text-2);
      max-width: 62ch;
      margin-block-end: var(--space-2);
    }

    .sobre__destaque {
      display: grid;
      justify-items: center;
      text-align: center;
      gap: var(--space-2);
      padding: var(--space-6) var(--space-4);
      background: var(--color-surface-2);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }

    .sobre__foto {
      inline-size: 100%;
      block-size: auto;
      border-radius: var(--radius-sm);
      margin-block-end: var(--space-1);
    }

    .sobre__tagline {
      font-family: var(--font-display);
      font-size: var(--text-h3);
      color: var(--color-accent);
    }

    .sobre__chamada {
      color: var(--color-text-2);
      font-size: var(--text-small);
      margin-block-end: var(--space-2);
    }

    @media (max-width: 63.99em) {
      .sobre__inner {
        grid-template-columns: 1fr;
        gap: var(--space-6);
      }
    }
  `,
})
export class About {
  protected readonly quemSomos = QUEM_SOMOS;
  protected readonly reserva = RESERVA;
  protected readonly ctaHref = linkWhatsApp(RESERVA.cta.mensagem);
}
