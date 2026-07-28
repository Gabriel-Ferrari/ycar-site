import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Parallax sutil: translate3d via rAF, listener passivo, só `transform`.
 * Desligado sob prefers-reduced-motion (PRD §7).
 */
@Directive({ selector: '[appParallax]' })
export class Parallax {
  /** Fator de deslocamento em relação ao scroll (0.15 = 15%). */
  readonly parallaxFator = input(0.15);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const elemento = this.el.nativeElement;
      let agendado = false;

      const atualizar = () => {
        agendado = false;
        // Clamp na altura do contêiner: fora do hero não há nada para deslocar
        const limite = elemento.parentElement?.offsetHeight ?? window.innerHeight;
        const deslocamento = Math.min(window.scrollY, limite) * this.parallaxFator();
        elemento.style.transform = `translate3d(0, ${deslocamento}px, 0)`;
      };

      const aoRolar = () => {
        if (!agendado) {
          agendado = true;
          requestAnimationFrame(atualizar);
        }
      };

      window.addEventListener('scroll', aoRolar, { passive: true });
      aoRolar();
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', aoRolar));
    });
  }
}
