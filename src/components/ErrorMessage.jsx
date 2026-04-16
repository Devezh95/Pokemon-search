import React from "react";

export const ErrorMessage = ({ message = "Nothing found 😞" }) => {
  return (
    <div className="error-container" role="alert">
      <p className="error-text">{message}</p>
    </div>
  );
};
