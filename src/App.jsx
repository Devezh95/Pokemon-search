import React, { useState, useEffect } from "react";
import { SearchBar } from "./components/SearchBar";
import { ResultsList } from "./components/ResultsList";
import { useDebounce } from "./hooks/useDebounce";
import { searchPokemon } from "./services/pokemonApi";
import "./styles/animations.css";
import "./styles/App.css";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setError("");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      const result = await searchPokemon(debouncedQuery, 20);

      setResults(result.data);
      setError(result.message || "");
      setIsLoading(false);
    };

    fetchData();
  }, [debouncedQuery]);

  return (
    <main className="app-container">
      <header className="app-header animate-slide-down">
        <h1>🔍 Pokémon Search</h1>
        <p>Find your favorite pokemon from PokeAPI</p>
      </header>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search by name (e.g.: pikachu, charizard)..."
      />

      <ResultsList results={results} isLoading={isLoading} error={error} />

      <footer className="app-footer">
        <p>
          Data retrieved from <strong>PokeAPI</strong> 🎮
        </p>
      </footer>
    </main>
  );
}

export default App;
