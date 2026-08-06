import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  WritableSignal,
} from '@angular/core';
import { linkWhatsApp, RESERVA_FORM, TipoServicoId } from '../content/site-content';
import { Icon, IconName } from './icon';

@Component({
  selector: 'app-booking-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <form class="reserva-form" (submit)="enviar($event)" novalidate>
      <fieldset class="reserva-form__grupo">
        <legend class="reserva-form__titulo-grupo">
          <app-icon name="car" [size]="20" />
          {{ form.tipoLegenda }}
        </legend>
        <div class="reserva-form__segmentos">
          @for (t of form.tiposServico; track t.id) {
            <label class="segmento" [class.segmento--ativo]="tipo() === t.id">
              <input
                class="sr-only"
                type="radio"
                name="tipo"
                [checked]="tipo() === t.id"
                (change)="tipo.set(t.id)"
              />
              <app-icon [name]="icone(t.icone)" [size]="18" />
              {{ t.rotulo }}
            </label>
          }
        </div>
      </fieldset>

      <fieldset class="reserva-form__grupo">
        <legend class="reserva-form__titulo-grupo">
          <app-icon name="pin" [size]="20" />
          {{ form.grupos.trajeto }}
        </legend>

        <div class="campo">
          <label class="campo__rotulo" for="reserva-embarque">
            {{ form.campos.embarque.rotulo }} *
          </label>
          <input
            id="reserva-embarque"
            name="embarque"
            type="text"
            required
            [value]="embarque()"
            (input)="atualizar(embarque, $event)"
            [placeholder]="form.campos.embarque.placeholder"
            [class.campo__controle--erro]="faltou(embarque())"
            [attr.aria-invalid]="faltou(embarque()) || null"
            [attr.aria-describedby]="faltou(embarque()) ? 'reserva-embarque-erro' : null"
            autocomplete="street-address"
            class="campo__controle"
          />
          @if (faltou(embarque())) {
            <p class="campo__erro" id="reserva-embarque-erro">{{ form.erroObrigatorio }}</p>
          }
        </div>

        @if (tipo() !== 'disposicao') {
          <div class="campo">
            <label class="campo__rotulo" for="reserva-destino">
              {{ form.campos.destino.rotulo }} *
            </label>
            <input
              id="reserva-destino"
              name="destino"
              type="text"
              required
              [value]="destino()"
              (input)="atualizar(destino, $event)"
              [placeholder]="form.campos.destino.placeholder"
              [class.campo__controle--erro]="faltou(destino())"
              [attr.aria-invalid]="faltou(destino()) || null"
              [attr.aria-describedby]="faltou(destino()) ? 'reserva-destino-erro' : null"
              class="campo__controle"
            />
            @if (faltou(destino())) {
              <p class="campo__erro" id="reserva-destino-erro">{{ form.erroObrigatorio }}</p>
            }
          </div>
        }

        <div class="reserva-form__linha">
          <div class="campo">
            <label class="campo__rotulo" for="reserva-data">{{ form.campos.data.rotulo }} *</label>
            <input
              id="reserva-data"
              name="data"
              type="date"
              required
              [min]="hoje"
              [value]="data()"
              (input)="atualizar(data, $event)"
              [class.campo__controle--erro]="!!erroData()"
              [attr.aria-invalid]="!!erroData() || null"
              [attr.aria-describedby]="erroData() ? 'reserva-data-erro' : null"
              class="campo__controle"
            />
            @if (erroData(); as msg) {
              <p class="campo__erro" id="reserva-data-erro">{{ msg }}</p>
            }
          </div>
          <div class="campo">
            <label class="campo__rotulo" for="reserva-hora">
              {{
                tipo() === 'disposicao' ? form.campos.horaInicio.rotulo : form.campos.hora.rotulo
              }}
              *
            </label>
            <input
              id="reserva-hora"
              name="hora"
              type="time"
              required
              [value]="hora()"
              (input)="atualizar(hora, $event)"
              [class.campo__controle--erro]="faltou(hora())"
              [attr.aria-invalid]="faltou(hora()) || null"
              [attr.aria-describedby]="faltou(hora()) ? 'reserva-hora-erro' : null"
              class="campo__controle"
            />
            @if (faltou(hora())) {
              <p class="campo__erro" id="reserva-hora-erro">{{ form.erroObrigatorio }}</p>
            }
          </div>
        </div>

        @if (tipo() === 'ida-volta') {
          <div class="reserva-form__linha">
            <div class="campo">
              <label class="campo__rotulo" for="reserva-data-retorno">
                {{ form.campos.dataRetorno.rotulo }} *
              </label>
              <input
                id="reserva-data-retorno"
                name="dataRetorno"
                type="date"
                required
                [min]="data() || hoje"
                [value]="dataRetorno()"
                (input)="atualizar(dataRetorno, $event)"
                [class.campo__controle--erro]="!!erroDataRetorno()"
                [attr.aria-invalid]="!!erroDataRetorno() || null"
                [attr.aria-describedby]="erroDataRetorno() ? 'reserva-data-retorno-erro' : null"
                class="campo__controle"
              />
              @if (erroDataRetorno(); as msg) {
                <p class="campo__erro" id="reserva-data-retorno-erro">{{ msg }}</p>
              }
            </div>
            <div class="campo">
              <label class="campo__rotulo" for="reserva-hora-retorno">
                {{ form.campos.horaRetorno.rotulo }} *
              </label>
              <input
                id="reserva-hora-retorno"
                name="horaRetorno"
                type="time"
                required
                [value]="horaRetorno()"
                (input)="atualizar(horaRetorno, $event)"
                [class.campo__controle--erro]="faltou(horaRetorno())"
                [attr.aria-invalid]="faltou(horaRetorno()) || null"
                [attr.aria-describedby]="faltou(horaRetorno()) ? 'reserva-hora-retorno-erro' : null"
                class="campo__controle"
              />
              @if (faltou(horaRetorno())) {
                <p class="campo__erro" id="reserva-hora-retorno-erro">{{ form.erroObrigatorio }}</p>
              }
            </div>
          </div>
        }
      </fieldset>

      <fieldset class="reserva-form__grupo">
        <legend class="reserva-form__titulo-grupo">
          <app-icon name="user" [size]="20" />
          {{ form.grupos.passageiro }}
        </legend>

        <div class="reserva-form__linha reserva-form__linha--nome">
          <div class="campo">
            <label class="campo__rotulo" for="reserva-nome">{{ form.campos.nome.rotulo }} *</label>
            <input
              id="reserva-nome"
              name="nome"
              type="text"
              required
              [value]="nome()"
              (input)="atualizar(nome, $event)"
              [placeholder]="form.campos.nome.placeholder"
              [class.campo__controle--erro]="faltou(nome())"
              [attr.aria-invalid]="faltou(nome()) || null"
              [attr.aria-describedby]="faltou(nome()) ? 'reserva-nome-erro' : null"
              autocomplete="name"
              class="campo__controle"
            />
            @if (faltou(nome())) {
              <p class="campo__erro" id="reserva-nome-erro">{{ form.erroObrigatorio }}</p>
            }
          </div>
          <div class="campo">
            <label class="campo__rotulo" for="reserva-passageiros">
              {{ form.campos.passageiros.rotulo }}
            </label>
            <select
              id="reserva-passageiros"
              name="passageiros"
              (change)="atualizar(passageiros, $event)"
              class="campo__controle"
            >
              @for (opcao of form.passageirosOpcoes; track opcao) {
                <option [value]="opcao" [selected]="passageiros() === opcao">{{ opcao }}</option>
              }
            </select>
          </div>
        </div>

        <div class="campo">
          <label class="campo__rotulo" for="reserva-observacoes">
            {{ form.campos.observacoes.rotulo }}
            <span class="campo__opcional">({{ form.opcional }})</span>
          </label>
          <textarea
            id="reserva-observacoes"
            name="observacoes"
            rows="3"
            [value]="observacoes()"
            (input)="atualizar(observacoes, $event)"
            [placeholder]="
              tipo() === 'disposicao'
                ? form.campos.observacoes.placeholderDisposicao
                : form.campos.observacoes.placeholder
            "
            class="campo__controle"
          ></textarea>
        </div>
      </fieldset>

      <button class="btn btn--primary reserva-form__enviar" type="submit">
        <app-icon name="whatsapp" [size]="20" />
        {{ form.botao }}
      </button>
      <p class="reserva-form__aviso">{{ form.aviso }}</p>
    </form>
  `,
  styles: `
    .reserva-form {
      display: grid;
      gap: var(--space-4);
      background: var(--color-surface-2);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-card);
      padding: clamp(var(--space-3), 4vw, var(--space-6));
      text-align: start;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }

    .reserva-form__grupo {
      display: grid;
      gap: var(--space-2);
      border: 0;
      padding: 0;
      margin: 0;
      min-inline-size: 0;
    }

    .reserva-form__titulo-grupo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-display);
      font-size: var(--text-h3);
      font-weight: 600;
      padding: 0;
      margin-block-end: var(--space-1);
    }

    .reserva-form__titulo-grupo app-icon {
      color: var(--color-accent);
    }

    .reserva-form__segmentos {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-2);
    }

    .segmento {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      min-height: 48px;
      padding: 0.625rem 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      color: var(--color-text-2);
      font-size: var(--text-small);
      font-weight: 500;
      cursor: pointer;
      transition:
        color var(--duration-fast) var(--ease-out),
        border-color var(--duration-fast) var(--ease-out),
        background-color var(--duration-fast) var(--ease-out);
    }

    .segmento:hover {
      color: var(--color-text);
      border-color: rgba(247, 226, 185, 0.35);
    }

    .segmento--ativo,
    .segmento--ativo:hover {
      color: var(--color-accent);
      border-color: var(--color-accent);
      background: rgba(247, 226, 185, 0.08);
    }

    .segmento:has(:focus-visible) {
      outline: 2px solid var(--color-accent-hover);
      outline-offset: 3px;
    }

    /* Alto contraste (Windows): cor some — estado ativo precisa de indicador não-cromático */
    @media (forced-colors: active) {
      .segmento--ativo {
        text-decoration: underline;
        font-weight: 700;
      }
    }

    .reserva-form__linha {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-2);
    }

    .reserva-form__linha--nome {
      grid-template-columns: 2fr 1fr;
    }

    .campo {
      display: grid;
      gap: 0.375rem;
      min-inline-size: 0;
    }

    .campo__rotulo {
      font-size: var(--text-overline);
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-2);
    }

    .campo__opcional {
      text-transform: none;
      letter-spacing: normal;
    }

    .campo__controle {
      inline-size: 100%;
      min-height: 48px;
      padding: 0.75rem 1rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      color: var(--color-text);
      font: inherit;
      transition: border-color var(--duration-fast) var(--ease-out);
    }

    .campo__controle::placeholder {
      color: var(--color-text-2);
    }

    .campo__controle:hover {
      border-color: rgba(247, 226, 185, 0.35);
    }

    .campo__controle:focus {
      border-color: var(--color-accent);
    }

    .campo__controle--erro {
      border-color: var(--color-error);
    }

    textarea.campo__controle {
      resize: vertical;
      min-height: 6rem;
    }

    .campo__erro {
      font-size: var(--text-small);
      color: var(--color-error);
    }

    .reserva-form__enviar {
      inline-size: 100%;
      font-size: var(--text-body-lg);
      padding-block: 1rem;
    }

    .reserva-form__aviso {
      font-size: var(--text-small);
      color: var(--color-text-2);
      text-align: center;
      margin-block-start: calc(var(--space-2) * -1);
    }

    @media (max-width: 47.99em) {
      .reserva-form__segmentos {
        grid-template-columns: 1fr;
      }

      .reserva-form__linha,
      .reserva-form__linha--nome {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class BookingForm {
  protected readonly form = RESERVA_FORM;
  protected readonly hoje = dataLocalIso();

  protected readonly tipo = signal<TipoServicoId>('ida');
  protected readonly embarque = signal('');
  protected readonly destino = signal('');
  protected readonly data = signal('');
  protected readonly hora = signal('');
  protected readonly dataRetorno = signal('');
  protected readonly horaRetorno = signal('');
  protected readonly nome = signal('');
  protected readonly passageiros = signal(RESERVA_FORM.passageirosOpcoes[0] as string);
  protected readonly observacoes = signal('');

  protected readonly tentouEnviar = signal(false);

  /** Datas em yyyy-mm-dd e horas em HH:mm comparam corretamente como string. */
  private readonly dataPassada = computed(() => this.data() !== '' && this.data() < this.hoje);

  private readonly retornoAntesDaIda = computed(() => {
    if (
      this.data() === '' ||
      this.hora() === '' ||
      this.dataRetorno() === '' ||
      this.horaRetorno() === ''
    ) {
      return false;
    }
    return `${this.dataRetorno()}T${this.horaRetorno()}` < `${this.data()}T${this.hora()}`;
  });

  protected readonly erroData = computed(() => {
    if (!this.tentouEnviar()) return '';
    if (this.data() === '') return this.form.erroObrigatorio;
    if (this.dataPassada()) return this.form.erroDataPassada;
    return '';
  });

  protected readonly erroDataRetorno = computed(() => {
    if (this.tipo() !== 'ida-volta' || !this.tentouEnviar()) return '';
    if (this.dataRetorno() === '') return this.form.erroObrigatorio;
    if (this.retornoAntesDaIda()) return this.form.erroRetornoAntes;
    return '';
  });

  private readonly valido = computed(() => {
    const base =
      this.embarque().trim() !== '' &&
      this.data() !== '' &&
      this.hora() !== '' &&
      this.nome().trim() !== '' &&
      !this.dataPassada();
    const destinoOk = this.tipo() === 'disposicao' || this.destino().trim() !== '';
    const retornoOk =
      this.tipo() !== 'ida-volta' ||
      (this.dataRetorno() !== '' && this.horaRetorno() !== '' && !this.retornoAntesDaIda());
    return base && destinoOk && retornoOk;
  });

  protected icone(nome: string): IconName {
    return nome as IconName;
  }

  protected atualizar(campo: WritableSignal<string>, evento: Event): void {
    campo.set((evento.target as HTMLInputElement).value);
  }

  protected faltou(valor: string): boolean {
    return this.tentouEnviar() && valor.trim() === '';
  }

  protected enviar(evento: Event): void {
    evento.preventDefault();
    this.tentouEnviar.set(true);
    if (!this.valido()) {
      setTimeout(() => {
        document
          .querySelector<HTMLElement>('.campo__controle--erro')
          ?.focus({ preventScroll: false });
      });
      return;
    }
    const url = linkWhatsApp(this.mensagem());
    // Webviews (Instagram/Facebook) bloqueiam window.open — cai para navegação direta.
    const janela = window.open(url, '_blank', 'noopener');
    if (!janela) {
      window.location.href = url;
    }
  }

  private mensagem(): string {
    const rotuloTipo =
      this.form.tiposServico.find((t) => t.id === this.tipo())?.rotulo ?? this.tipo();
    // Sem emojis: o redirecionamento do wa.me corrompe caracteres fora do BMP.
    const linhas = [
      'Olá! Vim pelo site da YCAR EXECUTIVE e gostaria de reservar:',
      '',
      `• Serviço: ${rotuloTipo}`,
      `• Embarque: ${this.embarque().trim()}`,
      this.tipo() !== 'disposicao' ? `• Destino: ${this.destino().trim()}` : '',
      this.tipo() === 'disposicao'
        ? `• Início: ${dataBr(this.data())} às ${this.hora()}`
        : `• Data: ${dataBr(this.data())} às ${this.hora()}`,
      this.tipo() === 'ida-volta'
        ? `• Retorno: ${dataBr(this.dataRetorno())} às ${this.horaRetorno()}`
        : '',
      `• Nome: ${this.nome().trim()}`,
      `• Passageiros: ${this.passageiros()}`,
      this.observacoes().trim() ? `• Observações: ${this.observacoes().trim()}` : '',
    ];
    return linhas.filter((linha, i) => linha !== '' || i === 1).join('\n');
  }
}

/** Data local (não UTC) no formato yyyy-mm-dd, para o atributo min do input date. */
function dataLocalIso(): string {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

function dataBr(iso: string): string {
  return iso.split('-').reverse().join('/');
}
