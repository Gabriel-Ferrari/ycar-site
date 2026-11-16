/**
 * API do painel /admin e escolha de idioma na raiz. Os assets estáticos continuam servidos
 * direto pelo Cloudflare; este Worker só recebe /api/* e "/" (ver run_worker_first em wrangler.jsonc).
 *
 * Publicar = um commit em main com conteudo.json, conteudo.en.json e conteudo.es.json
 * (+ fotos novas). O Workers Builds
 * refaz o build e o deploy; se o build falhar (JSON fora do formato), o site
 * continua na versão anterior.
 *
 * Secrets (wrangler secret put): ADMIN_SENHA, GITHUB_TOKEN (fine-grained, Contents: write
 * só neste repositório). Vars em wrangler.jsonc: GITHUB_REPO, GITHUB_BRANCH.
 */

// Português é o modelo: os outros idiomas têm a mesma estrutura e só traduzem textos
const ARQUIVOS_CONTEUDO = {
  pt: 'src/app/content/conteudo.json',
  en: 'src/app/content/conteudo.en.json',
  es: 'src/app/content/conteudo.es.json',
};
/** Iguais em todos os idiomas: o painel só os edita no português */
const CAMPOS_COMPARTILHADOS = new Set(['whatsapp', 'instagram', 'email', 'cnpj', 'plataformaUrl', 'icone', 'imagem', 'recorte']);
const SESSAO_DIAS = 30;
const SENHA_MINIMA = 12;
const FOTO_MAX_BYTES = 2 * 1024 * 1024;
const TEXTO_MAX = 2000;
const LISTA_MAX = 30;
// Cada foto são 4 arquivos (larguras do srcset) e cada arquivo é uma chamada ao GitHub;
// o plano Free do Workers permite 50 por requisição
const FOTOS_POR_PUBLICACAO = 10;
const CAMINHO_FOTO = /^\/images\/(servicos|frota)\/[a-z0-9-]+\.(webp|jpg)$/;
/** Raiz de cada build de idioma (angular.json → i18n) */
const IDIOMAS = { pt: '/', en: '/en/', es: '/es/' };
const COOKIE_IDIOMA_DIAS = 365;

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    // Antes da checagem de secrets: o site não depende do painel estar configurado
    if (pathname === '/') return await raiz(request, env);
    // Sem secrets, a senha viraria a string "undefined"; senha curta cai na força bruta.
    // Dizer qual falta não expõe nada: com 503 o login fica fechado.
    const faltando = [
      !env.GITHUB_TOKEN?.trim() && 'GITHUB_TOKEN',
      !(env.ADMIN_SENHA?.length >= SENHA_MINIMA) && `ADMIN_SENHA com ${SENHA_MINIMA}+ caracteres`,
    ].filter(Boolean);
    if (faltando.length) {
      return json({ erro: `O painel ainda não foi configurado: falta ${faltando.join(' e ')}.` }, 503);
    }
    try {
      if (pathname === '/api/entrar' && request.method === 'POST') return await entrar(request, env);
      if (pathname === '/api/sair' && request.method === 'POST') return sair();
      if (pathname === '/api/conteudo') {
        if (!(await sessaoValida(request, env))) return json({ erro: 'Faça login de novo.' }, 401);
        if (request.method === 'GET') return await lerConteudo(env);
        if (request.method === 'PUT') return await publicar(request, env);
      }
      return json({ erro: 'Não encontrado.' }, 404);
    } catch (erro) {
      console.error(erro);
      return json({ erro: 'Erro no servidor. Tente de novo em alguns minutos.' }, 500);
    }
  },
};

// ---- Idioma: "/" vai para /en/ ou /es/ conforme a escolha salva ou o idioma do navegador ----

async function raiz(request, env) {
  const url = new URL(request.url);

  // Seletor do site (/?idioma=en): grava a escolha para a detecção não desfazê-la depois
  const escolhido = url.searchParams.get('idioma');
  if (Object.hasOwn(IDIOMAS, escolhido)) {
    url.searchParams.delete('idioma');
    const cookie = `idioma=${escolhido}; Path=/; Max-Age=${COOKIE_IDIOMA_DIAS * 86_400}; Secure; SameSite=Lax`;
    return redirecionar(IDIOMAS[escolhido] + url.search, { 'Set-Cookie': cookie });
  }

  // A prévia do painel (/?previa=1) mostra sempre o build que o painel pediu
  if (!url.searchParams.has('previa')) {
    const idioma = idiomaDoCookie(request) ?? idiomaDoNavegador(request.headers.get('accept-language'));
    if (idioma !== 'pt') return redirecionar(IDIOMAS[idioma] + url.search);
  }

  const asset = await env.ASSETS.fetch(request);
  const resposta = new Response(asset.body, asset);
  resposta.headers.set('Vary', 'Accept-Language, Cookie');
  // Mesmos do /* em public/_headers, para não depender de eles valerem em resposta do Worker
  resposta.headers.set('X-Content-Type-Options', 'nosniff');
  resposta.headers.set('X-Frame-Options', 'SAMEORIGIN');
  resposta.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  resposta.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  return resposta;
}

function idiomaDoCookie(request) {
  const valor = /(?:^|;\s*)idioma=([a-z]+)/.exec(request.headers.get('cookie') ?? '')?.[1];
  return Object.hasOwn(IDIOMAS, valor) ? valor : null;
}

/**
 * Accept-Language "en-US,en;q=0.9,pt;q=0.8" → o suportado de maior peso.
 * Sem cabeçalho (robôs de busca) fica o português; navegador em outra língua
 * (alemão, francês…) recebe inglês, que serve melhor ao estrangeiro.
 */
function idiomaDoNavegador(cabecalho) {
  const preferencias = (cabecalho ?? '')
    .split(',')
    .map((parte) => {
      const [tag, ...params] = parte.trim().toLowerCase().split(';');
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      return { idioma: tag.trim().slice(0, 2), peso: q ? Number(q.slice(2)) : 1 };
    })
    .filter((p) => p.idioma && p.idioma !== '*' && p.peso > 0)
    .sort((a, b) => b.peso - a.peso);
  if (!preferencias.length) return 'pt';
  return preferencias.find((p) => Object.hasOwn(IDIOMAS, p.idioma))?.idioma ?? 'en';
}

function redirecionar(destino, headers = {}) {
  return new Response(null, {
    status: 302,
    headers: { Location: destino, 'Cache-Control': 'no-store', Vary: 'Accept-Language, Cookie', ...headers },
  });
}

// ---- Sessão: cookie "<expira>.<hmac>" assinado com a própria senha ----
// Trocar ADMIN_SENHA derruba todas as sessões abertas.

async function entrar(request, env) {
  const ip = request.headers.get('cf-connecting-ip') ?? '';
  const { success } = await env.LIMITE_LOGIN.limit({ key: ip });
  if (!success) return json({ erro: 'Muitas tentativas. Espere um minuto.' }, 429);

  const { senha } = await request.json().catch(() => ({}));
  if (typeof senha !== 'string' || !(await iguais(senha, env.ADMIN_SENHA))) {
    return json({ erro: 'Senha incorreta.' }, 401);
  }
  const expira = String(Date.now() + SESSAO_DIAS * 86_400_000);
  const cookie = `sessao=${expira}.${await assinar(expira, env)}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSAO_DIAS * 86_400}`;
  return json({ ok: true }, 200, { 'Set-Cookie': cookie });
}

function sair() {
  const cookie = 'sessao=; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=0';
  return json({ ok: true }, 200, { 'Set-Cookie': cookie });
}

async function sessaoValida(request, env) {
  const valor = /(?:^|;\s*)sessao=([^;]+)/.exec(request.headers.get('cookie') ?? '')?.[1];
  const [expira, assinatura] = valor?.split('.') ?? [];
  if (!expira || !assinatura || Number(expira) < Date.now()) return false;
  return iguais(assinatura, await assinar(expira, env));
}

async function assinar(texto, env) {
  const chave = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(env.ADMIN_SENHA),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const assinatura = await crypto.subtle.sign('HMAC', chave, new TextEncoder().encode(texto));
  return btoa(String.fromCharCode(...new Uint8Array(assinatura))).replace(/[+/=]/g, '');
}

/** Comparação em tempo constante (hash antes para igualar os tamanhos). */
async function iguais(a, b) {
  const [ha, hb] = await Promise.all(
    [a, b].map((s) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))),
  );
  return crypto.subtle.timingSafeEqual(ha, hb);
}

// ---- Conteúdo ----

async function lerConteudo(env) {
  const atual = await conteudoAtual(env);
  return json({ conteudos: atual.conteudos, versao: atual.versao });
}

async function publicar(request, env) {
  const { conteudos, versao, fotos = {} } = await request.json().catch(() => ({}));
  const atual = await conteudoAtual(env);
  if (versao !== atual.versao) {
    return json({ erro: 'O conteúdo mudou desde que você abriu o painel. Recarregue a página.' }, 409);
  }
  if (typeof conteudos !== 'object' || conteudos === null) return json({ erro: 'Não foi possível salvar: conteúdo ausente' }, 400);

  const pt = conteudos.pt;
  let problema = null;
  for (const idioma of Object.keys(ARQUIVOS_CONTEUDO)) {
    problema ??= validar(conteudos[idioma], atual.conteudos[idioma], '');
    if (idioma !== 'pt') problema ??= mesmaEstrutura(conteudos[idioma], pt, idioma);
  }
  problema ??= validarFotos(pt, fotos);
  if (problema) return json({ erro: `Não foi possível salvar: ${problema}` }, 400);

  const shas = await commit(env, 'conteúdo: atualizado pelo painel', [
    ...Object.entries(ARQUIVOS_CONTEUDO).map(([idioma, path]) => ({
      path,
      content: JSON.stringify(conteudos[idioma], null, 2) + '\n',
      encoding: 'utf-8',
    })),
    ...Object.entries(fotos).map(([caminho, base64]) => ({
      path: `public${caminho}`,
      content: base64,
      encoding: 'base64',
    })),
  ]);
  // Nova versão para o painel poder publicar de novo sem recarregar
  return json({ ok: true, versao: versaoDe(Object.values(ARQUIVOS_CONTEUDO).map((path) => shas[path])) });
}

/** Tradução com lista de outro tamanho ou foto/ícone/contato diferente do português é recusada. */
function mesmaEstrutura(traducao, pt, caminho) {
  if (Array.isArray(pt)) {
    if (traducao.length !== pt.length) return `${caminho} tem itens diferentes do português`;
    for (const [i, item] of pt.entries()) {
      const erro = mesmaEstrutura(traducao[i], item, `${caminho}[${i}]`);
      if (erro) return erro;
    }
    return null;
  }
  if (typeof pt === 'object' && pt !== null) {
    for (const [chave, valor] of Object.entries(pt)) {
      if (CAMPOS_COMPARTILHADOS.has(chave) && traducao[chave] !== valor) return `${caminho}.${chave} difere do português`;
      const erro = mesmaEstrutura(traducao[chave], valor, `${caminho}.${chave}`);
      if (erro) return erro;
    }
  }
  return null;
}

/**
 * O formato aceito é o do conteúdo atual: mesmas chaves e tipos; itens novos de uma lista
 * seguem o primeiro item existente. Assim um campo novo no JSON não exige mexer aqui.
 */
function validar(novo, modelo, caminho) {
  if (Array.isArray(modelo)) {
    if (!Array.isArray(novo) || novo.length === 0 || novo.length > LISTA_MAX) {
      return `lista inválida em ${caminho}`;
    }
    for (const [i, item] of novo.entries()) {
      const erro = validar(item, modelo[0], `${caminho}[${i}]`);
      if (erro) return erro;
    }
    return null;
  }
  if (typeof modelo === 'object' && modelo !== null) {
    if (typeof novo !== 'object' || novo === null || Array.isArray(novo)) return `${caminho} inválido`;
    const chaves = Object.keys(modelo);
    if (Object.keys(novo).length !== chaves.length || !chaves.every((c) => c in novo)) {
      return `campos inesperados em ${caminho || 'conteúdo'}`;
    }
    for (const chave of chaves) {
      const erro = validar(novo[chave], modelo[chave], caminho ? `${caminho}.${chave}` : chave);
      if (erro) return erro;
    }
    return null;
  }
  if (typeof novo !== 'string' || novo.length > TEXTO_MAX) return `texto inválido em ${caminho}`;
  if (caminho === 'contato.whatsapp' && !/^55\d{10,11}$/.test(novo)) return 'número de WhatsApp inválido';
  if (caminho === 'contato.instagram' && !/^[\w.]{1,30}$/.test(novo)) return 'usuário do Instagram inválido';
  if (caminho === 'reserva.plataformaUrl' && novo && !/^https:\/\/[^\s"<>]+$/.test(novo)) {
    return 'o link de reservas precisa começar com https://';
  }
  if (caminho.endsWith('.imagem') && !CAMINHO_FOTO.test(novo)) return `foto inválida em ${caminho}`;
  return null;
}

function validarFotos(conteudo, fotos) {
  const usadas = [...conteudo.servicos.itens, ...conteudo.frota.itens].map((item) =>
    item.imagem.replace(/\.\w+$/, ''),
  );
  if (Object.keys(fotos).length > FOTOS_POR_PUBLICACAO * 4) {
    return `publique no máximo ${FOTOS_POR_PUBLICACAO} fotos novas por vez`;
  }
  for (const [caminho, base64] of Object.entries(fotos)) {
    if (!CAMINHO_FOTO.test(caminho)) return `nome de foto inválido (${caminho})`;
    // Só a foto principal e as variantes -400/-560/-672 de uma foto que o conteúdo usa
    const base = caminho.replace(/(-\d+)?\.\w+$/, '');
    if (!usadas.includes(base)) return `foto não usada (${caminho})`;
    if (typeof base64 !== 'string' || base64.length > (FOTO_MAX_BYTES * 4) / 3) {
      return `foto grande demais (${caminho})`;
    }
  }
  return null;
}

// ---- GitHub ----

async function conteudoAtual(env) {
  const arquivos = await Promise.all(
    Object.values(ARQUIVOS_CONTEUDO).map((path) => github(env, `contents/${path}?ref=${env.GITHUB_BRANCH}`)),
  );
  const conteudos = Object.fromEntries(
    Object.keys(ARQUIVOS_CONTEUDO).map((idioma, i) => {
      const bytes = Uint8Array.from(atob(arquivos[i].content.replace(/\n/g, '')), (c) => c.charCodeAt(0));
      return [idioma, JSON.parse(new TextDecoder().decode(bytes))];
    }),
  );
  return { conteudos, versao: versaoDe(arquivos.map((arquivo) => arquivo.sha)) };
}

/** Um sha por arquivo: qualquer um que mude no GitHub invalida o que o painel abriu */
function versaoDe(shas) {
  return shas.join('.');
}

/** Um commit só para texto + fotos: um build, e nunca conteúdo apontando para foto ausente. */
async function commit(env, mensagem, arquivos) {
  const ref = `git/refs/heads/${env.GITHUB_BRANCH}`;
  const pai = (await github(env, ref)).object.sha;
  const arvoreBase = (await github(env, `git/commits/${pai}`)).tree.sha;

  // Em série: o GitHub limita criação de conteúdo em paralelo
  const entradas = [];
  for (const { path, content, encoding } of arquivos) {
    const { sha } = await github(env, 'git/blobs', 'POST', { content, encoding });
    entradas.push({ path, mode: '100644', type: 'blob', sha });
  }

  const arvore = await github(env, 'git/trees', 'POST', { base_tree: arvoreBase, tree: entradas });
  const novo = await github(env, 'git/commits', 'POST', {
    message: mensagem,
    tree: arvore.sha,
    parents: [pai],
  });
  // force: false → se main andou entre a leitura e aqui, o GitHub recusa em vez de sobrescrever
  await github(env, ref, 'PATCH', { sha: novo.sha, force: false });
  return Object.fromEntries(entradas.map(({ path, sha }) => [path, sha]));
}

async function github(env, caminho, method = 'GET', corpo) {
  const resposta = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/${caminho}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ycar-site-admin',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: corpo && JSON.stringify(corpo),
  });
  if (!resposta.ok) throw new Error(`GitHub ${method} ${caminho}: ${resposta.status} ${await resposta.text()}`);
  return resposta.json();
}

function json(corpo, status = 200, headers = {}) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}
