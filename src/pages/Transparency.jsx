import React from "react";
import TransparencyList from "../components/ui/TransparencyList";

export default function Transparency() {
  return (
    <section style={{ margin: "3rem 0" }}>
      <h2
        style={{
          color: "#00ff99",
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: 700,
          fontSize: "1.3rem",
          marginBottom: "1.5rem",
        }}
      >
        Built on transparency
      </h2>
      <TransparencyList />
    </section>
  );
}
