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

export interface ItemMenu {
  rotulo: string;
  destino: string;
  externo?: boolean;
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
  titulo: 'Transporte Executivo com excelência, conforto e pontualidade em cada detalhe.',
  subtitulo:
    'Na YCAR EXECUTIVE você encontra motoristas profissionais, veículos de alto padrão e um atendimento personalizado para tornar cada trajeto mais seguro, confortável e produtivo.',
  ctaPrimario: {
    rotulo: 'Reserve Agora!',
    mensagem: MENSAGEM_PADRAO,
  },
  ctaSecundario: { rotulo: 'Conhecer os serviços', ancora: '#servicos' },
} as const;

export const SERVICOS_INTRO = {
  titulo: 'Garanta sua Viagem com Segurança, Conforto e Pontualidade',
  descricao:
    'Nossa frota é composta por veículos Sedan e SUV, incluindo opções blindadas, além de MiniVans, Vans, Micro-Ônibus e Ônibus.',
} as const;

export const SERVICOS: Servico[] = [
  {
    titulo: 'Transfer Executivo',
    descricao:
      'Soluções completas em transporte executivo para aeroportos, hotéis, empresas, eventos, carro de noiva, casamentos, congressos, feiras, shows, viagens corporativas e particulares.',
    icone: 'briefcase',
  },
  {
    titulo: 'Receptivo Aeroporto',
    descricao:
      'Chegue com tranquilidade. Nós estaremos esperando por você nos aeroportos de São Paulo, no horário da sua chegada, para um transporte executivo com excelência.',
    icone: 'plane',
  },
  {
    titulo: 'Viagens',
    descricao:
      'Atendemos viagens para o interior paulista, litoral e cidades de outros estados, oferecendo transporte executivo de alto padrão para qualquer destino.',
    icone: 'road',
  },
  {
    titulo: 'Operação à Disposição',
    descricao:
      'Tenha um Motorista Executivo à sua disposição para múltiplos compromissos, com total comodidade, flexibilidade e atendimento personalizado ao longo do dia.',
    icone: 'clock',
  },
  {
    titulo: 'City Tour',
    descricao:
      'Transforme sua viagem em uma experiência inesquecível. Realizamos passeios turísticos por São Paulo, Aparecida, Campos do Jordão, Holambra, Santos, São Roque e diversos outros destinos, com conforto, segurança e atendimento de excelência.',
    icone: 'pin',
  },
  {
    titulo: 'Motoristas Bilíngues',
    descricao:
      'Nossa equipe oferece atendimento em seu idioma, garantindo mais conforto, praticidade e tranquilidade durante toda a sua experiência de transporte.',
    icone: 'globe',
  },
  {
    titulo: 'Veículos Blindados',
    descricao:
      'Disponibilizamos veículos blindados com monitoramento 24 horas, proporcionando máxima segurança, discrição e tranquilidade em todos os deslocamentos.',
    icone: 'shield',
  },
  {
    titulo: 'Experiência Personalizada',
    descricao:
      'Conte com um serviço de transporte executivo incluindo suas preferências. Planejamos cada detalhe conforme a sua necessidade para oferecer uma experiência exclusiva, segura e eficiente.',
    icone: 'star',
  },
];

export const QUEM_SOMOS = {
  titulo: 'Excelência em Transporte Executivo em São Paulo',
  paragrafos: [
    'Somos uma empresa especializada em Transporte Executivo. Na YCAR EXECUTIVE, oferecemos uma experiência de transporte diferenciada, unindo qualidade, sofisticação e segurança em cada trajeto.',
    'Contamos com motoristas profissionais, experientes e altamente capacitados, prontos para atender clientes que valorizam discrição, conforto e um atendimento personalizado.',
    'Nossa frota é composta por veículos modernos, revisados e preparados para proporcionar uma viagem tranquila, segura e agradável.',
    'Atendemos por reserva de tempo e diária com motorista à disposição, transfers, aeroportos, viagens, eventos, reuniões, hotéis e deslocamentos executivos, sempre com pontualidade, responsabilidade e atenção aos detalhes.',
    'Escolher a YCAR EXECUTIVE é optar por um serviço Premium, pensado para transformar cada viagem em uma experiência de alto padrão.',
  ],
  tagline: 'Seu destino, nossa prioridade.',
  chamada: 'Reserve agora e viaje com quem entende de Transporte Executivo.',
} as const;

export const PASSOS: Passo[] = [
  {
    titulo: 'Agendamento da Operação',
    descricao:
      'Realize seu agendamento de forma rápida e prática. Em seguida, você receberá a confirmação da reserva, com todas as informações do veículo, do motorista e do serviço contratado, para viajar com total tranquilidade.',
  },
  {
    titulo: 'Embarque com Tranquilidade',
    descricao:
      'No dia e horário agendados, seu motorista estará no local combinado com antecedência, preparado para recebê-lo com cordialidade, auxiliar com as bagagens e conduzir sua viagem com conforto, segurança e excelência.',
  },
  {
    titulo: 'Experiência Premium',
    descricao:
      'Desfrute de uma viagem com conforto, segurança e exclusividade em veículos executivos modernos, equipados com ar-condicionado, Wi-Fi, água mineral, mimos de bordo e atendimento personalizado. Cada detalhe é planejado para proporcionar uma experiência diferenciada do embarque ao destino.',
  },
  {
    titulo: 'Pagamento com Total Conveniência',
    descricao:
      'Escolha a forma de pagamento que melhor atende às suas necessidades. Aceitamos PIX, cartões de débito e crédito, além de link de pagamento, garantindo uma experiência simples, rápida e segura.',
  },
];

export const FROTA_INTRO = {
  titulo: 'Frota de Veículos Executiva',
  descricao:
    'Contamos com uma frota de veículos executiva moderna e diversificada, escolhida para proporcionar conforto, segurança e praticidade em todos os deslocamentos. Do atendimento corporativo aos momentos especiais, oferecemos veículos preparados para entregar uma experiência premium do embarque ao destino.',
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
      'A opção perfeita para grupos, eventos, turismo e traslados corporativos, com amplo espaço e máximo conforto para todos os passageiros.',
    icone: 'van',
  },
  {
    nome: 'Micro-Ônibus Executivo',
    lugares: '20 a 30 lugares',
    descricao:
      'Ideal para grupos, eventos corporativos, passeios, transfers e viagens. Oferece conforto, segurança e praticidade, com amplo espaço interno e estrutura adequada para transportar passageiros com tranquilidade.',
    icone: 'bus',
  },
  {
    nome: 'Ônibus Executivo',
    lugares: 'Acima de 40 lugares',
    descricao:
      'Uma solução completa para grandes grupos, excursões, eventos e operações corporativas. Veículos preparados para longos trajetos, proporcionando conforto, segurança e eficiência em cada deslocamento.',
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
