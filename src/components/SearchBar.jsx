import React from 'react';
import '../styles/SearchBar.css';

export const SearchBar = ({ value, onChange, placeholder = 'Start typing to search...' }) => {
  return (
    <div className="search-container animate-slide-up">
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search field"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};
