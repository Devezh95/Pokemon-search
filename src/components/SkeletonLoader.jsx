import React from 'react';
import '../styles/ResultsList.css';

export const SkeletonLoader = ({ count = 4 }) => {
  return (
    <div className="results-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
        </div>
      ))}
    </div>
  );
};
