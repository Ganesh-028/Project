import React, { useState, useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { Download, Eye, Edit3, RotateCcw, Sparkles } from "lucide-react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import TemplateSelector from "./components/TemplateSelector";
import ATSPanel from "./components/ATSPanel";
import AdComponent from "./components/AdComponent";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";

import { initialResumeData, sampleResumeData } from "./data/resumeInitialState";
import { calculateATSScore } from "./services/aiService";

import "./index.css";
import "./styles/App.css";

export default function App() {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [template, setTemplate] = useState("professional");
  const [atsResult, setAtsResult] = useState(null);
  const [view, setView] = useState("editor");
  const [theme, setTheme] = useState("dark");

  const printRef = useRef();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = calculateATSScore(resumeData);
      setAtsResult(result);
    }, 600);

    return () => clearTimeout(timer);
  }, [resumeData]);

  const handlePrint = () => {
    const element = printRef.current;
    if (!element) return;

    const fileName = `${resumeData?.personal?.fullName || "Resume"}.pdf`;

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleLoadSample = () => setResumeData(sampleResumeData);

  const handleReset = () => {
    if (confirm("Reset all resume data?")) {
      setResumeData(initialResumeData);
    }
  };

  return (
    <Routes>
      {/* Home Page */}
      <Route
        path="/"
        element={
          <div className="app">
            <Navbar
              onLoadSample={handleLoadSample}
              theme={theme}
              onToggleTheme={toggleTheme}
            />

            <footer>
              <Link to="/about">About</Link> |{" "}
              <Link to="/contact">Contact</Link> |{" "}
              <Link to="/privacy">Privacy Policy</Link>
            </footer>

            <AdComponent />

            {atsResult && (
              <div className="ats-banner">
                <div className="ats-banner-inner">
                  <Sparkles size={14} />
                  <span>
                    ATS Score:{" "}
                    <strong>{atsResult.score}/100</strong>
                  </span>
                  <span className="ats-banner-grade">
                    Grade: {atsResult.grade}
                  </span>
                </div>
              </div>
            )}

            <main className="app-main">
              <aside className="sidebar">
                <TemplateSelector
                  selected={template}
                  onSelect={setTemplate}
                />

                <hr className="divider" />

                <ATSPanel atsResult={atsResult} />

                <hr className="divider" />

                <div className="sidebar-actions">
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    onClick={handlePrint}
                  >
                    <Download size={15} /> Download PDF
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={handleReset}
                  >
                    <RotateCcw size={13} /> Reset
                  </button>
                </div>
              </aside>

              <div className="main-area">
                <div className="mobile-toggle">
                  <button
                    className={`btn ${
                      view === "editor" ? "btn-primary" : "btn-secondary"
                    }`}
                    onClick={() => setView("editor")}
                  >
                    <Edit3 size={14} /> Edit
                  </button>

                  <button
                    className={`btn ${
                      view === "preview" ? "btn-primary" : "btn-secondary"
                    }`}
                    onClick={() => setView("preview")}
                  >
                    <Eye size={14} /> Preview
                  </button>
                </div>

                <div className="split-view">
                  <div
                    className={`editor-panel panel ${
                      view === "preview" ? "hidden-mobile" : ""
                    }`}
                  >
                    <div className="panel-header">
                      <h2 className="panel-title">
                        <Edit3 size={15} /> Fill Details
                      </h2>
                    </div>

                    <div className="panel-body">
                      <Editor
                        resumeData={resumeData}
                        onChange={setResumeData}
                      />
                    </div>
                  </div>

                  <div
                    className={`preview-panel panel ${
                      view === "editor" ? "hidden-mobile" : ""
                    }`}
                  >
                    <div className="panel-header">
                      <h2 className="panel-title">
                        <Eye size={15} /> Live Preview
                      </h2>

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handlePrint}
                      >
                        <Download size={13} /> PDF
                      </button>
                    </div>

                    <div className="panel-body preview-body">
                      <Preview
                        resumeData={resumeData}
                        template={template}
                        printRef={printRef}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        }
      />

      {/* Other Pages */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  );
}