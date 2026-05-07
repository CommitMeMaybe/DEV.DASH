import React from "react";
import "./TransparencyList.css";

const items = [
  "Uses public GitHub API—no authentication or sensitive data required",
  "All data stays local. Nothing is stored on external servers",
  "Minimal setup. No account creation. Just enter and start tracking",
];

export default function TransparencyList() {
  return (
    <ul className="transparency-list">
      {items.map((item, i) => (
        <li key={i}>
          <span className="transparency-dot" />
          <span className="transparency-text">{item}</span>
        </li>
      ))}
    </ul>
  );
}
