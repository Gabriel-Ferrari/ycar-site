/**
 * Textos fixos da interface (rótulos, aria-labels, formulário) por idioma.
 * O conteúdo editorial fica em conteudo*.json e é editado pelo painel; estes aqui
 * mudam só com código. O tipo do português obriga EN e ES a ter as mesmas chaves.
 */

const pt = {
  sobretitulo: {
    frota: 'Frota',
    servicos: 'Serviços',
    quemSomos: 'Quem Somos',
    comoTrabalhamos: 'Como Trabalhamos',
    reserva: 'Reserva',
  },
  cabecalho: {
    voltarInicio: 'YCar Executive — voltar ao início',
    secoes: 'Seções do site',
    reservarCurto: 'Reservar',
    abrirMenu: 'Abrir menu',
    fecharMenu: 'Fechar menu',
    menuPrincipal: 'Menu principal',
    contato: 'Contato',
    idioma: 'Idioma',
  },
  whatsappFab: 'Abrir conversa no WhatsApp',
  fotoQuemSomos: 'Profissional de terno escuro com braços cruzados e olhar confiante',
  rodape: {
    direitos: 'Todos os direitos reservados.',
    links: 'Links do rodapé',
  },
  reservaForm: {
    tipoLegenda: 'Tipo de serviço',
    tipos: { ida: 'Somente ida', idaVolta: 'Ida e volta', disposicao: 'À disposição' },
    campos: {
      embarque: { rotulo: 'Embarque', placeholder: 'Endereço, aeroporto ou hotel' },
      destino: { rotulo: 'Destino', placeholder: 'Para onde vamos?' },
      embarqueVolta: { rotulo: 'Embarque da volta', placeholder: 'Onde buscamos na volta?' },
      destinoVolta: { rotulo: 'Destino da volta', placeholder: 'Para onde vamos na volta?' },
      data: { rotulo: 'Data' },
      hora: { rotulo: 'Horário' },
      passageiros: { rotulo: 'Passageiros' },
    },
    oitoOuMais: '8 ou mais',
    mesmoTrajeto: 'A volta é pelo mesmo trajeto (do destino de volta ao embarque)',
    voltaMesmoTrajeto: 'mesmo trajeto, do destino de volta ao embarque',
    aviso: 'O WhatsApp abre com os dados da reserva já preenchidos.',
    agendaLink: 'Prefere escolher o horário sozinho? Reserve pela agenda online',
    // Atribuição exigida pela licença dos dados (ODbL) ao mostrar resultados do OpenStreetMap
    creditoEnderecos: 'Endereços: © OpenStreetMap',
    sugestaoUma: '1 sugestão de endereço',
    sugestoesVarias: 'sugestões de endereço',
    // Rótulos da mensagem que chega no WhatsApp
    mensagem: {
      servico: 'Serviço',
      embarque: 'Embarque',
      destino: 'Destino',
      data: 'Data',
      as: 'às',
      volta: 'Volta',
      passageiros: 'Passageiros',
    },
  },
};

export type TextosUi = typeof pt;

const en: TextosUi = {
  sobretitulo: {
    frota: 'Fleet',
    servicos: 'Services',
    quemSomos: 'About Us',
    comoTrabalhamos: 'How We Work',
    reserva: 'Booking',
  },
  cabecalho: {
    voltarInicio: 'YCar Executive — back to top',
    secoes: 'Site sections',
    reservarCurto: 'Book',
    abrirMenu: 'Open menu',
    fecharMenu: 'Close menu',
    menuPrincipal: 'Main menu',
    contato: 'Contact',
    idioma: 'Language',
  },
  whatsappFab: 'Open a WhatsApp chat',
  fotoQuemSomos: 'Professional in a dark suit with arms crossed and a confident look',
  rodape: {
    direitos: 'All rights reserved.',
    links: 'Footer links',
  },
  reservaForm: {
    tipoLegenda: 'Type of service',
    tipos: { ida: 'One way', idaVolta: 'Round trip', disposicao: 'Hourly' },
    campos: {
      embarque: { rotulo: 'Pickup', placeholder: 'Address, airport or hotel' },
      destino: { rotulo: 'Destination', placeholder: 'Where are we going?' },
      embarqueVolta: { rotulo: 'Return pickup', placeholder: 'Where do we pick you up?' },
      destinoVolta: {
        rotulo: 'Return destination',
        placeholder: 'Where are we going on the way back?',
      },
      data: { rotulo: 'Date' },
      hora: { rotulo: 'Time' },
      passageiros: { rotulo: 'Passengers' },
    },
    oitoOuMais: '8 or more',
    mesmoTrajeto: 'The return follows the same route (from the destination back to the pickup)',
    voltaMesmoTrajeto: 'same route, from the destination back to the pickup',
    aviso: 'WhatsApp opens with your booking details already filled in.',
    agendaLink: 'Prefer to pick a time yourself? Book through the online calendar',
    creditoEnderecos: 'Addresses: © OpenStreetMap',
    sugestaoUma: '1 address suggestion',
    sugestoesVarias: 'address suggestions',
    mensagem: {
      servico: 'Service',
      embarque: 'Pickup',
      destino: 'Destination',
      data: 'Date',
      as: 'at',
      volta: 'Return',
      passageiros: 'Passengers',
    },
  },
};

const es: TextosUi = {
  sobretitulo: {
    frota: 'Flota',
    servicos: 'Servicios',
    quemSomos: 'Quiénes Somos',
    comoTrabalhamos: 'Cómo Trabajamos',
    reserva: 'Reserva',
  },
  cabecalho: {
    voltarInicio: 'YCar Executive — volver al inicio',
    secoes: 'Secciones del sitio',
    reservarCurto: 'Reservar',
    abrirMenu: 'Abrir menú',
    fecharMenu: 'Cerrar menú',
    menuPrincipal: 'Menú principal',
    contato: 'Contacto',
    idioma: 'Idioma',
  },
  whatsappFab: 'Abrir conversación en WhatsApp',
  fotoQuemSomos: 'Profesional de traje oscuro con los brazos cruzados y mirada segura',
  rodape: {
    direitos: 'Todos los derechos reservados.',
    links: 'Enlaces del pie de página',
  },
  reservaForm: {
    tipoLegenda: 'Tipo de servicio',
    tipos: { ida: 'Solo ida', idaVolta: 'Ida y vuelta', disposicao: 'A disposición' },
    campos: {
      embarque: { rotulo: 'Recogida', placeholder: 'Dirección, aeropuerto u hotel' },
      destino: { rotulo: 'Destino', placeholder: '¿A dónde vamos?' },
      embarqueVolta: {
        rotulo: 'Recogida de vuelta',
        placeholder: '¿Dónde lo recogemos a la vuelta?',
      },
      destinoVolta: { rotulo: 'Destino de vuelta', placeholder: '¿A dónde vamos a la vuelta?' },
      data: { rotulo: 'Fecha' },
      hora: { rotulo: 'Hora' },
      passageiros: { rotulo: 'Pasajeros' },
    },
    oitoOuMais: '8 o más',
    mesmoTrajeto: 'La vuelta es por el mismo trayecto (del destino de vuelta a la recogida)',
    voltaMesmoTrajeto: 'mismo trayecto, del destino de vuelta a la recogida',
    aviso: 'WhatsApp se abre con los datos de la reserva ya completados.',
    agendaLink: '¿Prefiere elegir el horario usted mismo? Reserve en la agenda en línea',
    creditoEnderecos: 'Direcciones: © OpenStreetMap',
    sugestaoUma: '1 sugerencia de dirección',
    sugestoesVarias: 'sugerencias de dirección',
    mensagem: {
      servico: 'Servicio',
      embarque: 'Recogida',
      destino: 'Destino',
      data: 'Fecha',
      as: 'a las',
      volta: 'Vuelta',
      passageiros: 'Pasajeros',
    },
  },
};

export const TEXTOS_UI = { pt, en, es };
