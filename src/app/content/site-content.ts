/**
 * Fonte única de conteúdo do site — nunca em template.
 * Os textos editáveis vivem em conteudo.json, que o painel /admin altera via commit;
 * aqui ficam os tipos e o que é derivado deles (links, telefone formatado, menu).
 */

import conteudo from './conteudo.json';

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
  return `https://wa.me/${conteudo.contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
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
  // Fotos enviadas pelo painel podem ser .jpg (navegador sem encoder WebP)
  const [, base, ext] = imagem.match(/^(.*)(\.\w+)$/)!;
  return [...LARGURAS_CARD.map((w) => `${base}-${w}${ext} ${w}w`), `${imagem} 900w`].join(', ');
}

export const MENSAGEM_PADRAO = conteudo.contato.mensagemWhatsapp;

const INSTAGRAM_URL = `https://www.instagram.com/${conteudo.contato.instagram}/`;

export const CONTATO = {
  whatsappExibicao: formatarTelefone(conteudo.contato.whatsapp),
  instagramUsuario: `@${conteudo.contato.instagram}`,
  instagramUrl: INSTAGRAM_URL,
  email: conteudo.contato.email,
  horario: conteudo.contato.horario,
  cidade: conteudo.contato.cidade,
  cnpj: conteudo.contato.cnpj,
};

export const MENU: ItemMenu[] = [
  { rotulo: conteudo.menu.inicio, destino: '#inicio' },
  { rotulo: conteudo.menu.servicos, destino: '#servicos' },
  { rotulo: conteudo.menu.quemSomos, destino: '#quem-somos' },
  { rotulo: conteudo.menu.comoTrabalhamos, destino: '#como-trabalhamos' },
  { rotulo: conteudo.menu.frota, destino: '#frota' },
  { rotulo: conteudo.menu.redesSociais, destino: INSTAGRAM_URL, externo: true },
];

export const HERO = {
  ...conteudo.inicio,
  ctaPrimario: { rotulo: conteudo.reserva.botao },
};

export const SERVICOS_INTRO = {
  titulo: conteudo.servicos.titulo,
  descricao: conteudo.servicos.descricao,
};

export const SERVICOS: Servico[] = conteudo.servicos.itens.map((servico) => ({
  ...servico,
  recorte: servico.recorte || undefined,
}));

export const QUEM_SOMOS = conteudo.quemSomos;

export const COMO_TRABALHAMOS_TITULO = conteudo.comoTrabalhamos.titulo;

export const PASSOS: Passo[] = conteudo.comoTrabalhamos.passos;

export const FROTA_INTRO = {
  titulo: conteudo.frota.titulo,
  descricao: conteudo.frota.descricao,
};

export const FROTA: CategoriaFrota[] = conteudo.frota.itens;

export const RESERVA = {
  titulo: conteudo.reserva.titulo,
  descricao: conteudo.reserva.descricao,
  cta: {
    rotulo: conteudo.reserva.botao,
    mensagem: MENSAGEM_PADRAO,
  },
  plataformaUrl: conteudo.reserva.plataformaUrl,
  plataformaRotulo: conteudo.reserva.botaoPlataforma,
};

export const MARCA = {
  nomeCurto: 'YCar Executive',
  nomeCompleto: 'YCAR EXECUTIVE',
  dominio: 'https://ycarexecutive.com.br',
} as const;

/** JSON-LD LocalBusiness (PRD §8.6), injetado no <head> durante o pré-render. */
export const DADOS_ESTRUTURADOS = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: MARCA.nomeCompleto,
  description:
    'Transporte executivo em São Paulo: transfers, receptivo em aeroportos, viagens, city tour e frota do sedã ao ônibus, incluindo blindados.',
  url: `${MARCA.dominio}/`,
  image: `${MARCA.dominio}/images/og-image.png`,
  telephone: CONTATO.whatsappExibicao,
  ...(CONTATO.email && { email: CONTATO.email }),
  ...(CONTATO.cnpj && { taxID: CONTATO.cnpj }),
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
  sameAs: [INSTAGRAM_URL],
};
