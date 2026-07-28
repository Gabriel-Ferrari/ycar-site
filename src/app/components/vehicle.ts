import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MENSAGEM_PADRAO, VEICULOS, linkWhatsApp } from '../content/site-content';
import { RevealOnScroll } from '../directives/reveal-on-scroll';

@Component({
  selector: 'app-vehicle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScroll],
  template: `
    <section class="section" id="veiculo" aria-labelledby="veiculo-titulo">
      <div class="container veiculo">
        <div class="veiculo__texto reveal" appReveal>
          <p class="overline">Veículo</p>
          <h2 class="section-titulo reveal" id="veiculo-titulo" appReveal [revealDelay]="80">
            O carro que chega na porta
          </h2>
          @for (veiculo of veiculos; track veiculo.nome) {
            <h3 class="veiculo__nome">{{ veiculo.nome }} {{ veiculo.ano }}</h3>
            <p class="veiculo__descricao">{{ veiculo.descricao }}</p>
            <ul class="veiculo__destaques">
              @for (destaque of veiculo.destaques; track destaque) {
                <li>{{ destaque }}</li>
              }
            </ul>
          }
          <a class="btn btn--primary" [href]="ctaHref" target="_blank" rel="noopener">
            Reservar no WhatsApp
          </a>
        </div>

        <div class="veiculo__galeria" role="group" aria-label="Fotos do veículo">
          <!-- PROVISÓRIO: placeholders nas proporções finais (4:3) — Etapa 5 troca por NgOptimizedImage -->
          @for (foto of fotos; track foto.src) {
            <div
              class="veiculo__foto reveal-scale"
              [class.veiculo__foto--principal]="$first"
              appReveal
              [revealDelay]="$index * 120"
              role="img"
              [attr.aria-label]="foto.alt + ' (foto em breve)'"
            ></div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .veiculo {
      display: grid;
      grid-template-columns: 5fr 6fr;
      gap: var(--space-8);
      align-items: center;
    }

    .section-titulo {
      font-size: var(--text-h2);
      margin-block: var(--space-1) var(--space-3);
    }

    .veiculo__nome {
      font-size: var(--text-h3);
      color: var(--color-accent);
      margin-block-end: var(--space-2);
    }

    .veiculo__descricao {
      color: var(--color-text-2);
      margin-block-end: var(--space-3);
    }

    .veiculo__destaques {
      list-style: none;
      padding: 0;
      margin-block: 0 var(--space-4);
      display: grid;
      gap: var(--space-1);
    }

    .veiculo__destaques li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .veiculo__destaques li::before {
      content: '';
      inline-size: 6px;
      block-size: 6px;
      border-radius: 50%;
      background: var(--color-accent);
      flex-shrink: 0;
    }

    .veiculo__galeria {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-2);
    }

    .veiculo__foto {
      aspect-ratio: 4 / 3;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background:
        radial-gradient(ellipse at 30% 20%, rgba(201, 162, 39, 0.06), transparent 60%),
        linear-gradient(150deg, var(--color-surface-2) 0%, var(--color-surface) 100%);
    }

    .veiculo__foto--principal {
      grid-column: 1 / -1;
      aspect-ratio: 16 / 10;
    }

    @media (max-width: 63.99em) {
      .veiculo {
        grid-template-columns: 1fr;
        gap: var(--space-6);
      }
    }
  `,
})
export class Vehicle {
  protected readonly veiculos = VEICULOS;
  protected readonly fotos = VEICULOS[0].fotos;
  protected readonly ctaHref = linkWhatsApp(MENSAGEM_PADRAO);
}
