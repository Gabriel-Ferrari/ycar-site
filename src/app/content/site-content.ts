/**
 * Fonte única de conteúdo do site — nunca em template.
 * Os textos editáveis vivem em conteudo.json, que o painel /admin altera via commit;
 * aqui ficam os tipos e o que é derivado deles (links, telefone formatado, menu).
 *
 * Tudo é signal para a prévia do painel trocar o conteúdo ao vivo (aplicarPrevia);
 * no site publicado o valor nunca muda.
 */

import { computed, signal } from '@angular/core';
import inicial from './conteudo.json';

export type Conteudo = typeof inicial;

const conteudo = signal<Conteudo>(inicial);

/** Prévia do painel /admin: mostra conteúdo ainda não publicado, só naquela aba. */
export function aplicarPrevia(novo: Conteudo): void {
  conteudo.set(novo);
}

export interface CtaWhatsApp {
  rotulo: string;
  mensagem: string;
}

export interface Servico {
  titulo: string;
  descricao: string;
  icone: string;
  imagem: string;
  /** Quanto a foto desce (% da própria altura, cortando o chão) para o CTA não cobrir rostos */
  recorte?: string;
}

export interface CategoriaFrota {
  nome: string;
  lugares: string;
  descricao: string;
  icone: string;
  imagem: string;
}

export interface Passo {
  titulo: string;
  descricao: string;
}

export interface ItemMenu {
  rotulo: string;
  destino: string;
  externo?: boolean;
}

/** Telefone só com dígitos (55 + DDD + número) → "+55 11 96542-0041" */
function formatarTelefone(digitos: string): string {
  const [, ddi, ddd, prefixo, sufixo] = digitos.match(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/) ?? [];
  return ddi ? `+${ddi} ${ddd} ${prefixo}-${sufixo}` : digitos;
}

export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${conteudo().contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Cards de serviço e frota compartilham a mesma grade, logo as mesmas larguras.
 * As variantes ficam em public/images/{servicos,frota}/<nome>-<largura>.webp (geradas pelo
 * script ou pelo painel, que também usa .jpg quando o navegador não codifica WebP);
 * o arquivo sem sufixo é a maior (900w) e serve de fallback no `src`.
 */
const LARGURAS_CARD = [400, 560, 672] as const;

/** Grade dos cards: 3 colunas ≥64em (máx. 368px), 2 colunas ≥48em, 1 coluna abaixo. */
export const SIZES_CARD =
  '(min-width: 64em) 368px, (min-width: 48em) calc(50vw - 2rem), calc(100vw - 2.5rem)';

export function srcsetCard(imagem: string): string {
  // Fotos enviadas pelo painel podem ser .jpg (navegador sem encoder WebP);
  // na prévia, foto ainda não publicada é um blob: sem variantes
  const partes = imagem.match(/^(.*)(\.\w+)$/);
  if (!partes) return imagem;
  const [, base, ext] = partes;
  return [...LARGURAS_CARD.map((w) => `${base}-${w}${ext} ${w}w`), `${imagem} 900w`].join(', ');
}

export const MENSAGEM_PADRAO = computed(() => conteudo().contato.mensagemWhatsapp);

const INSTAGRAM_URL = computed(() => `https://www.instagram.com/${conteudo().contato.instagram}/`);

export const CONTATO = computed(() => {
  const contato = conteudo().contato;
  return {
    whatsappExibicao: formatarTelefone(contato.whatsapp),
    instagramUsuario: `@${contato.instagram}`,
    instagramUrl: INSTAGRAM_URL(),
    email: contato.email,
    horario: contato.horario,
    cidade: contato.cidade,
    cnpj: contato.cnpj,
  };
});

export const MENU = computed<ItemMenu[]>(() => {
  const menu = conteudo().menu;
  return [
    { rotulo: menu.inicio, destino: '#inicio' },
    { rotulo: menu.servicos, destino: '#servicos' },
    { rotulo: menu.quemSomos, destino: '#quem-somos' },
    { rotulo: menu.comoTrabalhamos, destino: '#como-trabalhamos' },
    { rotulo: menu.frota, destino: '#frota' },
    { rotulo: menu.redesSociais, destino: INSTAGRAM_URL(), externo: true },
  ];
});

export const HERO = computed(() => ({
  ...conteudo().inicio,
  ctaPrimario: { rotulo: conteudo().reserva.botao },
}));

export const SERVICOS_INTRO = computed(() => ({
  titulo: conteudo().servicos.titulo,
  descricao: conteudo().servicos.descricao,
}));

export const SERVICOS = computed<Servico[]>(() =>
  conteudo().servicos.itens.map((servico) => ({
    ...servico,
    recorte: servico.recorte || undefined,
  })),
);

export const QUEM_SOMOS = computed(() => conteudo().quemSomos);

export const COMO_TRABALHAMOS_TITULO = computed(() => conteudo().comoTrabalhamos.titulo);

export const PASSOS = computed<Passo[]>(() => conteudo().comoTrabalhamos.passos);

export const FROTA_INTRO = computed(() => ({
  titulo: conteudo().frota.titulo,
  descricao: conteudo().frota.descricao,
}));

export const FROTA = computed<CategoriaFrota[]>(() => conteudo().frota.itens);

export const RESERVA = computed(() => {
  const reserva = conteudo().reserva;
  return {
    titulo: reserva.titulo,
    descricao: reserva.descricao,
    cta: {
      rotulo: reserva.botao,
      mensagem: MENSAGEM_PADRAO(),
    },
    // Sem agenda online cadastrada no painel, todo botão de reserva abre o WhatsApp
    plataformaUrl: reserva.plataformaUrl || linkWhatsApp(MENSAGEM_PADRAO()),
    agendaOnline: reserva.plataformaUrl,
    plataformaRotulo: reserva.botaoPlataforma,
  };
});

export type TipoServicoId = 'ida' | 'ida-volta' | 'disposicao';

/** Formulário resumido da seção de reserva (monta a mensagem do WhatsApp). */
export const RESERVA_FORM = {
  tipoLegenda: 'Tipo de serviço',
  tiposServico: [
    { id: 'ida' as TipoServicoId, rotulo: 'Somente ida', icone: 'arrow-right' },
    { id: 'ida-volta' as TipoServicoId, rotulo: 'Ida e volta', icone: 'swap' },
    { id: 'disposicao' as TipoServicoId, rotulo: 'À disposição', icone: 'clock' },
  ],
  campos: {
    embarque: { rotulo: 'Embarque', placeholder: 'Endereço, aeroporto ou hotel' },
    destino: { rotulo: 'Destino', placeholder: 'Para onde vamos?' },
    data: { rotulo: 'Data' },
    hora: { rotulo: 'Horário' },
    passageiros: { rotulo: 'Passageiros' },
  },
  passageirosOpcoes: ['1', '2', '3', '4', '5', '6', '7', '8 ou mais'],
  aviso: 'O WhatsApp abre com os dados da reserva já preenchidos.',
  agendaLink: 'Prefere escolher o horário sozinho? Reserve pela agenda online',
} as const;

export const MARCA = {
  nomeCurto: 'YCar Executive',
  nomeCompleto: 'YCAR EXECUTIVE',
  dominio: 'https://ycarexecutive.com.br',
} as const;

/** JSON-LD LocalBusiness (PRD §8.6), injetado no <head> durante o pré-render. */
export function dadosEstruturados() {
  const contato = CONTATO();
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: MARCA.nomeCompleto,
    description:
      'Transporte executivo em São Paulo: transfers, receptivo em aeroportos, viagens, city tour e frota do sedã ao ônibus, incluindo blindados.',
    url: `${MARCA.dominio}/`,
    image: `${MARCA.dominio}/images/og-image.png`,
    telephone: contato.whatsappExibicao,
    ...(contato.email && { email: contato.email }),
    ...(contato.cnpj && { taxID: contato.cnpj }),
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    areaServed: [
      { '@type': 'City', name: 'São Paulo' },
      { '@type': 'AdministrativeArea', name: 'Região Metropolitana de São Paulo' },
    ],
    sameAs: [contato.instagramUrl],
  };
}
