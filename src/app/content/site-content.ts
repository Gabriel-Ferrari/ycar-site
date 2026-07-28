/**
 * Fonte única de conteúdo do site — editar aqui, nunca em template.
 * Textos marcados PROVISÓRIO aguardam validação (docs/PRD.md §11).
 * Critério da Etapa 5: `grep -r "PROVISÓRIO" src/` deve retornar vazio.
 */

export interface CtaWhatsApp {
  rotulo: string;
  mensagem: string;
}

export interface Servico {
  titulo: string;
  descricao: string;
  icone: string;
  cta?: CtaWhatsApp;
  destaque?: boolean;
}

export interface Diferencial {
  titulo: string;
  descricao: string;
  icone: string;
}

export interface FotoVeiculo {
  src: string;
  alt: string;
  largura: number;
  altura: number;
}

export interface Veiculo {
  nome: string;
  ano: number;
  categoria: 'executivo' | 'van';
  descricao: string;
  destaques: string[];
  fotos: FotoVeiculo[];
}

export interface Depoimento {
  citacao: string;
  autor: string;
  contexto: string;
}

export interface Estatistica {
  valor: number;
  sufixo?: string;
  rotulo: string;
}

export interface Passo {
  titulo: string;
  descricao: string;
}

const WHATSAPP_NUMERO = '5511982998183';

export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

export const MENSAGEM_PADRAO =
  'Olá! Vim pelo site da YCar e gostaria de um orçamento de transporte executivo.';

export const CONTATO = {
  whatsappNumero: WHATSAPP_NUMERO,
  whatsappExibicao: '+55 11 98299-8183',
  instagramUsuario: '@ycarexecutive',
  instagramUrl: 'https://www.instagram.com/ycarexecutive/',
  // PROVISÓRIO: e-mail depende do Cloudflare Email Routing (suposição ⚠️ 9)
  email: 'contato@ycarexecutive.com.br',
  // PROVISÓRIO: horário a confirmar (suposição ⚠️ 6)
  horario: 'Todos os dias, com agendamento prévio',
  cidade: 'São Paulo – SP',
  // PROVISÓRIO: CNPJ a fornecer (suposição ⚠️ 8)
  cnpj: '',
} as const;

export const HERO = {
  overline: 'Transporte executivo · São Paulo',
  titulo: 'Transporte executivo corporativo em São Paulo',
  subtitulo:
    'Motorista fixo, sigilo absoluto e pontualidade monitorada — com nota fiscal em todo atendimento. Há 5 anos servindo empresas e executivos na capital e Grande São Paulo.',
  ctaPrimario: {
    rotulo: 'Pedir proposta no WhatsApp',
    mensagem: MENSAGEM_PADRAO,
  },
  ctaSecundario: { rotulo: 'Conhecer os serviços', ancora: '#servicos' },
  imagem: {
    // PROVISÓRIO: trocar por foto real do carro (externa 3/4), WebP < 200 KB
    src: 'images/hero-placeholder.webp',
    alt: 'Chery Tiggo 8 Pro Hybrid 2024 da YCar em frente a prédio corporativo',
    largura: 1600,
    altura: 900,
  },
} as const;

export const ESTATISTICAS: Estatistica[] = [
  { valor: 5, rotulo: 'anos de atendimento executivo' },
  // PROVISÓRIO ⚠️ 1: confirmar que atende os três aeroportos
  { valor: 3, rotulo: 'aeroportos atendidos (GRU · CGH · VCP)' },
  // PROVISÓRIO ⚠️ 2: confirmar cobertura da RMSP inteira; senão trocar por número real
  { valor: 39, rotulo: 'municípios da Grande São Paulo' },
];

export const SERVICOS: Servico[] = [
  {
    titulo: 'Atendimento corporativo',
    descricao:
      'Contrato mensal ou demanda recorrente para diretoria, visitas de negócios e comitivas. Um único motorista dedicado à sua conta e nota fiscal em todo atendimento.',
    icone: 'briefcase',
    destaque: true,
    cta: {
      rotulo: 'Pedir proposta corporativa',
      mensagem: 'Olá! Gostaria de uma proposta de atendimento corporativo da YCar.',
    },
  },
  {
    titulo: 'Transfer aeroporto',
    // PROVISÓRIO ⚠️ 5: confirmar recepção com identificação no desembarque
    descricao:
      'GRU, CGH e VCP. Acompanhamos o status do voo: atrasou, o horário ajusta sem custo extra. Recepção no desembarque com identificação.',
    icone: 'plane',
    cta: {
      rotulo: 'Reservar transfer',
      mensagem: 'Olá! Gostaria de cotar um transfer de aeroporto com a YCar.',
    },
  },
  {
    titulo: 'À disposição por hora ou diária',
    descricao:
      'Agenda de reuniões pela cidade, roadshow, dia de visitas. O carro espera; a agenda manda.',
    icone: 'clock',
    cta: {
      rotulo: 'Consultar disponibilidade',
      mensagem: 'Olá! Gostaria de cotar o serviço de motorista à disposição da YCar.',
    },
  },
  {
    titulo: 'Viagens rodoviárias',
    // PROVISÓRIO: confirmar raio real de atuação
    descricao:
      'Intermunicipais e interestaduais, ida e volta ou apenas trecho. Litoral, interior e outras capitais.',
    icone: 'road',
    cta: {
      rotulo: 'Cotar viagem',
      mensagem: 'Olá! Gostaria de cotar uma viagem rodoviária com a YCar.',
    },
  },
  {
    titulo: 'Eventos',
    descricao:
      'Casamentos, formaturas e eventos corporativos. Horário combinado, carro impecável, sem imprevisto.',
    icone: 'star',
    cta: {
      rotulo: 'Cotar evento',
      mensagem: 'Olá! Gostaria de cotar transporte executivo para um evento com a YCar.',
    },
  },
];

export const DIFERENCIAIS: Diferencial[] = [
  {
    titulo: 'Motorista fixo',
    descricao:
      'Sempre o mesmo profissional. Ele conhece o passageiro, os endereços e as preferências — nenhum aplicativo replica isso.',
    icone: 'user',
  },
  {
    titulo: 'Sigilo e discrição',
    descricao: 'Reuniões acontecem no banco de trás. O que se fala no carro fica no carro.',
    icone: 'shield',
  },
  {
    titulo: 'Pontualidade monitorada',
    descricao:
      'Voo e trânsito acompanhados em tempo real. O carro chega antes do horário, não "em até tantos minutos".',
    icone: 'watch',
  },
  {
    titulo: 'Nota fiscal e contrato',
    descricao:
      'NF em todo atendimento, para reembolso e conformidade do financeiro. Contrato para demanda recorrente.',
    icone: 'document',
  },
];

export const VEICULOS: Veiculo[] = [
  {
    nome: 'Chery Tiggo 8 Pro Hybrid',
    ano: 2024,
    categoria: 'executivo',
    // PROVISÓRIO ⚠️ 3/4: cor, itens de bordo e configuração de lugares a confirmar
    descricao:
      'SUV híbrido: deslocamento silencioso, partida sem ruído e conforto estável mesmo no trânsito de São Paulo. Higienizado a cada atendimento.',
    destaques: ['Ano 2024', 'Híbrido', 'Higienizado a cada atendimento'],
    fotos: [
      // PROVISÓRIO: trocar por 3 fotos reais (interna banco traseiro, porta-malas, detalhe)
      {
        src: 'images/veiculo-1-placeholder.webp',
        alt: 'Banco traseiro do Chery Tiggo 8 Pro Hybrid da YCar',
        largura: 1200,
        altura: 900,
      },
      {
        src: 'images/veiculo-2-placeholder.webp',
        alt: 'Porta-malas aberto do Chery Tiggo 8 Pro Hybrid da YCar',
        largura: 1200,
        altura: 900,
      },
      {
        src: 'images/veiculo-3-placeholder.webp',
        alt: 'Detalhe frontal do Chery Tiggo 8 Pro Hybrid da YCar',
        largura: 1200,
        altura: 900,
      },
    ],
  },
];

export const PASSOS: Passo[] = [
  { titulo: 'Chame no WhatsApp', descricao: 'Diga origem, destino e horário.' },
  {
    titulo: 'Receba a proposta',
    // PROVISÓRIO ⚠️ 7: prazo de resposta a confirmar antes de prometer
    descricao: 'Valor fechado, sem surpresa e sem tarifa dinâmica.',
  },
  {
    titulo: 'Motorista no local',
    descricao: 'Antes do horário, com o trajeto já estudado.',
  },
];

/**
 * Depoimentos reais a coletar (suposição ⚠️ 11). Array vazio = seção não renderiza.
 * NUNCA publicar depoimento inventado — critério de aceite 19 do PRD §9.
 * Os itens abaixo existem só para dimensionar o layout em desenvolvimento.
 */
export const DEPOIMENTOS_DEV_APENAS: Depoimento[] = [
  {
    citacao:
      'PROVISÓRIO — depoimento real a coletar. Texto de dimensionamento com duas linhas para validar o layout do card.',
    autor: 'A. B.',
    contexto: 'Diretor comercial',
  },
  {
    citacao: 'PROVISÓRIO — depoimento real a coletar. Texto curto.',
    autor: 'C. D.',
    contexto: 'Assistente executiva',
  },
  {
    citacao:
      'PROVISÓRIO — depoimento real a coletar. Texto de dimensionamento um pouco mais longo, com três linhas, para validar o alinhamento vertical entre cards de alturas diferentes.',
    autor: 'E. F.',
    contexto: 'Gerente de facilities',
  },
];

/** Troque para [] antes do go-live se os reais não chegarem. */
export const DEPOIMENTOS: Depoimento[] = DEPOIMENTOS_DEV_APENAS;

export const AREA_ATENDIMENTO = {
  titulo: 'Onde a YCar atende',
  descricao:
    'São Paulo capital — todas as regiões. Grande São Paulo: ABC, Guarulhos, Osasco, Barueri/Alphaville e demais municípios. Viagens intermunicipais e interestaduais sob cotação.',
  aeroportos: ['Guarulhos (GRU)', 'Congonhas (CGH)', 'Viracopos (VCP)'],
  regioes: [
    'São Paulo capital',
    'ABC Paulista',
    'Guarulhos',
    'Osasco',
    'Barueri / Alphaville',
    'Demais municípios da Grande SP',
  ],
} as const;

export const MARCA = {
  nomeCurto: 'YCar',
  // PROVISÓRIO ⚠️ 12: validar nome completo exibido
  nomeCompleto: 'YCar Transporte Executivo',
  dominio: 'https://ycarexecutive.com.br',
} as const;
