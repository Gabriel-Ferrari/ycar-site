// node --test worker/index.test.mjs
// Exercita a API do painel contra um GitHub falso em memória.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import worker from './index.mjs';

// Existe no runtime do Workers, não no Node
crypto.subtle.timingSafeEqual ??= (a, b) => timingSafeEqual(Buffer.from(a), Buffer.from(b));

const ARQUIVO = 'src/app/content/conteudo.json';
const CONTEUDO = JSON.parse(readFileSync(new URL(`../${ARQUIVO}`, import.meta.url), 'utf8'));
const URL_BASE = 'https://ycar.test';

function githubFalso() {
  const blobs = new Map();
  const salvar = (buffer) => {
    const sha = createHash('sha1').update(buffer).digest('hex');
    blobs.set(sha, buffer);
    return sha;
  };
  const arquivos = new Map([[ARQUIVO, salvar(Buffer.from(JSON.stringify(CONTEUDO)))]]);
  const arvores = new Map();
  const commits = new Map([['c0', 't0']]);
  const g = { arquivos, blobs, head: 'c0', chamadas: [] };

  globalThis.fetch = async (url, { method = 'GET', body } = {}) => {
    const caminho = new URL(url).pathname.replace('/repos/dono/repo/', '');
    const corpo = body && JSON.parse(body);
    g.chamadas.push(`${method} ${caminho}`);
    const responder = (dados) => new Response(JSON.stringify(dados));

    if (caminho === `contents/${ARQUIVO}`) {
      const sha = arquivos.get(ARQUIVO);
      return responder({ sha, content: blobs.get(sha).toString('base64') });
    }
    if (caminho === 'git/refs/heads/main' && method === 'GET') return responder({ object: { sha: g.head } });
    if (caminho.startsWith('git/commits/')) return responder({ tree: { sha: commits.get(caminho.slice(12)) } });
    if (caminho === 'git/blobs') return responder({ sha: salvar(Buffer.from(corpo.content, corpo.encoding)) });
    if (caminho === 'git/trees') {
      const sha = `t${arvores.size + 1}`;
      arvores.set(sha, corpo.tree);
      return responder({ sha });
    }
    if (caminho === 'git/commits') {
      const sha = `c${commits.size}`;
      commits.set(sha, corpo.tree);
      return responder({ sha });
    }
    if (caminho === 'git/refs/heads/main' && method === 'PATCH') {
      assert.equal(corpo.force, false);
      g.head = corpo.sha;
      for (const { path, sha } of arvores.get(commits.get(corpo.sha))) arquivos.set(path, sha);
      return responder({});
    }
    return new Response('não mapeado', { status: 500 });
  };
  return g;
}

function ambiente(limiteOk = true) {
  return {
    ADMIN_SENHA: 'senha-de-teste',
    GITHUB_TOKEN: 'x',
    GITHUB_REPO: 'dono/repo',
    GITHUB_BRANCH: 'main',
    LIMITE_LOGIN: { limit: async () => ({ success: limiteOk }) },
  };
}

function pedir(env, metodo, caminho, corpo, cookie) {
  const headers = { 'content-type': 'application/json' };
  if (cookie) headers.cookie = cookie;
  const request = new Request(URL_BASE + caminho, {
    method: metodo,
    headers,
    body: corpo && JSON.stringify(corpo),
  });
  return worker.fetch(request, env);
}

async function entrar(env) {
  const resposta = await pedir(env, 'POST', '/api/entrar', { senha: env.ADMIN_SENHA });
  return resposta.headers.get('set-cookie').split(';')[0];
}

test('login: senha errada, limite e cookie de sessão', async () => {
  githubFalso();
  const env = ambiente();
  assert.equal((await pedir(env, 'POST', '/api/entrar', { senha: 'errada' })).status, 401);
  assert.equal((await pedir(ambiente(false), 'POST', '/api/entrar', { senha: env.ADMIN_SENHA })).status, 429);

  const resposta = await pedir(env, 'POST', '/api/entrar', { senha: env.ADMIN_SENHA });
  assert.equal(resposta.status, 200);
  assert.match(resposta.headers.get('set-cookie'), /HttpOnly; Secure; SameSite=Strict/);
});

test('sem secrets (ou com senha curta) o painel fica fechado', async () => {
  githubFalso();
  for (const env of [{ ...ambiente(), ADMIN_SENHA: undefined }, { ...ambiente(), ADMIN_SENHA: 'curta' }, { ...ambiente(), GITHUB_TOKEN: '' }]) {
    const resposta = await pedir(env, 'POST', '/api/entrar', { senha: 'undefined' });
    assert.equal(resposta.status, 503);
  }
});

test('conteúdo exige sessão válida e não aceita cookie adulterado ou vencido', async () => {
  githubFalso();
  const env = ambiente();
  assert.equal((await pedir(env, 'GET', '/api/conteudo')).status, 401);

  const cookie = await entrar(env);
  const [, assinatura] = cookie.split('.');
  const futuro = Date.now() + 999 * 86_400_000;
  assert.equal((await pedir(env, 'GET', '/api/conteudo', null, `sessao=${futuro}.${assinatura}`)).status, 401);
  assert.equal((await pedir(env, 'GET', '/api/conteudo', null, `sessao=1.${assinatura}`)).status, 401);
  // Trocar a senha derruba a sessão
  assert.equal((await pedir({ ...env, ADMIN_SENHA: 'outra-senha-longa' }, 'GET', '/api/conteudo', null, cookie)).status, 401);

  const resposta = await pedir(env, 'GET', '/api/conteudo', null, cookie);
  assert.equal(resposta.status, 200);
  assert.deepEqual((await resposta.json()).conteudo, CONTEUDO);
});

test('publicar recusa formato inválido e versão antiga', async () => {
  githubFalso();
  const env = ambiente();
  const cookie = await entrar(env);
  const { versao } = await (await pedir(env, 'GET', '/api/conteudo', null, cookie)).json();
  const publicar = (conteudo, extra = {}) =>
    pedir(env, 'PUT', '/api/conteudo', { conteudo, versao, ...extra }, cookie);
  const copia = () => structuredClone(CONTEUDO);

  const casos = {
    'campo a mais': (c) => (c.contato.extra = 'x'),
    'campo a menos': (c) => delete c.contato.email,
    'número em vez de texto': (c) => (c.inicio.titulo = 42),
    'WhatsApp sem DDD': (c) => (c.contato.whatsapp = '55965420041'),
    'link sem https': (c) => (c.reserva.plataformaUrl = 'javascript:alert(1)'),
    'foto fora da pasta': (c) => (c.servicos.itens[0].imagem = '/../../etc/passwd'),
    'lista vazia': (c) => (c.frota.itens = []),
    'item com campos diferentes': (c) => c.servicos.itens.push({ titulo: 'x' }),
  };
  for (const [nome, estragar] of Object.entries(casos)) {
    const conteudo = copia();
    estragar(conteudo);
    assert.equal((await publicar(conteudo)).status, 400, nome);
  }

  const fotoSolta = { '/images/frota/qualquer.webp': 'AAAA' };
  assert.equal((await publicar(copia(), { fotos: fotoSolta })).status, 400, 'foto que o conteúdo não usa');

  const antiga = await pedir(env, 'PUT', '/api/conteudo', { conteudo: copia(), versao: 'velha' }, cookie);
  assert.equal(antiga.status, 409);
});

test('publicar faz um commit com o JSON e as fotos, e devolve a nova versão', async () => {
  const gh = githubFalso();
  const env = ambiente();
  const cookie = await entrar(env);
  const { conteudo, versao } = await (await pedir(env, 'GET', '/api/conteudo', null, cookie)).json();

  conteudo.contato.whatsapp = '5511912345678';
  conteudo.frota.itens.push({ ...conteudo.frota.itens[0], nome: 'Limusine', imagem: '/images/frota/limusine-abc.webp' });
  const fotos = Object.fromEntries(
    ['', '-400', '-560', '-672'].map((sufixo) => [`/images/frota/limusine-abc${sufixo}.webp`, 'UklGRg==']),
  );

  const resposta = await pedir(env, 'PUT', '/api/conteudo', { conteudo, versao, fotos }, cookie);
  assert.equal(resposta.status, 200);
  const { versao: nova } = await resposta.json();

  assert.equal(nova, gh.arquivos.get(ARQUIVO));
  assert.deepEqual(JSON.parse(gh.blobs.get(nova).toString()), conteudo);
  assert.ok(gh.arquivos.has('public/images/frota/limusine-abc-560.webp'));
  assert.equal(gh.chamadas.filter((c) => c === 'POST git/commits').length, 1);

  // Publicar de novo com a versão devolvida funciona sem recarregar
  conteudo.contato.horario = 'Das 6h às 23h';
  const segunda = await pedir(env, 'PUT', '/api/conteudo', { conteudo, versao: nova }, cookie);
  assert.equal(segunda.status, 200);
});
