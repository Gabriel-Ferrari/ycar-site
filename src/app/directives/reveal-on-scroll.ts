import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

// Observer único compartilhado por todos os elementos revelados (PRD §7)
let observador: IntersectionObserver | null = null;
const acoes = new WeakMap<Element, () => void>();

function obterObservador(): IntersectionObserver {
  observador ??= new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) {
          acoes.get(entrada.target)?.();
          acoes.delete(entrada.target);
          observador!.unobserve(entrada.target);
        }
      }
    },
    { threshold: 0.15 },
  );
  return observador;
}

/**
 * Revela o elemento uma única vez ao entrar no viewport.
 * O elemento deve ter a classe `reveal` (ou `reveal-scale`) no template;
 * o estado oculto só existe sob `html.js` — sem JS nada fica invisível.
 */
@Directive({ selector: '[appReveal]' })
export class RevealOnScroll {
  readonly revealDelay = input(0);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const elemento = this.el.nativeElement;
      const delay = this.revealDelay();
      if (delay > 0) {
        elemento.style.setProperty('--reveal-delay', `${delay}ms`);
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        elemento.classList.add('is-visible');
        return;
      }

      const io = obterObservador();
      acoes.set(elemento, () => elemento.classList.add('is-visible'));
      io.observe(elemento);
      this.destroyRef.onDestroy(() => {
        io.unobserve(elemento);
        acoes.delete(elemento);
      });
    });
  }
}
