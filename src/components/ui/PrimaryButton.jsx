import React from "react";
import "./PrimaryButton.css";

export default function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button className={`primary-btn ${className}`} {...props}>
      {children}
    </button>
  );
}
