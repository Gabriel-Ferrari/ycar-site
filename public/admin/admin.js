// Painel do site: lê conteudo.json pela API, monta o formulário a partir de SECOES e
// publica tudo de uma vez (texto + fotos novas). O Worker transforma isso num commit
// e o Cloudflare refaz o site. Todo texto entra no DOM via textContent/value, nunca HTML.

/** Ícones do site que fazem sentido em card (ver IconName em src/app/components/icon.ts). */
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

const SECOES = [
  {
    titulo: 'WhatsApp e contato',
    descricao: 'Número, mensagem automática, link de reservas, Instagram e horário.',
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
        ajuda: 'Para onde vão os botões de reserva. Começa com https://',
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
  publicando: false,
};

const $ = (id) => document.getElementById(id);
let proximoId = 0;

// ---------- Telas ----------

function mostrar(tela) {
  for (const id of ['tela-carregando', 'tela-login', 'editor']) $(id).hidden = id !== tela;
  $('barra').hidden = $('sair').hidden = tela !== 'editor';
}

async function iniciar() {
  const resposta = await api('GET', '/api/conteudo');
  if (resposta.status === 401) return mostrar('tela-login');
  if (resposta.erro) return erroGeral(resposta.erro);
  estado.conteudo = resposta.conteudo;
  estado.versao = resposta.versao;
  estado.publicado = JSON.stringify(resposta.conteudo);
  desenharEditor();
  mostrar('editor');
  atualizarStatus();
}

function erroGeral(mensagem) {
  const tela = $('tela-carregando');
  tela.textContent = mensagem;
  tela.className = 'mensagem mensagem--erro';
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
    mostrar('editor');
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
    bloco.open = i === 0;
    const resumo = el('summary');
    resumo.append(el('span', 'secao__titulo', secao.titulo), el('span', 'secao__descricao', secao.descricao));
    bloco.append(resumo);
    const corpo = el('div', 'secao__corpo');
    for (const def of secao.campos) {
      const [pai, chave] = separar(def.campo);
      corpo.append(def.tipo === 'lista' ? criarLista(def, pai[chave]) : criarCampo(def, pai, chave));
    }
    bloco.append(corpo);
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

  const id = `campo-${++proximoId}`;
  const bloco = el('div', 'campo');
  const rotulo = el('label', 'campo__rotulo', def.rotulo);
  rotulo.htmlFor = id;
  bloco.append(rotulo);

  let entrada;
  if (def.tipo === 'texto-longo') {
    entrada = el('textarea');
    entrada.rows = 3;
  } else if (def.tipo === 'icone') {
    entrada = el('select');
    for (const [valor, nome] of Object.entries(ICONES)) entrada.append(new Option(nome, valor));
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
    if (!/^https:\/\/\S+$/.test(valor)) mensagem = 'O link precisa começar com https://';
  }

  entrada.setCustomValidity(mensagem);
  return resultado;
}

function criarLista(def, lista) {
  const bloco = el('div', 'lista');

  const desenhar = (foco) => {
    const itens = lista.map((item, i) => {
      const cartao = el('fieldset', 'item');
      const nome = `${maiuscula(def.rotuloItem)} ${i + 1}`;
      cartao.append(el('legend', 'item__titulo', nome));

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
  if (alvo[chave]) previa.src = alvo[chave];

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
      aviso.textContent = 'Foto pronta. Ela vai para o site quando você publicar.';
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
  let previaUrl;

  for (const largura of LARGURAS_FOTO) {
    const canvas = el('canvas');
    canvas.width = largura;
    canvas.height = Math.round((imagem.height * largura) / imagem.width);
    const contexto = canvas.getContext('2d');
    contexto.imageSmoothingQuality = 'high';
    contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((ok) => canvas.toBlob(ok, tipo, 0.82));
    const caminho = largura === LARGURAS_FOTO[0] ? `${base}.${extensao}` : `${base}-${largura}.${extensao}`;
    estado.fotos.set(caminho, await paraBase64(blob));
    previaUrl ??= URL.createObjectURL(blob);
  }
  imagem.close();
  return { caminho: `${base}.${extensao}`, previaUrl };
}

function paraBase64(blob) {
  return new Promise((ok, falha) => {
    const leitor = new FileReader();
    leitor.onload = () => ok(leitor.result.split(',')[1]);
    leitor.onerror = falha;
    leitor.readAsDataURL(blob);
  });
}

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
  estado.fotos.clear();
  for (const aviso of document.querySelectorAll('.campo--foto [aria-live]')) aviso.textContent = '';
  atualizarStatus('Publicado! Em cerca de 2 minutos as mudanças aparecem no site.', 'ok');
});

/** Abre a seção do primeiro campo com problema e mostra o aviso do navegador nele. */
function validarTudo() {
  const invalido = [...$('editor').elements].find((campo) => campo.willValidate && !campo.checkValidity());
  if (!invalido) return true;
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
  const status = $('status');
  status.textContent =
    mensagem ?? (alterado() ? 'Você tem alterações que ainda não foram publicadas.' : 'Tudo publicado.');
  status.dataset.tom = tom ?? (alterado() ? 'pendente' : '');
  $('publicar').disabled = estado.publicando || !alterado();
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
