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
}

export interface CategoriaFrota {
  nome: string;
  lugares: string;
  descricao: string;
  icone: string;
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
  'Olá! Vim pelo site da YCAR EXECUTIVE e gostaria de fazer uma reserva.';

export const CONTATO = {
  whatsappNumero: WHATSAPP_NUMERO,
  whatsappExibicao: '+55 11 98299-8183',
  instagramUsuario: '@ycarexecutive',
  instagramUrl: 'https://www.instagram.com/ycarexecutive/',
  email: 'contato@ycarexecutive.com.br',
  horario: 'Todos os dias, com agendamento prévio',
  cidade: 'São Paulo – SP',
  cnpj: '',
} as const;

export const HERO = {
  overline: 'YCAR Executive · São Paulo',
  titulo: 'Transporte Executivo com excelência, conforto e pontualidade em cada detalhe.',
  subtitulo:
    'Motoristas profissionais, veículos de alto padrão e atendimento personalizado em cada trajeto.',
  ctaPrimario: {
    rotulo: 'Reserve Agora!',
    mensagem: MENSAGEM_PADRAO,
  },
  ctaSecundario: { rotulo: 'Conhecer os serviços', ancora: '#servicos' },
} as const;

export const SERVICOS_INTRO = {
  titulo: 'Garanta sua viagem com segurança, conforto e pontualidade',
  descricao:
    'Do Sedan Executivo ao Ônibus, incluindo blindados — veículos para viagens individuais ou grandes grupos, com o mais alto padrão de qualidade.',
} as const;

export const SERVICOS: Servico[] = [
  {
    titulo: 'Transfer Executivo',
    descricao:
      'Aeroportos, hotéis, empresas, eventos, casamentos, congressos e viagens corporativas ou particulares.',
    icone: 'briefcase',
  },
  {
    titulo: 'Receptivo Aeroporto',
    descricao:
      'Estaremos esperando por você nos aeroportos de São Paulo, no horário da sua chegada.',
    icone: 'plane',
  },
  {
    titulo: 'Viagens',
    descricao:
      'Interior paulista, litoral e outros estados — transporte de alto padrão para qualquer destino.',
    icone: 'road',
  },
  {
    titulo: 'Operação à Disposição',
    descricao: 'Motorista executivo à sua disposição para múltiplos compromissos ao longo do dia.',
    icone: 'clock',
  },
  {
    titulo: 'City Tour',
    descricao:
      'Passeios por São Paulo, Aparecida, Campos do Jordão, Holambra, Santos, São Roque e outros destinos.',
    icone: 'pin',
  },
  {
    titulo: 'Motoristas Bilíngues',
    descricao: 'Atendimento em seu idioma, com mais conforto e tranquilidade em todo o trajeto.',
    icone: 'globe',
  },
  {
    titulo: 'Veículos Blindados',
    descricao: 'Blindados com monitoramento 24 horas: máxima segurança, discrição e tranquilidade.',
    icone: 'shield',
  },
  {
    titulo: 'Experiência Personalizada',
    descricao:
      'Planejamos cada detalhe conforme a sua necessidade, para uma experiência exclusiva.',
    icone: 'star',
  },
];

export const QUEM_SOMOS = {
  titulo: 'Excelência em Transporte Executivo em São Paulo',
  paragrafos: [
    'Na YCAR EXECUTIVE, unimos qualidade, sofisticação e segurança em cada trajeto, com motoristas profissionais e uma frota moderna e revisada.',
    'Atendemos diárias com motorista à disposição, transfers, aeroportos, viagens, eventos e deslocamentos executivos — sempre com pontualidade e atenção aos detalhes.',
    'Escolher a YCAR EXECUTIVE é optar por um serviço Premium, pensado para transformar cada viagem em uma experiência de alto padrão.',
  ],
  tagline: 'Seu destino, nossa prioridade.',
  chamada: 'Reserve agora e viaje com quem entende de Transporte Executivo.',
} as const;

export const PASSOS: Passo[] = [
  {
    titulo: 'Agendamento da Operação',
    descricao:
      'Agende de forma rápida e receba a confirmação com as informações do veículo, do motorista e do serviço.',
  },
  {
    titulo: 'Embarque com Tranquilidade',
    descricao:
      'Seu motorista chega com antecedência, recebe você com cordialidade e auxilia com as bagagens.',
  },
  {
    titulo: 'Experiência Premium',
    descricao:
      'Veículos modernos com ar-condicionado, Wi-Fi, água mineral e mimos de bordo — do embarque ao destino.',
  },
  {
    titulo: 'Pagamento com Total Conveniência',
    descricao: 'PIX, cartões de débito e crédito ou link de pagamento. Simples, rápido e seguro.',
  },
];

export const FROTA_INTRO = {
  titulo: 'Frota de Veículos Executiva',
  descricao:
    'Frota moderna e diversificada, do atendimento corporativo aos momentos especiais — experiência premium do embarque ao destino.',
} as const;

export const FROTA: CategoriaFrota[] = [
  {
    nome: 'Sedã Executivo',
    lugares: '3 a 4 lugares',
    descricao:
      'Ideal para viagens individuais, casais e deslocamentos corporativos, oferecendo elegância, conforto e discrição.',
    icone: 'car',
  },
  {
    nome: 'SUV Executivo',
    lugares: '4 a 6 lugares',
    descricao:
      'Mais espaço, sofisticação e versatilidade para famílias, grupos reduzidos e viagens de longa distância.',
    icone: 'car',
  },
  {
    nome: 'MiniVan Executiva',
    lugares: '7 lugares',
    descricao:
      'Versatilidade e conforto para pequenos grupos com maior espaço interno e amplo espaço para bagagens.',
    icone: 'van',
  },
  {
    nome: 'Van Executiva',
    lugares: '10 a 18 lugares',
    descricao:
      'Perfeita para grupos, eventos, turismo e traslados corporativos, com máximo conforto.',
    icone: 'van',
  },
  {
    nome: 'Micro-Ônibus Executivo',
    lugares: '20 a 30 lugares',
    descricao: 'Para grupos, eventos, passeios e transfers, com amplo espaço interno.',
    icone: 'bus',
  },
  {
    nome: 'Ônibus Executivo',
    lugares: 'Acima de 40 lugares',
    descricao: 'Solução completa para grandes grupos e excursões, preparada para longos trajetos.',
    icone: 'bus',
  },
  {
    nome: 'Veículos Blindados',
    lugares: 'Sob consulta',
    descricao:
      'Segurança reforçada para clientes que necessitam de proteção adicional, sem abrir mão do conforto e da discrição.',
    icone: 'shield',
  },
];

export const RESERVA = {
  titulo: 'Reserve Agora!',
  descricao:
    'Informe o trajeto, a data e o horário desejado. Nossa equipe confirmará a disponibilidade e retornará rapidamente com a confirmação da sua reserva.',
  cta: {
    rotulo: 'Reserve Agora!',
    mensagem: MENSAGEM_PADRAO,
  },
} as const;

export type TipoServicoId = 'ida' | 'ida-volta' | 'disposicao';

export const RESERVA_FORM = {
  tipoLegenda: 'Tipo de serviço',
  tiposServico: [
    { id: 'ida' as TipoServicoId, rotulo: 'Somente Ida', icone: 'arrow-right' },
    { id: 'ida-volta' as TipoServicoId, rotulo: 'Ida e Volta', icone: 'swap' },
    { id: 'disposicao' as TipoServicoId, rotulo: 'À Disposição', icone: 'clock' },
  ],
  grupos: {
    trajeto: 'Trajeto',
    passageiro: 'Seus dados',
  },
  campos: {
    embarque: {
      rotulo: 'Endereço de embarque',
      placeholder: 'Rua e número, aeroporto ou hotel',
    },
    destino: {
      rotulo: 'Endereço de destino',
      placeholder: 'Para onde vamos?',
    },
    data: { rotulo: 'Data' },
    hora: { rotulo: 'Horário' },
    horaInicio: { rotulo: 'Horário de início' },
    dataRetorno: { rotulo: 'Data do retorno' },
    horaRetorno: { rotulo: 'Horário do retorno' },
    nome: { rotulo: 'Seu nome', placeholder: 'Nome completo' },
    passageiros: { rotulo: 'Passageiros' },
    observacoes: {
      rotulo: 'Observações',
      placeholder: 'Voo, bagagens, cadeirinha infantil, paradas extras…',
      placeholderDisposicao: 'Quantas horas ou até que horário? Compromissos previstos…',
    },
  },
  passageirosOpcoes: ['1', '2', '3', '4', '5', '6', '7', '8 ou mais'],
  opcional: 'opcional',
  erroObrigatorio: 'Preencha este campo',
  erroDataPassada: 'Escolha uma data a partir de hoje',
  erroRetornoAntes: 'O retorno deve ser após a ida',
  botao: 'Reservar pelo WhatsApp',
  aviso: 'Você será direcionado ao WhatsApp com os dados da reserva já preenchidos.',
} as const;

export const MARCA = {
  nomeCurto: 'YCar Executive',
  nomeCompleto: 'YCAR EXECUTIVE',
  dominio: 'https://ycarexecutive.com.br',
} as const;
