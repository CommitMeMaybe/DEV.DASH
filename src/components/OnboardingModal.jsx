import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OnboardingModal.css";
import PrimaryButton from "./ui/PrimaryButton";

export default function OnboardingModal({ onClose }) {
  const navigate = useNavigate();
  const [github, setGithub] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!github.trim() || !location.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    localStorage.setItem("githubUser", github.trim());
    localStorage.setItem("preferredCity", location.trim());
    setError("");
    onClose();
    navigate("/dashboard");
  };

  return (
    <div className="onboarding-modal-backdrop">
      <div className="onboarding-modal">
        <button
          className="onboarding-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="onboarding-title">Welcome!</h2>
        <form className="onboarding-form" onSubmit={handleSubmit}>
          <label>
            GitHub Username
            <input
              type="text"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="e.g. octocat"
              autoFocus
            />
          </label>
          <label>
            Preferred City
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco"
            />
            <span className="onboarding-hint">
              Your city helps us show you local weather on your dashboard. This
              info is only used locally and never shared.
            </span>
          </label>
          {error && <div className="onboarding-error">{error}</div>}
          <PrimaryButton className="onboarding-submit" type="submit">
            Continue
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
