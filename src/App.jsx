import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Dashboard />
            </main>
          </div>
        }
      />
      <Route
        path="/analytics"
        element={
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Analytics />
            </main>
          </div>
        }
      />
      <Route
        path="/tasks"
        element={
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Tasks />
            </main>
          </div>
        }
      />
      <Route
        path="/weather"
        element={
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Weather />
            </main>
          </div>
        }
      />
      <Route
        path="/github"
        element={
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <GitHubPage />
            </main>
          </div>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
