import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock для fetch API
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  // ============================================
  // ТЕСТЫ РЕНДЕРИНГА
  // ============================================

  test('renders header with title', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] })
    });

    render(<App />);
    // Используем более гибкий селектор
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/Pokémon Search/i);
  });

  test('renders subtitle', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] })
    });

    render(<App />);
    const subtitle = screen.getByText(/Find your favorite pokemon/i);
    expect(subtitle).toBeInTheDocument();
  });

  test('renders search input', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] })
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/Search by name/i);
    expect(input).toBeInTheDocument();
  });

 test('renders footer', () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ results: [] })
  });

  render(<App />);
  const footer = screen.getByRole('contentinfo');
  expect(footer).toBeInTheDocument();
  expect(footer).toHaveTextContent('Data retrieved from');
  expect(footer).toHaveTextContent('PokeAPI');
});


  // ============================================
  // ТЕСТЫ ПОИСКА
  // ============================================

  test('displays pokemon when search returns results', async () => {
    const mockPokemonList = {
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
      ]
    };

    const mockPokemonDetails = {
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

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonList
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails
      });

    render(<App />);
    
    const input = screen.getByPlaceholderText(/Search by name/i);
    await userEvent.type(input, 'pikachu');

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('displays error when pokemon not found', async () => {
    const mockPokemonList = {
      results: []
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonList
    });

    render(<App />);
    
    const input = screen.getByPlaceholderText(/Search by name/i);
    await userEvent.type(input, 'unknownpokemon');

    await waitFor(() => {
      // Ищем текст с ударением
      expect(screen.getByText(/Pokémon not found/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('displays error on API failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);
    
    const input = screen.getByPlaceholderText(/Search by name/i);
    await userEvent.type(input, 'pikachu');

    await waitFor(() => {
      expect(screen.getByText(/Error loading data/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // ============================================
  // ТЕСТЫ ОЧИСТКИ
  // ============================================

  test('clears results when search input is empty', async () => {
    const mockPokemonList = {
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
      ]
    };

    const mockPokemonDetails = {
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
        json: async () => mockPokemonList
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails
      });

    render(<App />);
    
    const input = screen.getByPlaceholderText(/Search by name/i);
    
    // Вводим текст
    await userEvent.type(input, 'pikachu');
    
    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Очищаем
    await userEvent.clear(input);

    await waitFor(() => {
      expect(screen.queryByText(/pikachu/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('shows start typing message initially', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] })
    });

    render(<App />);
    expect(screen.getByText(/Start typing to search/i)).toBeInTheDocument();
  });
});
