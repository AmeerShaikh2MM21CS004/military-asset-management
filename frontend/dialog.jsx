import React from "react";

// Simple Dialog component structure
export const Dialog = ({ children }) => (
  <div className="dialog-backdrop">
    <div className="dialog-content">{children}</div>
  </div>
);

export const DialogTrigger = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
);

export const DialogContent = ({ children }) => (
  <div className="dialog-inner">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="dialog-title">{children}</h2>
);
