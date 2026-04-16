import React from "react";
import "../styles/ResultsList.css";

export const ResultsList = ({ results, isLoading, error }) => {
  if (error) {
    return (
      <div className="error-container" role="alert">
        <p className="error-text">❌ {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="results-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="empty-state">
        <p>🔍 Start typing to search...</p>
      </div>
    );
  }

  return (
    <section className="results-section" aria-label="Результаты поиска">
      <div className="results-grid">
        {results.map((pokemon, index) => (
          <article
            key={pokemon.id}
            className="result-card"
            style={{ "--index": index }}
          >
            <div className="card-image-wrapper">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="pokemon-image"
                loading="lazy"
              />
            </div>
            <div className="card-content">
              <h3>{pokemon.name}</h3>
              <p className="card-id">ID: {pokemon.id}</p>
              <div className="card-types">
                {pokemon.types?.map((type) => (
                  <span key={type} className={`type-badge type-${type}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
