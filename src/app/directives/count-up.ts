import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Anima o número de 0 até o alvo quando 50% visível, uma única vez.
 * O valor final já vem prerenderizado no HTML (SEO e no-JS);
 * sob prefers-reduced-motion o texto nem é tocado (PRD §7).
 */
@Directive({ selector: '[appCountUp]' })
export class CountUp {
  readonly appCountUp = input.required<number>();
  readonly countUpSufixo = input('');

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const elemento = this.el.nativeElement;

      const animar = () => {
        const alvo = this.appCountUp();
        const sufixo = this.countUpSufixo();
        const inicio = performance.now();
        const duracao = 1200;

        const passo = (agora: number) => {
          const progresso = Math.min((agora - inicio) / duracao, 1);
          const suavizado = 1 - Math.pow(1 - progresso, 3);
          elemento.textContent = `${Math.round(suavizado * alvo)}${sufixo}`;
          if (progresso < 1) {
            requestAnimationFrame(passo);
          }
        };

        requestAnimationFrame(passo);
      };

      const io = new IntersectionObserver(
        (entradas) => {
          if (entradas[0].isIntersecting) {
            io.disconnect();
            animar();
          }
        },
        { threshold: 0.5 },
      );

      io.observe(elemento);
      this.destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
