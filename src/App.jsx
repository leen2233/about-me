import { useState, useEffect } from "react";
import "./App.css";
import "./styles/About.css";
import About from "./components/About";
import Projects from "./components/Projects";

function App() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="close"></span>
          <span className="minimize"></span>
          <span className="maximize"></span>
        </div>
        <div className="terminal-tabs">
          <button
            className={`terminal-tab ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            about
          </button>
          <button
            className={`terminal-tab ${
              activeTab === "projects" ? "active" : ""
            }`}
            onClick={() => setActiveTab("projects")}
          >
            projects
          </button>
        </div>
      </div>

      <div className="terminal-content">
        {activeTab === "about" && <About />}
        {activeTab === "projects" && <Projects />}
      </div>
    </div>
  );
}

export default App;
