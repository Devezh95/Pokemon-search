import { searchPokemon, getPokemonDetails, getAllPokemon } from './pokemonApi';

global.fetch = jest.fn();

describe('Pokemon API Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  // ============================================
  // ТЕСТЫ getAllPokemon
  // ============================================

  test('getAllPokemon returns pokemon list', async () => {
    const mockData = {
      results: [
        { name: 'pikachu', url: 'https://...' },
        { name: 'charizard', url: 'https://...' }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const result = await getAllPokemon();
    expect(result.results).toHaveLength(2);
    expect(result.results[0].name).toBe('pikachu');
  });

  test('getAllPokemon throws error on API failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false
    });

    await expect(getAllPokemon()).rejects.toThrow();
  });

  // ============================================
  // ТЕСТЫ getPokemonDetails
  // ============================================

  test('getPokemonDetails returns pokemon data', async () => {
    const mockData = {
      id: 25,
      name: 'pikachu',
      sprites: {
        other: {
          'official-artwork': {
            front_default: 'https://example.com/pikachu.png'
          }
        },
        front_default: 'https://example.com/pikachu.png'
      },
      types: [{ type: { name: 'electric' } }],
      height: 4,
      weight: 60
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const result = await getPokemonDetails('https://pokeapi.co/api/v2/pokemon/25/');
    
    expect(result.id).toBe(25);
    expect(result.name).toBe('pikachu');
    expect(result.types).toContain('electric');
  });

  test('getPokemonDetails returns null on error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false
    });

    const result = await getPokemonDetails('https://invalid-url');
    expect(result).toBeNull();
  });

  test('getPokemonDetails handles missing image gracefully', async () => {
    const mockData = {
      id: 1,
      name: 'bulbasaur',
      sprites: {
        other: {
          'official-artwork': {
            front_default: null
          }
        },
        front_default: 'https://example.com/bulbasaur.png'
      },
      types: [{ type: { name: 'grass' } }],
      height: 7,
      weight: 69
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const result = await getPokemonDetails('https://pokeapi.co/api/v2/pokemon/1/');
    
    expect(result.image).toBe('https://example.com/bulbasaur.png');
  });

  // ============================================
  // ТЕСТЫ searchPokemon
  // ============================================

  test('searchPokemon returns filtered results', async () => {
    const mockList = {
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26/' }
      ]
    };

    const mockDetails = {
      id: 25,
      name: 'pikachu',
      sprites: {
        other: { 'official-artwork': { front_default: 'url' } },
        front_default: 'url'
      },
      types: [{ type: { name: 'electric' } }],
      height: 4,
      weight: 60
    };

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockList
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDetails
      });

    const result = await searchPokemon('pikachu');
    
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('pikachu');
  });

  test('searchPokemon returns error message when not found', async () => {
    const mockList = { results: [] };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockList
    });

    const result = await searchPokemon('unknownpokemon');
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('not found');
  });

  test('searchPokemon respects limit parameter', async () => {
    const mockList = {
      results: [
        { name: 'pikachu', url: 'https://...' },
        { name: 'raichu', url: 'https://...' },
        { name: 'pichu', url: 'https://...' }
      ]
    };

    const mockDetails = {
      id: 25,
      name: 'pikachu',
      sprites: {
        other: { 'official-artwork': { front_default: 'url' } },
        front_default: 'url'
      },
      types: [{ type: { name: 'electric' } }],
      height: 4,
      weight: 60
    };

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockList
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDetails
      });

    const result = await searchPokemon('pi', 1);
    
    expect(result.success).toBe(true);
    expect(result.data.length).toBeLessThanOrEqual(1);
  });
});
