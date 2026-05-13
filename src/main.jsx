import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Landing from "./pages/Landing";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Entry point: Landing (/) is a standalone page. All other routes (/*) use
// the app shell with sidebar via <App>. We keep them separate so Landing
// avoids layout overhead.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
