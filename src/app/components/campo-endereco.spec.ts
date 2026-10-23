import { formatarSugestoes } from './campo-endereco';

// Lugares como o Photon devolve para buscas reais em SP
describe('formatarSugestoes', () => {
  it('lugar com nome mostra o nome e o endereço no detalhe', () => {
    const [sugestao] = formatarSugestoes(
      [
        {
          name: 'Aeroporto de Congonhas',
          street: 'Avenida Washington Luís',
          housenumber: '6401',
          district: 'Campo Belo',
          city: 'São Paulo',
          state: 'São Paulo',
          type: 'house',
        },
      ],
      'aeroporto congonhas',
    );
    expect(sugestao.valor).toBe(
      'Aeroporto de Congonhas - Avenida Washington Luís, 6401, Campo Belo, São Paulo',
    );
  });

  it('rua sem número herda o número digitado e trechos repetidos somem', () => {
    const trecho = {
      name: 'Rua Oscar Freire',
      district: 'Jardim Paulista',
      city: 'São Paulo',
      state: 'São Paulo',
      type: 'street',
    };
    const sugestoes = formatarSugestoes([trecho, trecho, trecho], 'rua oscar freire 500');
    expect(sugestoes.map((s) => s.valor)).toEqual([
      'Rua Oscar Freire, 500 - Jardim Paulista, São Paulo',
    ]);
  });

  it('endereço com número usa o número do mapa', () => {
    const [sugestao] = formatarSugestoes(
      [
        {
          street: 'Avenida Paulista',
          housenumber: '1000',
          district: 'Bela Vista',
          city: 'São Paulo',
          state: 'São Paulo',
          type: 'house',
        },
      ],
      'av paulista 1000',
    );
    expect(sugestao.principal).toBe('Avenida Paulista, 1000');
    expect(sugestao.detalhe).toBe('Bela Vista, São Paulo');
  });

  it('fora de SP mostra o estado; no máximo 5 sugestões', () => {
    const cidades = ['A', 'B', 'C', 'D', 'E', 'F'].map((letra) => ({
      name: `Congonhas ${letra}`,
      state: 'Minas Gerais',
      type: 'city',
    }));
    const sugestoes = formatarSugestoes(cidades, 'congonhas');
    expect(sugestoes).toHaveLength(5);
    expect(sugestoes[0].valor).toBe('Congonhas A - Minas Gerais');
  });
});
