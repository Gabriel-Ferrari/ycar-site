// Painel do site: lê conteudo.json pela API, monta o formulário a partir de SECOES e
// publica tudo de uma vez (texto + fotos novas). O Worker transforma isso num commit
// e o Cloudflare refaz o site. Todo texto entra no DOM via textContent/value, nunca HTML.
//
// Prévia: o próprio site roda num iframe (/?previa=1, mesma origem) e recebe o conteúdo
// em edição por window.ycarPrevia (ver src/main.ts). Clicar na prévia abre o campo certo;
// focar um campo destaca o trecho na prévia.

/**
 * Desenho dos ícones — copiado de src/app/components/icon.ts (manter igual ao mudar lá).
 * Só os que fazem sentido em card, mais os usados nos títulos das seções.
 */
const SVG_ICONES = {
  briefcase:
    '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
  plane:
    '<path fill="currentColor" stroke="none" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>',
  road: '<path d="M4 20 8.5 4"/><path d="M20 20 15.5 4"/><path d="M12 7v2.5"/><path d="M12 13v2.5"/><path d="M12 19v1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  watch:
    '<circle cx="12" cy="12" r="6"/><path d="M12 9.5V12l1.8 1.2"/><path d="M9.5 6.5 10 3h4l.5 3.5"/><path d="M9.5 17.5 10 21h4l.5-3.5"/>',
  pin: '<path d="M12 21s-6.5-5.4-6.5-10a6.5 6.5 0 0 1 13 0c0 4.6-6.5 10-6.5 10z"/><circle cx="12" cy="11" r="2.5"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.4 3.8 5.6 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.6-3.8-9s1.3-6.6 3.8-9z"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
  star: '<path d="m12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.4 20l1.3-6.2L3 9.5l6.3-.7z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5"/>',
  document:
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/>',
  car: '<path d="M4 16v-4l2-5a2 2 0 0 1 1.9-1.3h8.2A2 2 0 0 1 18 7l2 5v4"/><path d="M4 12h16"/><path d="M6.5 16h.01"/><path d="M17.5 16h.01"/><path d="M4 16h16v2.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V18h-9v.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/>',
  van: '<path d="M2 8a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v9H2z"/><path d="M15 10h3.6a1 1 0 0 1 .9.55L21.5 14a1 1 0 0 1 .1.45V17H15"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/><path d="M5 10h4v3H5z"/>',
  bus: '<path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13H4z"/><path d="M4 11h16"/><path d="M4 18v1.5a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1V18"/><path d="M16.5 18v1.5a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1V18"/><path d="M8 15h.01"/><path d="M16 15h.01"/>',
  whatsapp:
    '<path fill="currentColor" stroke="none" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>',
  menu: '<path d="M4 8h16"/><path d="M4 16h16"/>',
};

/** Ícones que dá para escolher num card (ver IconName em src/app/components/icon.ts). */
const ICONES = {
  briefcase: 'Maleta',
  plane: 'Avião',
  road: 'Estrada',
  clock: 'Relógio',
  watch: 'Relógio de pulso',
  pin: 'Alfinete de mapa',
  globe: 'Globo',
  shield: 'Escudo',
  star: 'Estrela',
  user: 'Pessoa',
  document: 'Documento',
  car: 'Carro',
  van: 'Van',
  bus: 'Ônibus',
};

/** Larguras geradas para cada foto — espelha LARGURAS_CARD em site-content.ts (+ 900 do arquivo principal). */
const LARGURAS_FOTO = [900, 672, 560, 400];

/** Larguras da prévia, em px de tela de verdade. */
const APARELHOS = { celular: 390, computador: 1280 };

/**
 * `previa.alvo`: trecho do site que a seção edita (destacado ao focar um campo).
 * `previa.clique`: o que, clicado na prévia, abre esta seção (padrão: o próprio alvo).
 * `previa.itens`: os cartões da lista da seção, na mesma ordem dos itens do formulário.
 * A ordem importa no clique: a primeira seção que contém o elemento vence.
 */
const SECOES = [
  {
    titulo: 'WhatsApp e contato',
    descricao: 'Número, mensagem automática, link de reservas, Instagram e horário.',
    icone: 'whatsapp',
    previa: { alvo: '.contato__canais', clique: '.contato__canais, .fab, .footer__info' },
    campos: [
      {
        campo: 'contato.whatsapp',
        rotulo: 'Número do WhatsApp',
        tipo: 'telefone',
        ajuda: 'Com DDD. Ex.: (11) 96542-0041. É para este número que os clientes mandam mensagem.',
      },
      {
        campo: 'contato.mensagemWhatsapp',
        rotulo: 'Mensagem que já vem escrita no WhatsApp',
        tipo: 'texto-longo',
        ajuda: 'Quando o cliente toca no botão do WhatsApp, a conversa abre com este texto pronto.',
      },
      {
        campo: 'reserva.plataformaUrl',
        rotulo: 'Link da agenda de reservas',
        tipo: 'link',
        opcional: true,
        ajuda:
          'Deixe vazio para os botões de reserva abrirem o WhatsApp. Quando tiver uma agenda online (ex.: YouCanBook.me), cole o link aqui — começa com https://',
      },
      {
        campo: 'contato.instagram',
        rotulo: 'Instagram',
        tipo: 'instagram',
        ajuda: 'Só o nome do perfil. Ex.: ycarexecutive',
      },
      {
        campo: 'contato.email',
        rotulo: 'E-mail',
        tipo: 'email',
        opcional: true,
        ajuda: 'Deixe vazio para não mostrar no site.',
      },
      { campo: 'contato.horario', rotulo: 'Horário de atendimento' },
      { campo: 'contato.cidade', rotulo: 'Cidade', ajuda: 'Aparece no rodapé.' },
      {
        campo: 'contato.cnpj',
        rotulo: 'CNPJ',
        opcional: true,
        ajuda: 'Aparece no rodapé. Deixe vazio para não mostrar.',
      },
    ],
  },
  {
    titulo: 'Topo do site',
    descricao: 'A primeira coisa que o cliente vê ao abrir o site.',
    icone: 'star',
    previa: { alvo: '#inicio' },
    campos: [
      { campo: 'inicio.overline', rotulo: 'Frase pequena acima do título' },
      { campo: 'inicio.titulo', rotulo: 'Título principal', tipo: 'texto-longo' },
      { campo: 'inicio.subtitulo', rotulo: 'Texto abaixo do título', tipo: 'texto-longo' },
      {
        campo: 'reserva.botao',
        rotulo: 'Texto dos botões de reserva',
        ajuda: 'Vale para todos os botões de reserva do site. Use um texto curto.',
      },
    ],
  },
  {
    titulo: 'Menu',
    descricao: 'Os nomes dos links no topo e no rodapé.',
    icone: 'menu',
    previa: { alvo: '.header', clique: '.header, .footer__nav' },
    campos: [
      { campo: 'menu.inicio', rotulo: 'Link para o início' },
      { campo: 'menu.servicos', rotulo: 'Link para Serviços' },
      { campo: 'menu.quemSomos', rotulo: 'Link para Quem Somos' },
      { campo: 'menu.comoTrabalhamos', rotulo: 'Link para Como Trabalhamos' },
      { campo: 'menu.frota', rotulo: 'Link para a Frota' },
      { campo: 'menu.redesSociais', rotulo: 'Link para o Instagram' },
    ],
  },
  {
    titulo: 'Serviços',
    descricao: 'Os cartões com foto de cada serviço oferecido.',
    icone: 'briefcase',
    previa: { alvo: '#servicos', itens: '.card' },
    campos: [
      { campo: 'servicos.titulo', rotulo: 'Título da seção' },
      { campo: 'servicos.descricao', rotulo: 'Texto abaixo do título', tipo: 'texto-longo' },
      {
        campo: 'servicos.itens',
        tipo: 'lista',
        rotuloItem: 'serviço',
        campos: [
          { campo: 'titulo', rotulo: 'Nome do serviço' },
          { campo: 'descricao', rotulo: 'Descrição', tipo: 'texto-longo' },
          { campo: 'icone', rotulo: 'Ícone', tipo: 'icone' },
          {
            campo: 'imagem',
            rotulo: 'Foto',
            tipo: 'foto',
            pasta: 'servicos',
            ajuda: 'Prefira foto em pé (vertical), com as pessoas na parte de cima.',
          },
        ],
      },
    ],
  },
  {
    titulo: 'Quem somos',
    descricao: 'A apresentação da empresa.',
    icone: 'user',
    previa: { alvo: '#quem-somos', itens: '.sobre__paragrafo' },
    campos: [
      { campo: 'quemSomos.titulo', rotulo: 'Título', tipo: 'texto-longo' },
      { campo: 'quemSomos.paragrafos', tipo: 'lista', rotuloItem: 'parágrafo' },
      { campo: 'quemSomos.tagline', rotulo: 'Frase de destaque' },
      { campo: 'quemSomos.chamada', rotulo: 'Frase acima do botão', tipo: 'texto-longo' },
    ],
  },
  {
    titulo: 'Como trabalhamos',
    descricao: 'Os passos numerados, da reserva ao destino.',
    icone: 'clock',
    previa: { alvo: '#como-trabalhamos', itens: '.passo' },
    campos: [
      { campo: 'comoTrabalhamos.titulo', rotulo: 'Título da seção' },
      {
        campo: 'comoTrabalhamos.passos',
        tipo: 'lista',
        rotuloItem: 'passo',
        campos: [
          { campo: 'titulo', rotulo: 'Título do passo' },
          { campo: 'descricao', rotulo: 'Descrição', tipo: 'texto-longo' },
        ],
      },
    ],
  },
  {
    titulo: 'Frota',
    descricao: 'Os cartões com foto de cada tipo de veículo.',
    icone: 'car',
    previa: { alvo: '#frota', itens: '.card' },
    campos: [
      { campo: 'frota.titulo', rotulo: 'Título da seção' },
      { campo: 'frota.descricao', rotulo: 'Texto abaixo do título', tipo: 'texto-longo' },
      {
        campo: 'frota.itens',
        tipo: 'lista',
        rotuloItem: 'veículo',
        campos: [
          { campo: 'nome', rotulo: 'Tipo de veículo' },
          { campo: 'lugares', rotulo: 'Quantos lugares', ajuda: 'Ex.: 3 a 4 lugares' },
          { campo: 'descricao', rotulo: 'Descrição', tipo: 'texto-longo' },
          { campo: 'icone', rotulo: 'Ícone', tipo: 'icone' },
          {
            campo: 'imagem',
            rotulo: 'Foto',
            tipo: 'foto',
            pasta: 'frota',
            ajuda: 'Prefira foto deitada (horizontal), com o veículo do lado direito.',
          },
        ],
      },
    ],
  },
  {
    titulo: 'Seção de reserva',
    descricao: 'O bloco final, com o botão grande da agenda.',
    icone: 'document',
    previa: { alvo: '#reserva' },
    campos: [
      { campo: 'reserva.titulo', rotulo: 'Título' },
      { campo: 'reserva.descricao', rotulo: 'Texto', tipo: 'texto-longo' },
      { campo: 'reserva.botaoPlataforma', rotulo: 'Texto do botão grande' },
    ],
  },
];

const estado = {
  conteudo: null,
  versao: null,
  /** JSON do que está publicado, para saber se há alteração pendente */
  publicado: '',
  /** Fotos preparadas e ainda não publicadas: caminho → base64 */
  fotos: new Map(),
  /** Mesmas fotos para a prévia: caminho → blob: URL */
  previas: new Map(),
  publicando: false,
  aparelho: 'celular',
  previaPronta: false,
};

const $ = (id) => document.getElementById(id);
let proximoId = 0;

// ---------- Telas ----------

function mostrar(tela) {
  for (const id of ['tela-carregando', 'tela-login', 'editor-app']) $(id).hidden = id !== tela;
  $('sair').hidden = tela !== 'editor-app';
}

async function iniciar() {
  const resposta = await api('GET', '/api/conteudo');
  if (resposta.status === 401) return mostrar('tela-login');
  if (resposta.erro) return erroGeral(resposta.erro);
  estado.conteudo = resposta.conteudo;
  estado.versao = resposta.versao;
  estado.publicado = JSON.stringify(resposta.conteudo);
  desenharEditor();
  mostrar('editor-app');
  iniciarPrevia();
  atualizarStatus();
}

function erroGeral(mensagem) {
  const tela = $('tela-carregando');
  tela.textContent = mensagem;
  tela.className = 'mensagem mensagem--erro carregando';
  mostrar('tela-carregando');
}

$('tela-login').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const botao = evento.submitter;
  botao.disabled = true;
  const resposta = await api('POST', '/api/entrar', { senha: $('senha').value });
  botao.disabled = false;
  if (!resposta.ok) {
    $('erro-login').textContent = resposta.erro;
    return $('senha').select();
  }
  $('senha').value = '';
  $('erro-login').textContent = '';
  // Sessão expirou no meio da edição: volta para o que estava sendo editado
  if (estado.conteudo) {
    mostrar('editor-app');
    return atualizarStatus('Pronto, pode tocar em Salvar e publicar de novo.');
  }
  mostrar('tela-carregando');
  iniciar();
});

$('sair').addEventListener('click', async () => {
  if (alterado() && !confirm('Você tem alterações que não foram publicadas. Sair mesmo assim?')) return;
  await api('POST', '/api/sair');
  location.reload();
});

window.addEventListener('beforeunload', (evento) => {
  if (alterado()) evento.preventDefault();
});

// ---------- Formulário ----------

function desenharEditor() {
  const secoes = SECOES.map((secao, i) => {
    const bloco = el('details', 'secao');
    bloco.dataset.secao = i;
    bloco.open = i === 0;
    const resumo = el('summary');
    const textos = el('span', 'secao__textos');
    textos.append(el('span', 'secao__titulo', secao.titulo), el('span', 'secao__descricao', secao.descricao));
    const icone = el('span', 'secao__icone');
    icone.append(svgIcone(secao.icone));
    resumo.append(icone, textos);
    bloco.append(resumo);

    const corpo = el('div', 'secao__corpo');
    for (const def of secao.campos) {
      const [pai, chave] = separar(def.campo);
      corpo.append(def.tipo === 'lista' ? criarLista(def, pai[chave]) : criarCampo(def, pai, chave));
    }
    bloco.append(corpo);
    // "toggle" chega depois do foco: se um campo já foi focado (clique na prévia), ele manda
    bloco.addEventListener('toggle', () => {
      if (bloco.open && !corpo.contains(document.activeElement)) mostrarNaPrevia(i);
    });
    return bloco;
  });
  $('secoes').replaceChildren(...secoes);
}

/** 'contato.whatsapp' → [estado.conteudo.contato, 'whatsapp'] */
function separar(caminho) {
  const chaves = caminho.split('.');
  const chave = chaves.pop();
  return [chaves.reduce((objeto, k) => objeto[k], estado.conteudo), chave];
}

function criarCampo(def, alvo, chave) {
  if (def.tipo === 'foto') return criarCampoFoto(def, alvo, chave);
  if (def.tipo === 'icone') return criarCampoIcone(def, alvo, chave);

  const id = `campo-${++proximoId}`;
  const bloco = el('div', 'campo');
  const rotulo = el('label', 'campo__rotulo', def.rotulo);
  rotulo.htmlFor = id;
  bloco.append(rotulo);

  let entrada;
  if (def.tipo === 'texto-longo') {
    entrada = el('textarea');
    entrada.rows = 3;
  } else {
    entrada = el('input');
    entrada.type = { telefone: 'tel', link: 'url', email: 'email' }[def.tipo] ?? 'text';
    if (def.tipo === 'telefone') entrada.autocomplete = 'tel';
  }
  entrada.id = id;
  entrada.required = !def.opcional;
  entrada.value = def.tipo === 'telefone' ? formatarTelefone(alvo[chave]) : alvo[chave];

  entrada.addEventListener('input', () => {
    alvo[chave] = normalizar(def.tipo, entrada);
    atualizarStatus();
  });
  // Valida já o valor inicial (ex.: link antigo sem https)
  normalizar(def.tipo, entrada);

  if (def.ajuda) {
    const ajuda = el('p', 'campo__ajuda', def.ajuda);
    ajuda.id = `${id}-ajuda`;
    entrada.setAttribute('aria-describedby', ajuda.id);
    bloco.append(ajuda);
  }
  bloco.append(entrada);
  return bloco;
}

/** Converte o que foi digitado no formato salvo e marca o campo inválido quando preciso. */
function normalizar(tipo, entrada) {
  const valor = entrada.value.trim();
  let mensagem = '';
  let resultado = valor;

  if (tipo === 'telefone') {
    resultado = valor.replace(/\D/g, '');
    // Com DDI são 12–13 dígitos; sem, 10–11 (DDD + número)
    if (!/^55\d{10,11}$/.test(resultado)) resultado = `55${resultado}`;
    if (!/^55\d{10,11}$/.test(resultado)) mensagem = 'Coloque o DDD e o número completo.';
  } else if (tipo === 'instagram') {
    resultado = valor
      .replace(/^.*instagram\.com\//i, '')
      .replace(/^@/, '')
      .split(/[/?#]/)[0];
    if (!/^[\w.]{1,30}$/.test(resultado)) mensagem = 'Use só o nome do perfil, ex.: ycarexecutive';
  } else if (tipo === 'link') {
    if (valor && !/^https:\/\/\S+$/.test(valor)) mensagem = 'O link precisa começar com https://';
  }

  entrada.setCustomValidity(mensagem);
  return resultado;
}

/** Mostra o ícone atual; "Trocar" abre a grade com todos, desenhados como no site. */
function criarCampoIcone(def, alvo, chave) {
  const bloco = el('div', 'campo');
  const escolha = el('details', 'icones');
  const resumo = el('summary', 'icones__atual');
  const desenharAtual = () => {
    const nome = el('span', 'icones__nome', ICONES[alvo[chave]] ?? alvo[chave]);
    resumo.replaceChildren(el('span', 'campo__rotulo', `${def.rotulo}:`), svgIcone(alvo[chave]), nome, el('span', 'icones__trocar', 'Trocar'));
  };
  desenharAtual();

  const grade = el('div', 'icones__grade');
  grade.setAttribute('role', 'radiogroup');
  grade.setAttribute('aria-label', def.rotulo);
  const grupo = `icone-${++proximoId}`;
  for (const [valor, nome] of Object.entries(ICONES)) {
    const opcao = el('label', 'icone');
    const radio = el('input');
    radio.type = 'radio';
    radio.name = grupo;
    radio.value = valor;
    radio.checked = alvo[chave] === valor;
    radio.addEventListener('change', () => {
      alvo[chave] = valor;
      desenharAtual();
      escolha.open = false;
      resumo.focus();
      atualizarStatus();
    });
    opcao.append(radio, svgIcone(valor), el('span', 'icone__nome', nome));
    grade.append(opcao);
  }
  escolha.append(resumo, grade);
  bloco.append(escolha);
  return bloco;
}

function criarLista(def, lista) {
  const bloco = el('div', 'lista');

  const desenhar = (foco) => {
    const itens = lista.map((item, i) => {
      const cartao = el('fieldset', 'item');
      cartao.dataset.item = i;
      cartao.append(el('legend', 'item__titulo', `${maiuscula(def.rotuloItem)} ${i + 1}`));

      if (def.campos) {
        for (const sub of def.campos) cartao.append(criarCampo(sub, item, sub.campo));
      } else {
        cartao.append(criarCampo({ rotulo: 'Texto', tipo: 'texto-longo' }, lista, i));
      }

      const acoes = el('div', 'item__acoes');
      acoes.append(
        botao('↑ Subir', 'subir', i === 0, () => mover(i, i - 1)),
        botao('↓ Descer', 'descer', i === lista.length - 1, () => mover(i, i + 1)),
        botao(`Remover ${def.rotuloItem}`, 'remover', lista.length === 1, () => {
          if (!confirm(`Remover ${def.rotuloItem} ${i + 1} do site?`)) return;
          lista.splice(i, 1);
          desenhar({ indice: Math.max(0, i - 1), acao: 'adicionar' });
          atualizarStatus();
        }),
      );
      acoes.lastChild.classList.add('botao--perigo');
      cartao.append(acoes);
      return cartao;
    });

    const adicionar = botao(`+ Adicionar ${def.rotuloItem}`, 'adicionar', lista.length >= 30, () => {
      lista.push(novoItem(lista[0]));
      desenhar({ indice: lista.length - 1, acao: 'primeiro-campo' });
      atualizarStatus();
    });
    bloco.replaceChildren(...itens, adicionar);

    // Depois de redesenhar, o foco volta para onde a pessoa estava
    if (!foco) return;
    const cartao = bloco.querySelectorAll('.item')[foco.indice];
    const alvo =
      foco.acao === 'primeiro-campo'
        ? cartao?.querySelector('input, textarea')
        : foco.acao === 'adicionar'
          ? adicionar
          : cartao?.querySelector(`[data-acao="${foco.acao}"]:not(:disabled)`) ??
            cartao?.querySelector('[data-acao]:not(:disabled)');
    alvo?.focus();
  };

  const mover = (de, para) => {
    lista.splice(para, 0, lista.splice(de, 1)[0]);
    desenhar({ indice: para, acao: para < de ? 'subir' : 'descer' });
    atualizarStatus();
  };

  desenhar();
  return bloco;
}

/** Item novo com os mesmos campos do primeiro, vazios (o ícone herda para não ficar sem). */
function novoItem(modelo) {
  if (typeof modelo === 'string') return '';
  return Object.fromEntries(
    Object.keys(modelo).map((chave) => [chave, chave === 'icone' ? modelo.icone : '']),
  );
}

// ---------- Fotos ----------

function criarCampoFoto(def, alvo, chave) {
  const id = `campo-${++proximoId}`;
  const bloco = el('div', 'campo campo--foto');
  bloco.append(el('span', 'campo__rotulo', def.rotulo));
  if (def.ajuda) bloco.append(el('p', 'campo__ajuda', def.ajuda));

  const previa = el('img', 'foto__previa');
  previa.alt = '';
  previa.hidden = !alvo[chave];
  if (alvo[chave]) previa.src = estado.previas.get(alvo[chave]) ?? alvo[chave];

  const entrada = el('input', 'invisivel');
  entrada.type = 'file';
  entrada.accept = 'image/*';
  entrada.id = id;
  const validar = () => entrada.setCustomValidity(alvo[chave] ? '' : 'Escolha uma foto.');
  validar();

  const escolher = el('label', 'botao', alvo[chave] ? 'Trocar foto' : 'Escolher foto');
  escolher.htmlFor = id;
  const aviso = el('p', 'campo__ajuda');
  aviso.setAttribute('aria-live', 'polite');

  entrada.addEventListener('change', async () => {
    const arquivo = entrada.files[0];
    if (!arquivo) return;
    aviso.textContent = 'Preparando a foto…';
    try {
      const { caminho, previaUrl } = await prepararFoto(arquivo, def.pasta, alvo.titulo || alvo.nome);
      alvo[chave] = caminho;
      // O ajuste de enquadramento era da foto antiga
      if ('recorte' in alvo) alvo.recorte = '';
      previa.src = previaUrl;
      previa.hidden = false;
      escolher.textContent = 'Trocar foto';
      aviso.textContent = 'Foto pronta — já aparece na prévia. Vai para o site quando você publicar.';
      validar();
      atualizarStatus();
    } catch {
      aviso.textContent = 'Não consegui abrir essa foto. Tente outra, de preferência JPG.';
    }
    entrada.value = '';
  });

  bloco.append(previa, entrada, escolher, aviso);
  return bloco;
}

const SUPORTA_WEBP = document
  .createElement('canvas')
  .toDataURL('image/webp')
  .startsWith('data:image/webp');

/**
 * Reduz a foto no próprio navegador para as larguras do site (srcset) — a foto do celular
 * tem vários MB; o site precisa de ~150 KB. Gera os mesmos nomes que srcsetCard() espera.
 */
async function prepararFoto(arquivo, pasta, nome) {
  const imagem = await createImageBitmap(arquivo);
  const [tipo, extensao] = SUPORTA_WEBP ? ['image/webp', 'webp'] : ['image/jpeg', 'jpg'];
  // Nome novo a cada envio: fotos ficam em cache por 1 ano, o mesmo nome mostraria a antiga
  const base = `/images/${pasta}/${slug(nome) || 'foto'}-${Date.now().toString(36)}`;
  const principal = `${base}.${extensao}`;

  for (const largura of LARGURAS_FOTO) {
    const canvas = el('canvas');
    canvas.width = largura;
    canvas.height = Math.round((imagem.height * largura) / imagem.width);
    const contexto = canvas.getContext('2d');
    contexto.imageSmoothingQuality = 'high';
    contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((ok) => canvas.toBlob(ok, tipo, 0.82));
    const caminho = largura === LARGURAS_FOTO[0] ? principal : `${base}-${largura}.${extensao}`;
    estado.fotos.set(caminho, await paraBase64(blob));
    if (caminho === principal) estado.previas.set(principal, URL.createObjectURL(blob));
  }
  imagem.close();
  return { caminho: principal, previaUrl: estado.previas.get(principal) };
}

function paraBase64(blob) {
  return new Promise((ok, falha) => {
    const leitor = new FileReader();
    leitor.onload = () => ok(leitor.result.split(',')[1]);
    leitor.onerror = falha;
    leitor.readAsDataURL(blob);
  });
}

// ---------- Prévia ----------

const frame = $('previa-frame');
let esperaPrevia;

function iniciarPrevia() {
  frame.src = '/?previa=1';
  new ResizeObserver(ajustarPalco).observe($('palco'));
  for (const opcao of document.querySelectorAll('[data-aparelho]')) {
    opcao.addEventListener('click', () => {
      estado.aparelho = opcao.dataset.aparelho;
      for (const outra of document.querySelectorAll('[data-aparelho]')) {
        outra.setAttribute('aria-pressed', String(outra === opcao));
      }
      ajustarPalco();
    });
  }
  $('abrir-previa').addEventListener('click', () => {
    $('previa').classList.add('previa--aberta');
    ajustarPalco();
    $('fechar-previa').focus();
  });
  $('fechar-previa').addEventListener('click', () => fecharPreviaMovel($('abrir-previa')));
}

window.addEventListener('message', (evento) => {
  if (evento.origin !== location.origin || evento.source !== frame.contentWindow) return;
  if (evento.data !== 'ycar-previa-pronta') return;
  estado.previaPronta = true;
  prepararDocumentoPrevia(frame.contentDocument);
  enviarPrevia();
});

function fecharPreviaMovel(focarDepois) {
  if (!$('previa').classList.contains('previa--aberta')) return;
  $('previa').classList.remove('previa--aberta');
  focarDepois?.focus();
}

/** Mesmo ponto de quebra do admin.css: daqui para cima, editor e prévia lado a lado. */
const TELA_LARGA = matchMedia('(min-width: 70em)');

/**
 * "Computador" é o site em 1280px reduzido para caber; "Celular", 390px em tamanho real com
 * moldura. Numa tela pequena a prévia já é o próprio celular: ocupa a largura toda.
 */
function ajustarPalco() {
  const palco = $('palco');
  const { width, height } = palco.getBoundingClientRect();
  if (!width) return;
  const aparelho = TELA_LARGA.matches ? estado.aparelho : 'celular';
  const largura = TELA_LARGA.matches ? APARELHOS[aparelho] : width;
  const margem = TELA_LARGA.matches && aparelho === 'celular' ? 24 : 0;
  const escala = Math.min(1, (width - 2 * margem) / largura);
  palco.dataset.aparelho = aparelho;
  Object.assign(frame.style, {
    width: `${largura}px`,
    height: `${(height - 2 * margem) / escala}px`,
    transform: `scale(${escala})`,
    left: `${(width - largura * escala) / 2}px`,
    top: `${margem}px`,
  });
}

function agendarPrevia() {
  clearTimeout(esperaPrevia);
  esperaPrevia = setTimeout(enviarPrevia, 120);
}

function enviarPrevia() {
  const janela = frame.contentWindow;
  if (!estado.previaPronta || typeof janela?.ycarPrevia !== 'function') return;
  // Fotos ainda não publicadas não existem no servidor: a prévia usa o arquivo local
  const conteudo = structuredClone(estado.conteudo);
  for (const item of [...conteudo.servicos.itens, ...conteudo.frota.itens]) {
    item.imagem = estado.previas.get(item.imagem) ?? item.imagem;
  }
  // Objetos criados dentro do iframe, para o Angular de lá não receber objetos de outra janela
  janela.ycarPrevia(janela.JSON.parse(JSON.stringify(conteudo)));
}

/** Estilos e eventos que só existem na prévia: realce ao passar o mouse e clique para editar. */
function prepararDocumentoPrevia(doc) {
  const estilo = doc.createElement('style');
  estilo.textContent = `
    html { scroll-behavior: auto !important; }
    .ycar-alvo, .ycar-foco { outline: 3px solid #f7e2b9 !important; outline-offset: -3px; cursor: pointer; }
    .ycar-foco { animation: ycar-pulso 0.9s ease-out 2; }
    @keyframes ycar-pulso { 50% { outline-color: rgba(247, 226, 185, 0.15); } }
    .ycar-rotulo {
      position: absolute; z-index: 2147483647; pointer-events: none;
      padding: 6px 12px; border-radius: 999px; background: #f7e2b9; color: #14120f;
      font: 600 14px/1.2 system-ui, sans-serif; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
    }`;
  doc.head.append(estilo);
  const rotulo = doc.createElement('div');
  rotulo.className = 'ycar-rotulo';
  rotulo.hidden = true;
  doc.body.append(rotulo);
  let realcado = null;

  doc.addEventListener('mouseover', (evento) => {
    const achado = acharNaPrevia(evento.target);
    const elemento = achado?.elemento ?? null;
    if (elemento === realcado) return;
    realcado?.classList.remove('ycar-alvo');
    realcado = elemento;
    rotulo.hidden = !elemento;
    if (!elemento) return;
    elemento.classList.add('ycar-alvo');
    const caixa = elemento.getBoundingClientRect();
    const janela = doc.defaultView;
    rotulo.textContent = `✎ Editar: ${SECOES[achado.secao].titulo}${achado.item === undefined ? '' : ` ${achado.item + 1}`}`;
    rotulo.style.top = `${Math.max(caixa.top, 64) + janela.scrollY + 8}px`;
    rotulo.style.left = `${caixa.left + janela.scrollX + 8}px`;
  });

  // Na prévia nada navega: o clique vira "editar este trecho"
  doc.addEventListener(
    'click',
    (evento) => {
      evento.preventDefault();
      evento.stopPropagation();
      const achado = acharNaPrevia(evento.target);
      if (achado) editarPelaPrevia(achado.secao, achado.item);
    },
    true,
  );
}

/** Elemento clicado na prévia → seção do formulário (e item da lista, se houver). */
function acharNaPrevia(alvo) {
  for (const [secao, { previa }] of SECOES.entries()) {
    const container = alvo.closest?.(previa.clique ?? previa.alvo);
    if (!container) continue;
    const cartao = previa.itens && alvo.closest(previa.itens);
    if (cartao) {
      const lista = [...container.ownerDocument.querySelector(previa.alvo).querySelectorAll(previa.itens)];
      const item = lista.indexOf(cartao);
      if (item >= 0) return { secao, item, elemento: cartao };
    }
    return { secao, elemento: container };
  }
  return null;
}

function editarPelaPrevia(secao, item) {
  fecharPreviaMovel();
  const bloco = document.querySelector(`[data-secao="${secao}"]`);
  bloco.open = true;
  const alvo = (item !== undefined && bloco.querySelectorAll('[data-item]')[item]) || bloco;
  alvo.scrollIntoView({ block: 'start', behavior: 'smooth' });
  alvo.querySelector('input:not([type=file]):not([type=radio]), textarea')?.focus({ preventScroll: true });
  alvo.classList.remove('realce');
  void alvo.offsetWidth; // reinicia a animação
  alvo.classList.add('realce');
}

/** Rola a prévia até o trecho que está sendo editado e pisca o contorno. */
function mostrarNaPrevia(secao, item) {
  const doc = estado.previaPronta && frame.contentDocument;
  if (!doc) return;
  const { previa } = SECOES[secao];
  let alvo = doc.querySelector(previa.alvo);
  if (!alvo) return;
  if (item !== undefined && previa.itens) alvo = alvo.querySelectorAll(previa.itens)[item] ?? alvo;

  for (const antigo of doc.querySelectorAll('.ycar-foco')) antigo.classList.remove('ycar-foco');
  void alvo.offsetWidth;
  alvo.classList.add('ycar-foco');
  // scrollTo na janela do iframe: scrollIntoView rolaria o painel junto
  const janela = doc.defaultView;
  const topo = alvo.getBoundingClientRect().top + janela.scrollY - 96;
  if (getComputedStyle(alvo).position !== 'fixed') janela.scrollTo({ top: Math.max(0, topo), behavior: 'smooth' });
}

$('editor').addEventListener('focusin', (evento) => {
  const secao = evento.target.closest('[data-secao]');
  if (!secao) return;
  const item = evento.target.closest('[data-item]');
  mostrarNaPrevia(Number(secao.dataset.secao), item ? Number(item.dataset.item) : undefined);
});

// ---------- Publicar ----------

$('editor').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  if (estado.publicando || !validarTudo()) return;

  estado.publicando = true;
  atualizarStatus('Publicando…');

  // Só vão as fotos que o conteúdo ainda usa (a pessoa pode ter trocado de novo ou removido o item)
  const usadas = new Set(
    [...estado.conteudo.servicos.itens, ...estado.conteudo.frota.itens].map((item) =>
      item.imagem.replace(/\.\w+$/, ''),
    ),
  );
  const fotos = Object.fromEntries(
    [...estado.fotos].filter(([caminho]) => usadas.has(caminho.replace(/(-\d+)?\.\w+$/, ''))),
  );

  const resposta = await api('PUT', '/api/conteudo', {
    conteudo: estado.conteudo,
    versao: estado.versao,
    fotos,
  });
  estado.publicando = false;

  if (resposta.status === 401) {
    mostrar('tela-login');
    $('erro-login').textContent = 'Sua sessão expirou. Entre de novo — suas alterações continuam guardadas.';
    return;
  }
  if (!resposta.ok) return atualizarStatus(resposta.erro, 'erro');

  estado.versao = resposta.versao;
  estado.publicado = JSON.stringify(estado.conteudo);
  // estado.previas fica: até o build terminar, as fotos novas ainda não existem no servidor
  estado.fotos.clear();
  for (const aviso of document.querySelectorAll('.campo--foto [aria-live]')) aviso.textContent = '';
  atualizarStatus('Publicado! Em cerca de 2 minutos as mudanças aparecem no site.', 'ok');
});

/** Abre a seção do primeiro campo com problema e mostra o aviso do navegador nele. */
function validarTudo() {
  const invalido = [...$('editor').elements].find((campo) => campo.willValidate && !campo.checkValidity());
  if (!invalido) return true;
  fecharPreviaMovel();
  invalido.closest('details').open = true;
  invalido.reportValidity();
  atualizarStatus(
    invalido.type === 'file' ? 'Falta escolher uma foto.' : 'Tem um campo para corrigir antes de publicar.',
    'erro',
  );
  return false;
}

function alterado() {
  return estado.conteudo !== null && JSON.stringify(estado.conteudo) !== estado.publicado;
}

function atualizarStatus(mensagem, tom) {
  const sujo = alterado();
  const status = $('status');
  status.textContent =
    mensagem ?? (sujo ? 'Você tem alterações que ainda não foram publicadas.' : 'Tudo publicado.');
  status.dataset.tom = tom ?? (sujo ? 'pendente' : '');
  $('publicar').disabled = estado.publicando || !sujo;
  $('previa-estado').textContent = sujo ? 'Alterações não publicadas' : 'Igual ao site publicado';
  $('previa-estado').dataset.tom = sujo ? 'pendente' : '';
  agendarPrevia();
}

// ---------- Utilidades ----------

async function api(metodo, caminho, corpo) {
  try {
    const resposta = await fetch(caminho, {
      method: metodo,
      headers: corpo ? { 'Content-Type': 'application/json' } : {},
      body: corpo && JSON.stringify(corpo),
    });
    const dados = await resposta.json().catch(() => ({ erro: 'O servidor não respondeu direito.' }));
    return { status: resposta.status, ...dados };
  } catch {
    return { status: 0, erro: 'Sem conexão com a internet. Verifique e tente de novo.' };
  }
}

function el(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

/** SVG_ICONES são constantes deste arquivo, nunca texto vindo do conteúdo. */
function svgIcone(nome) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('svg-icone');
  svg.innerHTML = SVG_ICONES[nome] ?? '';
  return svg;
}

function botao(texto, acao, desabilitado, aoClicar) {
  const elemento = el('button', 'botao', texto);
  elemento.type = 'button';
  elemento.dataset.acao = acao;
  elemento.disabled = desabilitado;
  elemento.addEventListener('click', aoClicar);
  return elemento;
}

/** '5511965420041' → '(11) 96542-0041' */
function formatarTelefone(digitos) {
  const partes = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(digitos);
  return partes ? `(${partes[1]}) ${partes[2]}-${partes[3]}` : digitos;
}

function slug(texto = '') {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

function maiuscula(texto) {
  return texto[0].toUpperCase() + texto.slice(1);
}

iniciar();
