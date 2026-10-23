import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RESERVA_FORM } from '../content/site-content';

export interface Sugestao {
  principal: string;
  detalhe: string;
  valor: string;
}

/** Propriedades do GeoJSON do Photon que usamos. */
interface LugarPhoton {
  name?: string;
  street?: string;
  housenumber?: string;
  district?: string;
  city?: string;
  state?: string;
  type?: string;
}

/**
 * Photon (photon.komoot.io): geocoder gratuito sobre o OpenStreetMap, sem chave e com CORS
 * aberto — o Nominatim proíbe uso como autocompletar, o Google exige cartão. Uso justo:
 * só busca com 3+ letras, com espera entre teclas e cancelando a busca anterior.
 * Viés para o centro de SP (location_bias_scale baixo traz "Congonhas" → aeroporto, não a
 * cidade de MG) e recorte no Brasil.
 */
const PHOTON = 'https://photon.komoot.io/api/';
const PARAMETROS = {
  // Nomes locais (português): sem isso o Photon segue o idioma do navegador ("Congonhas Airport")
  lang: 'default',
  limit: '8',
  lat: '-23.55',
  lon: '-46.63',
  zoom: '12',
  location_bias_scale: '0.05',
  bbox: '-73.99,-33.75,-34.79,5.27',
};
const MIN_LETRAS = 3;
const ESPERA_MS = 250;
const MAX_SUGESTOES = 5;

/**
 * Campo de texto com sugestões de endereço (padrão ARIA combobox). Continua sendo um input
 * comum com `name`: o formulário lê o valor por FormData, escolhendo sugestão ou não.
 */
@Component({
  selector: 'app-campo-endereco',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="endereco">
      <input
        #campo
        class="campo__controle"
        [id]="campoId()"
        [name]="nome()"
        [placeholder]="placeholder()"
        required
        autocomplete="off"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-expanded]="aberto()"
        [attr.aria-controls]="campoId() + '-lista'"
        [attr.aria-activedescendant]="ativo() >= 0 ? campoId() + '-op-' + ativo() : null"
        (input)="digitou(campo.value)"
        (keydown)="tecla($event)"
        (focus)="focado.set(true)"
        (blur)="focado.set(false)"
      />
      @if (aberto()) {
        <div class="endereco__painel">
          <ul class="endereco__lista" role="listbox" [id]="campoId() + '-lista'">
            @for (sugestao of sugestoes(); track sugestao.valor; let i = $index) {
              <li
                role="option"
                class="endereco__opcao"
                [id]="campoId() + '-op-' + i"
                [attr.aria-selected]="i === ativo()"
                (mousedown)="$event.preventDefault()"
                (click)="escolher(sugestao)"
              >
                <span class="endereco__principal">{{ sugestao.principal }}</span>
                @if (sugestao.detalhe) {
                  <span class="endereco__detalhe">{{ sugestao.detalhe }}</span>
                }
              </li>
            }
          </ul>
          <p class="endereco__credito">{{ credito }}</p>
        </div>
      }
      <p class="sr-only" aria-live="polite">{{ anuncio() }}</p>
    </div>
  `,
  styles: `
    .endereco {
      position: relative;
    }

    .endereco__painel {
      position: absolute;
      inset-inline: 0;
      inset-block-start: calc(100% + 4px);
      z-index: 5;
      background: var(--color-surface);
      border: 1px solid var(--color-accent);
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-card);
      overflow: hidden;
    }

    .endereco__lista {
      list-style: none;
      margin: 0;
      padding: 0.25rem 0;
    }

    .endereco__opcao {
      display: grid;
      gap: 0.125rem;
      padding: 0.625rem 1rem;
      cursor: pointer;
    }

    .endereco__opcao:hover,
    .endereco__opcao[aria-selected='true'] {
      background: rgba(247, 226, 185, 0.1);
    }

    .endereco__principal {
      color: var(--color-text);
    }

    .endereco__detalhe {
      color: var(--color-text-2);
      font-size: var(--text-small);
    }

    .endereco__credito {
      padding: 0.25rem 1rem 0.375rem;
      border-block-start: 1px solid var(--color-border);
      color: var(--color-text-2);
      font-size: 0.6875rem;
      text-align: end;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
  `,
})
export class CampoEndereco {
  readonly campoId = input.required<string>();
  readonly nome = input.required<string>();
  readonly placeholder = input('');

  protected readonly credito = RESERVA_FORM.creditoEnderecos;
  protected readonly sugestoes = signal<Sugestao[]>([]);
  protected readonly ativo = signal(-1);
  protected readonly focado = signal(false);
  protected readonly aberto = computed(() => this.focado() && this.sugestoes().length > 0);
  protected readonly anuncio = computed(() =>
    this.aberto() ? RESERVA_FORM.sugestoesAnuncio(this.sugestoes().length) : '',
  );

  private readonly campo = viewChild.required<ElementRef<HTMLInputElement>>('campo');
  private espera?: ReturnType<typeof setTimeout>;
  private busca?: AbortController;

  protected digitou(termo: string): void {
    clearTimeout(this.espera);
    this.busca?.abort();
    if (termo.trim().length < MIN_LETRAS) {
      this.sugestoes.set([]);
      return;
    }
    this.espera = setTimeout(() => this.buscar(termo), ESPERA_MS);
  }

  protected tecla(evento: KeyboardEvent): void {
    const total = this.sugestoes().length;
    if (!total) return;
    if (evento.key === 'ArrowDown' || evento.key === 'ArrowUp') {
      evento.preventDefault();
      const passo = evento.key === 'ArrowDown' ? 1 : -1;
      this.ativo.update((i) => (i + passo + total) % total);
    } else if (evento.key === 'Enter' && this.aberto() && this.ativo() >= 0) {
      // Enter escolhe a sugestão em vez de enviar o formulário
      evento.preventDefault();
      this.escolher(this.sugestoes()[this.ativo()]);
    } else if (evento.key === 'Escape' && this.aberto()) {
      this.sugestoes.set([]);
    }
  }

  protected escolher(sugestao: Sugestao): void {
    this.campo().nativeElement.value = sugestao.valor;
    this.sugestoes.set([]);
    this.ativo.set(-1);
  }

  private async buscar(termo: string): Promise<void> {
    this.busca = new AbortController();
    const url = `${PHOTON}?${new URLSearchParams({ q: termo, ...PARAMETROS })}`;
    try {
      const resposta = await fetch(url, { signal: this.busca.signal });
      const { features } = (await resposta.json()) as { features: { properties: LugarPhoton }[] };
      this.sugestoes.set(formatarSugestoes(features.map((f) => f.properties), termo));
      this.ativo.set(-1);
    } catch {
      // Sem internet, busca cancelada ou serviço fora: o campo segue funcionando sem sugestões
    }
  }
}

/**
 * Lugar do OpenStreetMap → texto legível. Rua sem número herda o número digitado
 * ("rua oscar freire 500" → "Rua Oscar Freire, 500"); trechos repetidos da mesma rua somem.
 */
export function formatarSugestoes(lugares: LugarPhoton[], termo: string): Sugestao[] {
  const numeroDigitado = termo.match(/\b(\d{1,5}[a-z]?)\b/i)?.[1];
  const vistas = new Set<string>();
  const sugestoes: Sugestao[] = [];

  for (const lugar of lugares) {
    const rua = lugar.street ?? (lugar.type === 'street' ? lugar.name : undefined);
    const numero = lugar.housenumber ?? (lugar.type === 'street' ? numeroDigitado : undefined);
    const endereco = rua && [rua, numero].filter(Boolean).join(', ');
    const local = lugar.name && lugar.name !== rua ? lugar.name : undefined;
    const principal = local ?? endereco ?? lugar.city;
    if (!principal) continue;

    const estado = lugar.state && lugar.state !== 'São Paulo' ? lugar.state : undefined;
    const detalhe = [local && endereco, lugar.district, lugar.city, estado]
      .filter((parte) => parte && parte !== principal)
      .join(', ');
    const valor = detalhe ? `${principal} - ${detalhe}` : principal;

    if (vistas.has(valor)) continue;
    vistas.add(valor);
    sugestoes.push({ principal, detalhe, valor });
    if (sugestoes.length === MAX_SUGESTOES) break;
  }
  return sugestoes;
}
