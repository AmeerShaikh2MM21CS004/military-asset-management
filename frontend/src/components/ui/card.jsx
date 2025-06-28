import React from "react";

export const Card = ({ children }) => (
  <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
    {children}
  </div>
);
