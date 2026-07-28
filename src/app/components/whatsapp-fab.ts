import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MENSAGEM_PADRAO, linkWhatsApp } from '../content/site-content';
import { Icon } from './icon';

@Component({
  selector: 'app-whatsapp-fab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <a
      class="fab"
      [href]="waHref"
      target="_blank"
      rel="noopener"
      aria-label="Abrir conversa no WhatsApp"
    >
      <app-icon name="whatsapp" [size]="28" />
    </a>
  `,
  styles: `
    .fab {
      position: fixed;
      inset-block-end: 1.25rem;
      inset-inline-end: 1.25rem;
      z-index: 90;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 56px;
      block-size: 56px;
      border-radius: var(--radius-pill);
      background: var(--color-accent);
      color: var(--color-bg);
      box-shadow: var(--shadow-cta);
      transition:
        background-color var(--duration-fast) var(--ease-out),
        transform var(--duration-fast) var(--ease-out);
    }

    .fab:hover {
      background: var(--color-accent-hover);
      transform: translateY(-2px);
    }

    .fab:active {
      background: var(--color-accent-press);
      transform: translateY(0);
    }
  `,
})
export class WhatsappFab {
  protected readonly waHref = linkWhatsApp(MENSAGEM_PADRAO);
}
