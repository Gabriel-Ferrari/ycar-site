import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  MENSAGEM_PADRAO,
  RESERVA,
  RESERVA_FORM,
  TipoServicoId,
  linkWhatsApp,
} from '../content/site-content';
import { CampoEndereco } from './campo-endereco';
import { Icon, IconName } from './icon';

/**
 * Versão resumida do formulário de reserva: o essencial para o orçamento; retorno, nome e
 * observações se combinam na conversa. Validação nativa do navegador (required/min).
 */
@Component({
  selector: 'app-booking-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, CampoEndereco],
  template: `
    <form class="reserva-form" (submit)="enviar($event)">
      <fieldset class="reserva-form__tipos">
        <legend class="campo__rotulo">{{ form.tipoLegenda }}</legend>
        @for (t of form.tiposServico; track t.id) {
          <label class="segmento" [class.segmento--ativo]="tipo() === t.id">
            <input
              class="sr-only"
              type="radio"
              name="tipo"
              [value]="t.id"
              [checked]="tipo() === t.id"
              (change)="tipo.set(t.id)"
            />
            <app-icon [name]="icone(t.icone)" [size]="18" />
            {{ t.rotulo }}
          </label>
        }
      </fieldset>

      <div class="reserva-form__linha">
        <div class="campo">
          <label class="campo__rotulo" for="reserva-embarque">{{ form.campos.embarque.rotulo }}</label>
          <app-campo-endereco
            campoId="reserva-embarque"
            nome="embarque"
            [placeholder]="form.campos.embarque.placeholder"
          />
        </div>
        @if (tipo() !== 'disposicao') {
          <div class="campo">
            <label class="campo__rotulo" for="reserva-destino">{{ form.campos.destino.rotulo }}</label>
            <app-campo-endereco
              campoId="reserva-destino"
              nome="destino"
              [placeholder]="form.campos.destino.placeholder"
            />
          </div>
        }
      </div>

      <div class="reserva-form__linha reserva-form__linha--tres">
        <div class="campo">
          <label class="campo__rotulo" for="reserva-data">{{ form.campos.data.rotulo }}</label>
          <input
            id="reserva-data"
            name="data"
            type="date"
            required
            class="campo__controle"
            [min]="hoje"
          />
        </div>
        <div class="campo">
          <label class="campo__rotulo" for="reserva-hora">{{ form.campos.hora.rotulo }}</label>
          <input id="reserva-hora" name="hora" type="time" required class="campo__controle" />
        </div>
        <div class="campo">
          <label class="campo__rotulo" for="reserva-passageiros">
            {{ form.campos.passageiros.rotulo }}
          </label>
          <select id="reserva-passageiros" name="passageiros" class="campo__controle">
            @for (opcao of form.passageirosOpcoes; track opcao) {
              <option [value]="opcao">{{ opcao }}</option>
            }
          </select>
        </div>
      </div>

      <button class="btn btn--primary reserva-form__enviar" type="submit">
        <app-icon name="whatsapp" [size]="20" />
        {{ reserva().plataformaRotulo }}
      </button>
      <p class="reserva-form__aviso">{{ form.aviso }}</p>
    </form>
  `,
  styles: `
    .reserva-form {
      display: grid;
      gap: var(--space-3);
      background: var(--color-surface-2);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-card);
      padding: clamp(var(--space-3), 4vw, var(--space-4));
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

    .reserva-form__tipos {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-1);
      border: 0;
      padding: 0;
      margin: 0;
      min-inline-size: 0;
    }

    .reserva-form__tipos legend {
      margin-block-end: 0.375rem;
      padding: 0;
    }

    .segmento {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      min-height: 48px;
      padding: 0.5rem 0.75rem;
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
      grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
      gap: var(--space-2);
    }

    .reserva-form__linha--tres {
      grid-template-columns: 1.3fr 1fr 1fr;
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

    /* Celular: as 3 opções lado a lado, ícone em cima — empilhadas ocupavam meia tela */
    @media (max-width: 47.99em) {
      .segmento {
        flex-direction: column;
        gap: 0.25rem;
        padding-inline: 0.25rem;
        text-align: center;
        line-height: 1.2;
      }

      .reserva-form__enviar {
        font-size: var(--text-body);
        white-space: nowrap;
      }

      .reserva-form__linha--tres {
        grid-template-columns: 1fr 1fr;
      }

      .reserva-form__linha--tres .campo:first-child {
        grid-column: 1 / -1;
      }
    }
  `,
})
export class BookingForm {
  protected readonly form = RESERVA_FORM;
  protected readonly reserva = RESERVA;
  protected readonly hoje = dataLocalIso();
  protected readonly tipo = signal<TipoServicoId>('ida');

  protected icone(nome: string): IconName {
    return nome as IconName;
  }

  /** Só dispara com o formulário válido: required/min são checados pelo navegador antes. */
  protected enviar(evento: Event): void {
    evento.preventDefault();
    const dados = new FormData(evento.target as HTMLFormElement);
    const campo = (nome: string) => String(dados.get(nome) ?? '').trim();
    const tipo = this.form.tiposServico.find((t) => t.id === this.tipo())!;

    // Sem emojis: o redirecionamento do wa.me corrompe caracteres fora do BMP.
    const linhas = [
      MENSAGEM_PADRAO(),
      '',
      `• Serviço: ${tipo.rotulo}`,
      `• Embarque: ${campo('embarque')}`,
      this.tipo() !== 'disposicao' ? `• Destino: ${campo('destino')}` : null,
      `• Data: ${dataBr(campo('data'))} às ${campo('hora')}`,
      `• Passageiros: ${campo('passageiros')}`,
    ];
    const url = linkWhatsApp(linhas.filter((linha) => linha !== null).join('\n'));
    // Webviews (Instagram/Facebook) bloqueiam window.open — cai para navegação direta.
    // Sem a feature 'noopener': com ela window.open sempre devolve null e o fallback
    // navegaria a aba atual também.
    const janela = window.open(url, '_blank');
    if (janela) janela.opener = null;
    else window.location.href = url;
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
