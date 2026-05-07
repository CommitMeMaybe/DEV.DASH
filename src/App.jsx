import { useState } from "react";
import { Routes, Route } from "react-router-dom";
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
import "./App.css";

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle sidebar">
        <Menu size={20} />
      </button>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

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
