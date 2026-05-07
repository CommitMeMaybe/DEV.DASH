import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, LogIn } from "lucide-react";
import "./Landing.css";
import OnboardingModal from "../components/OnboardingModal";
import PrimaryButton from "../components/ui/PrimaryButton";
import IconChart from "../components/ui/IconChart";
import IconClock from "../components/ui/IconClock";
import IconCheck from "../components/ui/IconCheck";
import IconTrend from "../components/ui/IconTrend";

const features = [
  {
    icon: <IconChart />,
    title: "Track GitHub Performance",
    desc: "Monitor commits, pull requests, and contributions across all your repositories in real time.",
  },
  {
    icon: <IconClock />,
    title: "Stay Consistent",
    desc: "Visual streaks and activity insights help you build and maintain productive habits.",
  },
  {
    icon: <IconCheck />,
    title: "Manage Tasks in Context",
    desc: "Lightweight task tracking that lives alongside your development metrics — no context switching.",
  },
  {
    icon: <IconTrend />,
    title: "Live Environment Data",
    desc: "Keep tabs on local weather conditions without leaving your developer workflow.",
  },
];

const modules = [
  { icon: <IconChart />, label: "Dashboard" },
  { icon: <IconTrend />, label: "Analytics" },
  { icon: <IconCheck />, label: "Tasks" },
  { icon: <IconClock />, label: "Weather" },
];

const steps = [
  { num: "01", title: "Connect GitHub", desc: "Enter your GitHub username to pull public activity data." },
  { num: "02", title: "View Insights", desc: "Get a clear dashboard of your commits, trends, and consistency." },
  { num: "03", title: "Stay Consistent", desc: "Build streaks, track progress, and ship more over time." },
];

export default function Landing() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleEnter = () => setShowModal(true);

  return (
    <div className="landing">
      {/* 1. Navigation Bar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <Terminal className="landing-brand-icon" size={24} />
            <span className="landing-brand-text retro">SYS.DEV</span>
          </div>
          <PrimaryButton onClick={handleEnter} className="landing-nav-btn">
            <LogIn size={18} />
            Enter Dashboard
          </PrimaryButton>
        </div>
      </nav>

      {/* 2. Hero Section — Two-column split */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-hero-left">
            <div className="landing-hero-badge">
              <span className="landing-badge-pulse" />
              Personal Command Center
            </div>
            <h1 className="landing-hero-title">
              Track.
              <br />
              <span className="landing-hero-accent">Focus.</span>
              <br />
              Ship.
            </h1>
            <p className="landing-hero-sub">
              A focused developer dashboard for tracking GitHub activity,
              managing tasks, and monitoring your environment — all in one place.
            </p>
            <div className="landing-hero-actions">
              <PrimaryButton onClick={handleEnter} className="landing-hero-primary">
                <LogIn size={18} />
                Enter Dashboard
              </PrimaryButton>
              <a href="#features" className="landing-hero-secondary">
                View Features ↓
              </a>
            </div>
          </div>
          <div className="landing-hero-right">
            <div className="landing-preview">
              <div className="landing-preview-bar">
                <span className="landing-preview-dot landing-preview-dot-r" />
                <span className="landing-preview-dot landing-preview-dot-y" />
                <span className="landing-preview-dot landing-preview-dot-g" />
                <span className="landing-preview-url">sys.dev/dashboard</span>
              </div>
              <div className="landing-preview-body">
                <div className="landing-preview-side" />
                <div className="landing-preview-content">
                  <div className="landing-preview-row">
                    <div className="landing-preview-card landing-preview-card-lg">
                      <span className="landing-preview-label">Commits</span>
                      <span className="landing-preview-value retro">1,247</span>
                      <div className="landing-preview-bar-fill-wrap">
                        <div className="landing-preview-bar-fill" style={{ width: "78%" }} />
                      </div>
                    </div>
                    <div className="landing-preview-card">
                      <span className="landing-preview-label">Streak</span>
                      <span className="landing-preview-value retro accent">14d</span>
                    </div>
                  </div>
                  <div className="landing-preview-row">
                    <div className="landing-preview-card">
                      <span className="landing-preview-label">Open PRs</span>
                      <span className="landing-preview-value retro">3</span>
                    </div>
                    <div className="landing-preview-card">
                      <span className="landing-preview-label">Weather</span>
                      <span className="landing-preview-value retro">72°F</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Grid — 2x2 Bento */}
      <section className="landing-features" id="features">
        <div className="landing-features-inner">
          <div className="landing-section-label">
            <span className="landing-label-dot" />
            WHY SYS.DEV
          </div>
          <h2 className="landing-section-title">Built for developers<br />who value clarity.</h2>
          <div className="landing-features-grid">
            {features.map((f, i) => (
              <div key={i} className="landing-feature-card">
                <div className="landing-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Component Preview — Horizontal 4-column icon row */}
      <section className="landing-modules">
        <div className="landing-modules-inner">
          <div className="landing-section-label">
            <span className="landing-label-dot" />
            MODULES
          </div>
          <div className="landing-modules-row">
            {modules.map((m, i) => (
              <div key={i} className="landing-module-card">
                <span className="landing-module-icon">{m.icon}</span>
                <span className="landing-module-label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Process Walkthrough — 3-column horizontal */}
      <section className="landing-steps" id="how-it-works">
        <div className="landing-steps-inner">
          <div className="landing-section-label">
            <span className="landing-label-dot" />
            HOW IT WORKS
          </div>
          <h2 className="landing-section-title">Up and running<br />in seconds.</h2>
          <div className="landing-steps-row">
            {steps.map((s, i) => (
              <div key={i} className="landing-step-card">
                <div className="landing-step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Transparency / Trust */}
      <section className="landing-trust">
        <div className="landing-trust-inner">
          <div className="landing-section-label">
            <span className="landing-label-dot" />
            TRANSPARENCY
          </div>
          <div className="landing-trust-card">
            <h3>Built for transparency.</h3>
            <ul className="landing-trust-list">
              <li><span className="landing-trust-check">✓</span> Uses only public GitHub APIs</li>
              <li><span className="landing-trust-check">✓</span> No account required — enter and go</li>
              <li><span className="landing-trust-check">✓</span> Zero data stored beyond local session</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7. Closing CTA */}
      <section className="landing-cta">
        <div className="landing-cta-inner">
          <h2 className="landing-cta-title">Ready to take control?</h2>
          <p className="landing-cta-sub">No signup. No setup. Just your command center.</p>
          <PrimaryButton onClick={handleEnter} className="landing-cta-btn">
            <LogIn size={18} />
            Enter Dashboard
          </PrimaryButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-left">
            <Terminal size={16} />
            SYS.DEV
            <span className="landing-footer-version">v1.0</span>
          </div>
          <div className="landing-footer-right">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="landing-footer-sep">·</span>
            <span>Built with React + Vite</span>
            <span className="landing-footer-sep">·</span>
            <span>GitHub Public API</span>
          </div>
        </div>
      </footer>

      {showModal && <OnboardingModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
