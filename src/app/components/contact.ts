import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTATO, MENSAGEM_PADRAO, linkWhatsApp } from '../content/site-content';
import { RevealOnScroll } from '../directives/reveal-on-scroll';
import { Icon } from './icon';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RevealOnScroll],
  template: `
    <section class="contato section" id="contato" aria-labelledby="contato-titulo">
      <div class="container contato__inner reveal" appReveal>
        <p class="overline">Contato</p>
        <h2 class="section-titulo" id="contato-titulo">Fale com a YCar</h2>
        <p class="contato__sub">Resposta direta de quem dirige.</p>

        <a class="btn btn--primary contato__whatsapp" [href]="waHref" target="_blank" rel="noopener">
          <app-icon name="whatsapp" [size]="22" />
          Chamar no WhatsApp — {{ contato.whatsappExibicao }}
        </a>

        <ul class="contato__canais">
          <li>
            <a [href]="contato.instagramUrl" target="_blank" rel="noopener">
              <app-icon name="instagram" [size]="20" />
              {{ contato.instagramUsuario }}
            </a>
          </li>
          @if (contato.email) {
            <li>
              <a [href]="'mailto:' + contato.email">
                <app-icon name="mail" [size]="20" />
                {{ contato.email }}
              </a>
            </li>
          }
          <li class="contato__horario">
            <app-icon name="clock" [size]="20" />
            {{ contato.horario }}
          </li>
        </ul>
      </div>
    </section>
  `,
  styles: `
    .contato {
      background: var(--color-surface);
      border-block-start: 1px solid var(--color-border);
    }

    .contato__inner {
      display: grid;
      justify-items: center;
      text-align: center;
    }

    .section-titulo {
      font-size: var(--text-h2);
      margin-block: var(--space-1) var(--space-2);
    }

    /* Título centralizado → linha decorativa também centralizada */
    .section-titulo::after {
      inset-inline: 0;
      margin-inline: auto;
    }

    .contato__sub {
      color: var(--color-text-2);
      margin-block-end: var(--space-4);
    }

    .contato__whatsapp {
      font-size: var(--text-body-lg);
      padding: 1rem 2rem;
      margin-block-end: var(--space-4);
    }

    .contato__canais {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--space-2) var(--space-4);
    }

    .contato__canais a {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 44px;
      color: var(--color-text-2);
      text-decoration: none;
      transition: color var(--duration-fast) var(--ease-out);
    }

    .contato__canais a:hover {
      color: var(--color-text);
    }

    .contato__canais app-icon {
      color: var(--color-accent);
    }

    .contato__horario {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 44px;
      color: var(--color-text-2);
    }

    @media (max-width: 47.99em) {
      .contato__whatsapp {
        inline-size: 100%;
      }
    }
  `,
})
export class Contact {
  protected readonly contato = CONTATO;
  protected readonly waHref = linkWhatsApp(MENSAGEM_PADRAO);
}
