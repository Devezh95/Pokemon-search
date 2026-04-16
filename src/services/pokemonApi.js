const API_BASE = "https://pokeapi.co/api/v2";

export const getAllPokemon = async () => {
  try {
    const response = await fetch(`${API_BASE}/pokemon?limit=1000`);

    if (!response.ok) {
      throw new Error("Error loading Pokémon list");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getAllPokemon:", error);
    throw error;
  }
};

export const getPokemonDetails = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Pokémon loading error: ${url}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      name: data.name,
      image:
        data.sprites.other["official-artwork"].front_default ||
        data.sprites.front_default,
      types: data.types.map((t) => t.type.name),
      height: data.height,
      weight: data.weight,
    };
  } catch (error) {
    console.error("Error getPokemonDetails:", error);
    return null;
  }
};

export const searchPokemon = async (query, limit = 20) => {
  try {
    const allPokemon = await getAllPokemon();

    const filtered = allPokemon.results
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit);

    if (filtered.length === 0) {
      return {
        success: false,
        data: [],
        message: "Pokémon not found 😞",
      };
    }

    const detailed = await Promise.all(
      filtered.map((p) => getPokemonDetails(p.url)),
    );

    const validResults = detailed.filter((p) => p !== null);

    if (validResults.length === 0) {
      return {
        success: false,
        data: [],
        message: "Failed to load pokemon data",
      };
    }

    return {
      success: true,
      data: validResults,
      message: null,
    };
  } catch (error) {
    console.error("Error searchPokemon:", error);
    return {
      success: false,
      data: [],
      message: "❌ Error loading data. Check your internet connection!",
    };
  }
};
