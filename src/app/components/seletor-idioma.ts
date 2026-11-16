import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IDIOMA, IDIOMAS, Idioma, UI } from '../content/site-content';

/**
 * PT · EN · ES. O link passa por /?idioma=xx: o Worker grava a escolha num cookie
 * (a detecção automática não desfaz a troca) e redireciona para a raiz do idioma.
 */
@Component({
  selector: 'app-seletor-idioma',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="idiomas" [attr.aria-label]="rotulo">
      @for (i of idiomas; track i.codigo) {
        <a
          [href]="'/?idioma=' + i.codigo"
          [attr.hreflang]="i.hreflang"
          [attr.lang]="i.hreflang"
          [attr.aria-label]="i.nome"
          [attr.aria-current]="i.codigo === atual ? 'true' : null"
          (click)="trocar($event, i.codigo)"
          >{{ i.rotulo }}</a
        >
      }
    </nav>
  `,
  styles: `
    .idiomas {
      display: flex;
    }

    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-block-size: 44px;
      min-inline-size: 2rem;
      font-size: var(--text-overline);
      font-weight: 500;
      letter-spacing: 0.08em;
      color: var(--color-text-2);
      text-decoration: none;
      transition: color var(--duration-fast) var(--ease-out);
    }

    a:hover {
      color: var(--color-text);
    }

    a[aria-current] {
      color: var(--color-accent);
      text-decoration: underline;
      text-underline-offset: 0.45em;
    }
  `,
})
export class SeletorIdioma {
  protected readonly idiomas = IDIOMAS;
  protected readonly atual = IDIOMA;
  protected readonly rotulo = UI.cabecalho.idioma;

  // O servidor não vê o #hash: leva a seção atual junto (o redirect preserva o fragmento)
  protected trocar(evento: MouseEvent, codigo: Idioma): void {
    if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey) return;
    evento.preventDefault();
    location.assign(`/?idioma=${codigo}${location.hash}`);
  }
}
