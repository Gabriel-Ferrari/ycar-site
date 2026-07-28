import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
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
    }

    .fab:hover {
      background: var(--color-accent-hover);
    }

    .fab:active {
      background: var(--color-accent-press);
    }
  `,
})
export class WhatsappFab {
  protected readonly waHref = linkWhatsApp(MENSAGEM_PADRAO);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // FAB entra depois que o hero sai de cena (transform/opacity via CSS global .fab)
    afterNextRender(() => {
      const fab = this.el.nativeElement.querySelector('.fab');
      const hero = document.getElementById('inicio');
      if (!fab) {
        return;
      }
      if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        fab.classList.add('fab--visivel');
        return;
      }
      const io = new IntersectionObserver(
        (entradas) => fab.classList.toggle('fab--visivel', !entradas[0].isIntersecting),
        { threshold: 0 },
      );
      io.observe(hero);
      this.destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
