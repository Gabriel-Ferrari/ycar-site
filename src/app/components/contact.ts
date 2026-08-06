import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTATO, RESERVA, linkWhatsApp } from '../content/site-content';
import { RevealOnScroll } from '../directives/reveal-on-scroll';
import { BookingForm } from './booking-form';
import { Icon } from './icon';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RevealOnScroll, BookingForm],
  template: `
    <section class="contato section" id="reserva" aria-labelledby="contato-titulo">
      <div class="container contato__inner">
        <div class="contato__intro reveal" appReveal>
          <p class="overline">Reserva</p>
          <h2 class="section-titulo" id="contato-titulo">{{ reserva.titulo }}</h2>
          <p class="contato__sub">{{ reserva.descricao }}</p>
        </div>

        <app-booking-form class="contato__form reveal" appReveal />

        <ul class="contato__canais reveal" appReveal>
          <li>
            <a [href]="waHref" target="_blank" rel="noopener">
              <app-icon name="whatsapp" [size]="20" />
              {{ contato.whatsappExibicao }}
            </a>
          </li>
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
    }

    .contato__intro {
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
      max-width: 52ch;
      margin-block-end: var(--space-6);
    }

    .contato__form {
      inline-size: min(100%, 44rem);
      margin-block-end: var(--space-6);
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
  `,
})
export class Contact {
  protected readonly contato = CONTATO;
  protected readonly reserva = RESERVA;
  protected readonly waHref = linkWhatsApp(RESERVA.cta.mensagem);
}
