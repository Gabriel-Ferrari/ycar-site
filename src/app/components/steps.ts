import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MENSAGEM_PADRAO, PASSOS, linkWhatsApp } from '../content/site-content';
import { RevealOnScroll } from '../directives/reveal-on-scroll';

@Component({
  selector: 'app-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScroll],
  template: `
    <section class="steps section" id="como-trabalhamos" aria-labelledby="steps-titulo">
      <div class="container">
        <p class="overline reveal" appReveal>Como Trabalhamos</p>
        <h2 class="section-titulo reveal" id="steps-titulo" appReveal [revealDelay]="80">
          Da reserva ao destino, sem preocupação
        </h2>

        <ol class="passos">
          @for (passo of passos; track passo.titulo) {
            <li class="passo reveal" appReveal [revealDelay]="$index * 120">
              <span class="passo__numero tabular" aria-hidden="true">
                0{{ $index + 1 }}
              </span>
              <h3 class="passo__titulo">{{ passo.titulo }}</h3>
              <p class="passo__descricao">{{ passo.descricao }}</p>
            </li>
          }
        </ol>

        <a class="btn btn--primary" [href]="ctaHref" target="_blank" rel="noopener">
          Reserve Agora!
        </a>
      </div>
    </section>
  `,
  styles: `
    .steps {
      background: var(--color-surface);
      border-block: 1px solid var(--color-border);
    }

    .section-titulo {
      font-size: var(--text-h2);
      margin-block: var(--space-1) var(--space-6);
    }

    .passos {
      list-style: none;
      padding: 0;
      margin-block: 0 var(--space-6);
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-4);
      counter-reset: passo;
    }

    .passo {
      display: grid;
      gap: var(--space-1);
      align-content: start;
    }

    .passo__numero {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 2.5rem;
      line-height: 1;
      color: var(--color-accent);
      margin-block-end: var(--space-1);
    }

    .passo__titulo {
      font-size: 1.125rem;
    }

    .passo__descricao {
      font-size: var(--text-small);
      color: var(--color-text-2);
    }

    @media (max-width: 63.99em) {
      .passos {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 47.99em) {
      .passos {
        grid-template-columns: 1fr;
        gap: var(--space-3);
      }
    }
  `,
})
export class Steps {
  protected readonly passos = PASSOS;
  protected readonly ctaHref = linkWhatsApp(MENSAGEM_PADRAO);
}
