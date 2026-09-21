/**
 * Fonte única de conteúdo do site — editar aqui, nunca em template.
 * Conteúdo conforme especificação: docs "Site_YCAR EXECUTIVE.docx".
 */

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

const WHATSAPP_NUMERO = '5511965420041';

export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Cards de serviço e frota compartilham a mesma grade, logo as mesmas larguras.
 * As variantes são geradas em public/images/{servicos,frota}/<nome>-<largura>.webp;
 * o arquivo sem sufixo é a maior (900w) e serve de fallback no `src`.
 */
const LARGURAS_CARD = [400, 560, 672] as const;

/** Grade dos cards: 3 colunas ≥64em (máx. 368px), 2 colunas ≥48em, 1 coluna abaixo. */
export const SIZES_CARD =
  '(min-width: 64em) 368px, (min-width: 48em) calc(50vw - 2rem), calc(100vw - 2.5rem)';

export function srcsetCard(imagem: string): string {
  const base = imagem.replace(/\.webp$/, '');
  return [...LARGURAS_CARD.map((w) => `${base}-${w}.webp ${w}w`), `${imagem} 900w`].join(', ');
}

export const MENSAGEM_PADRAO =
  'Olá! Vim pelo site da YCAR EXECUTIVE e gostaria de fazer uma reserva.';

export const CONTATO = {
  whatsappNumero: WHATSAPP_NUMERO,
  whatsappExibicao: '+55 11 96542-0041',
  instagramUsuario: '@ycarexecutive',
  instagramUrl: 'https://www.instagram.com/ycarexecutive/',
  email: 'contato@ycarexecutive.com.br',
  horario: 'Todos os dias, com agendamento prévio',
  cidade: 'São Paulo – SP',
  cnpj: '',
} as const;

export const MENU: ItemMenu[] = [
  { rotulo: 'Início', destino: '#inicio' },
  { rotulo: 'Serviços', destino: '#servicos' },
  { rotulo: 'Quem Somos', destino: '#quem-somos' },
  { rotulo: 'Como Trabalhamos', destino: '#como-trabalhamos' },
  { rotulo: 'Frota de Veículos', destino: '#frota' },
  { rotulo: 'Mídias Sociais', destino: CONTATO.instagramUrl, externo: true },
];

export const HERO = {
  overline: 'YCAR Executive · São Paulo',
  titulo: 'Transporte Executivo com excelência, conforto e pontualidade.',
  subtitulo:
    'Motoristas profissionais, veículos de alto padrão e atendimento personalizado para uma experiência exclusiva.',
  ctaPrimario: { rotulo: 'Reserve Agora!' },
} as const;

export const SERVICOS_INTRO = {
  titulo: 'Encontre o Serviço Ideal para sua Viagem',
  descricao: 'Sedans, SUVs, Blindados, MiniVans, Vans, Micro-Ônibus e Ônibus.',
} as const;

export const SERVICOS: Servico[] = [
  {
    titulo: 'Transfer Executivo',
    descricao:
      'Aeroportos, hotéis, empresas, noiva e casamentos, eventos, e viagens corporativas ou particulares.',
    icone: 'briefcase',
    imagem: '/images/servicos/transfer-executivo.webp',
    recorte: '14%',
  },
  {
    titulo: 'Receptivo Aeroporto',
    descricao: 'Recepção personalizada nos aeroportos de São Paulo, com conforto e pontualidade.',
    icone: 'plane',
    imagem: '/images/servicos/receptivo-aeroporto.webp',
    recorte: '6%',
  },
  {
    titulo: 'Viagens',
    descricao: 'Transporte Executivo para o interior, litoral e outros estados.',
    icone: 'road',
    imagem: '/images/servicos/viagens.webp',
  },
  {
    titulo: 'Operação à Disposição',
    descricao: 'Motorista Executivo à sua disposição para múltiplos compromissos ao longo do dia.',
    icone: 'clock',
    imagem: '/images/servicos/operacao-disposicao.webp',
    recorte: '4%',
  },
  {
    titulo: 'City Tour',
    descricao: 'Passeios turísticos em São Paulo e diversos destinos, com conforto e segurança.',
    icone: 'pin',
    imagem: '/images/servicos/city-tour.webp',
  },
  {
    titulo: 'Motoristas Bilíngues',
    descricao: 'Atendimento em seu idioma para uma experiência mais confortável e tranquila.',
    icone: 'globe',
    imagem: '/images/servicos/motoristas-bilingues.webp',
  },
  {
    titulo: 'Veículos Blindados',
    descricao: 'Veículos blindados para deslocamentos com máxima segurança e discrição.',
    icone: 'shield',
    imagem: '/images/servicos/veiculo-blindado.webp',
  },
  {
    titulo: 'Segurança Armada',
    descricao: 'Escolta especializada com profissionais treinados e qualificados.',
    icone: 'shield',
    imagem: '/images/servicos/seguranca-armada.webp',
    recorte: '4%',
  },
  {
    titulo: 'Experiência Personalizada',
    descricao: 'Transporte Executivo adaptado às suas necessidades e preferências.',
    icone: 'star',
    imagem: '/images/servicos/experiencia-personalizada.webp',
    recorte: '18%',
  },
];

export const QUEM_SOMOS = {
  titulo: 'Referência em Transporte Executivo em São Paulo',
  paragrafos: [
    'Desde 2020, a YCAR EXECUTIVE é especializada em Transporte Executivo em São Paulo, atendendo clientes que valorizam conforto, segurança e discrição.',
    'Com motoristas experientes e veículos de alto padrão, oferecemos atendimento personalizado, pontualidade e atenção aos detalhes em cada trajeto.',
  ],
  tagline: 'Seu destino, nossa prioridade.',
  chamada: 'Reserve agora e viaje com quem entende de Transporte Executivo.',
} as const;

export const PASSOS: Passo[] = [
  {
    titulo: 'Agendamento da Operação',
    descricao: 'Agende seu serviço e receba a confirmação com os dados do motorista e veículo.',
  },
  {
    titulo: 'Embarque com Tranquilidade',
    descricao:
      'Seu motorista estará no local e horário combinados, pronto para recebê-lo e auxiliar com as bagagens.',
  },
  {
    titulo: 'Experiência Premium',
    descricao:
      'Veículos modernos com Wi-Fi, água com e sem gás, mimos de bordo e atendimento personalizado.',
  },
  {
    titulo: 'Pagamento Facilitado',
    descricao: 'Pague via PIX, cartões de débito ou crédito e link de pagamento.',
  },
];

export const FROTA_INTRO = {
  titulo: 'Frota de Veículos',
  descricao:
    'Frota moderna e diversificada, com veículos selecionados para diferentes necessidades e ocasiões.',
} as const;

export const FROTA: CategoriaFrota[] = [
  {
    nome: 'Sedã',
    lugares: '3 a 4 lugares',
    descricao: 'Ideal para viagens individuais, casais e deslocamentos corporativos.',
    icone: 'car',
    imagem: '/images/frota/sedan.webp',
  },
  {
    nome: 'SUV',
    lugares: '4 a 6 lugares',
    descricao: 'Mais espaço e versatilidade para famílias, pequenos grupos e viagens.',
    icone: 'car',
    imagem: '/images/frota/suv.webp',
  },
  {
    nome: 'MiniVan',
    lugares: '7 lugares',
    descricao: 'Ideal para pequenos grupos, com amplo espaço interno e para bagagens.',
    icone: 'van',
    imagem: '/images/frota/minivan.webp',
  },
  {
    nome: 'Van',
    lugares: '10 a 18 lugares',
    descricao: 'Ideal para grupos, eventos, turismo e traslados corporativos.',
    icone: 'van',
    imagem: '/images/frota/van.webp',
  },
  {
    nome: 'Micro-Ônibus',
    lugares: '20 a 30 lugares',
    descricao: 'Amplo espaço para grupos maiores, eventos, transfers, passeios e viagens.',
    icone: 'bus',
    imagem: '/images/frota/micro-onibus.webp',
  },
  {
    nome: 'Ônibus',
    lugares: 'Acima de 40 lugares',
    descricao: 'Ideal para grandes grupos, excursões, eventos e viagens de longa distância.',
    icone: 'bus',
    imagem: '/images/frota/onibus.webp',
  },
  {
    nome: 'Blindados',
    lugares: 'Blindados Sob Demanda',
    descricao: 'Segurança reforçada e proteção adicional, com conforto e discrição.',
    icone: 'shield',
    imagem: '/images/frota/blindado.webp',
  },
];

export const RESERVA = {
  titulo: 'Reserve Agora!',
  descricao:
    'Escolha o serviço, a data e o horário na nossa plataforma de agendamento. Você recebe a confirmação da reserva com todos os detalhes.',
  cta: {
    rotulo: 'Reserve Agora!',
    mensagem: MENSAGEM_PADRAO,
  },
  plataformaUrl: 'https://ycarexecutive.youcanbook.me',
  plataformaRotulo: 'Fazer reserva online',
} as const;

export const MARCA = {
  nomeCurto: 'YCar Executive',
  nomeCompleto: 'YCAR EXECUTIVE',
  dominio: 'https://ycarexecutive.com.br',
} as const;
