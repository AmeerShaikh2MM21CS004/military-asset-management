import React from "react";

export const Input = ({ type = "text", ...props }) => (
  <input
    type={type}
    style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
    {...props}
  />
);
