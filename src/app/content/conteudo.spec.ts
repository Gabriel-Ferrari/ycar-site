import pt from './conteudo.json';
import en from './conteudo.en.json';
import es from './conteudo.es.json';

// Mesma lista do Worker e do painel: estes campos não se traduzem
const COMPARTILHADOS = new Set([
  'whatsapp',
  'instagram',
  'email',
  'cnpj',
  'plataformaUrl',
  'icone',
  'imagem',
  'recorte',
]);

/** Caminhos em que a tradução foge do português: lista de outro tamanho, foto/contato diferente, texto vazio. */
function diferencas(traducao: unknown, original: unknown, caminho: string, chave = ''): string[] {
  if (Array.isArray(original)) {
    const lista = traducao as unknown[];
    if (lista.length !== original.length)
      return [`${caminho}: ${lista.length} itens, português tem ${original.length}`];
    return original.flatMap((item, i) => diferencas(lista[i], item, `${caminho}[${i}]`));
  }
  if (typeof original === 'object' && original !== null) {
    return Object.entries(original).flatMap(([k, v]) =>
      diferencas((traducao as Record<string, unknown>)[k], v, `${caminho}.${k}`, k),
    );
  }
  if (COMPARTILHADOS.has(chave))
    return traducao === original ? [] : [`${caminho} difere do português`];
  return typeof traducao === 'string' && traducao.trim() ? [] : [`${caminho} sem tradução`];
}

describe('traduções do conteúdo', () => {
  for (const [idioma, traducao] of Object.entries({ en, es })) {
    it(`${idioma}: mesma estrutura, fotos e contatos do português, e nenhum texto vazio`, () => {
      expect(diferencas(traducao, pt, idioma)).toEqual([]);
    });
  }
});
