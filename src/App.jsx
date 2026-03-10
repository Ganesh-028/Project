import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, Eye, Edit3, RotateCcw, Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import TemplateSelector from './components/TemplateSelector';
import ATSPanel from './components/ATSPanel';
import { initialResumeData, sampleResumeData } from './data/resumeInitialState';
import { calculateATSScore } from './services/aiService';
import './index.css';
import './styles/App.css';

export default function App() {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [template, setTemplate] = useState('professional');
  const [atsResult, setAtsResult] = useState(null);
  const [view, setView] = useState('editor'); // 'editor' | 'preview'
  const [theme, setTheme] = useState('dark');
  const printRef = useRef();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Debounced ATS scoring
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = calculateATSScore(resumeData);
      setAtsResult(result);
    }, 600);
    return () => clearTimeout(timer);
  }, [resumeData]);

  // We use a ref to store the latest options to avoid useReactToPrint staleness
  const resumeDataRef = useRef(resumeData);
  useEffect(() => {
    resumeDataRef.current = resumeData;
  }, [resumeData]);

  const promiseResolveRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the promise, letting react-to-print know the DOM is updated
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: () => `${resumeDataRef.current?.personal?.fullName || 'Resume'} - Resume`,
    onBeforePrint: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
    pageStyle: `
      @page { size: A4; margin: 0; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    `,
  });

  const handleLoadSample = () => setResumeData(sampleResumeData);
  const handleReset = () => { if (confirm('Reset all resume data?')) setResumeData(initialResumeData); };

  return (
    <div className="app">
      <Navbar
        onLoadSample={handleLoadSample}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* ATS score banner */}
      {atsResult && (
        <div className="ats-banner">
          <div className="ats-banner-inner">
            <Sparkles size={14} />
            <span>ATS Score: <strong style={{ color: atsResult.score >= 80 ? 'var(--success)' : atsResult.score >= 60 ? 'var(--warning)' : 'var(--danger)' }}>{atsResult.score}/100</strong></span>
            <span className="ats-banner-grade" style={{ color: 'var(--text-muted)' }}>Grade: {atsResult.grade}</span>
            <div className="ats-banner-bar">
              <div className="ats-banner-fill" style={{ width: `${atsResult.score}%`, background: atsResult.score >= 80 ? 'var(--success)' : atsResult.score >= 60 ? 'var(--warning)' : 'var(--danger)' }} />
            </div>
          </div>
        </div>
      )}

      <main className="app-main">
        {/* Left sidebar */}
        <aside className="sidebar">
          <TemplateSelector selected={template} onSelect={setTemplate} />
          <hr className="divider" />
          <ATSPanel atsResult={atsResult} />
          <hr className="divider" />
          <div className="sidebar-actions">
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handlePrint}>
              <Download size={15} /> Download PDF
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleReset}>
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </aside>

        {/* Main area */}
        <div className="main-area">
          {/* Mobile toggle */}
          <div className="mobile-toggle">
            <button className={`btn ${view === 'editor' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('editor')}>
              <Edit3 size={14} /> Edit
            </button>
            <button className={`btn ${view === 'preview' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('preview')}>
              <Eye size={14} /> Preview
            </button>
          </div>

          <div className="split-view">
            {/* Editor panel */}
            <div className={`editor-panel panel ${view === 'preview' ? 'hidden-mobile' : ''}`}>
              <div className="panel-header">
                <h2 className="panel-title"><Edit3 size={15} /> Fill Details</h2>
              </div>
              <div className="panel-body">
                <Editor resumeData={resumeData} onChange={setResumeData} />
              </div>
            </div>

            {/* Preview panel */}
            <div className={`preview-panel panel ${view === 'editor' ? 'hidden-mobile' : ''}`}>
              <div className="panel-header">
                <h2 className="panel-title"><Eye size={15} /> Live Preview</h2>
                <button className="btn btn-primary btn-sm" onClick={handlePrint}>
                  <Download size={13} /> PDF
                </button>
              </div>
              <div className="panel-body preview-body">
                <Preview resumeData={resumeData} template={template} printRef={printRef} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
