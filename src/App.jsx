import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Tasks from "./pages/Tasks";
import Weather from "./pages/Weather";
import GitHubPage from "./pages/GitHub";
import NotFound from "./pages/NotFound";

const pageTitles = {
  "/dashboard": "COMMAND CENTER",
  "/analytics": "ANALYTICS ENGINE",
  "/tasks": "TASK MATRIX",
  "/weather": "WEATHER",
  "/github": "REPO EXPLORER",
};

// Shared layout: sidebar + main content area. Used by every authenticated page.
// Mobile gets a sticky top bar with hamburger toggle + current page title.
function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || "";

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <div className="mobile-top-bar">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle sidebar">
            <Menu size={20} />
          </button>
          <span className="mobile-top-title">{title}</span>
        </div>
        {children}
      </main>
    </div>
  );
}

// Top-level routing: public pages live outside AppLayout, dashboard pages inside it.
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
      <Route path="/tasks" element={<AppLayout><Tasks /></AppLayout>} />
      <Route path="/weather" element={<AppLayout><Weather /></AppLayout>} />
      <Route path="/github" element={<AppLayout><GitHubPage /></AppLayout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
