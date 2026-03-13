import { CheckCircle, AlertCircle, XCircle, Lightbulb, TrendingUp, Sparkles } from 'lucide-react';
import FileUploader from './FileUploader';
import { analyzeRawText } from '../services/aiService';
import '../styles/ATSPanel.css';

function ScoreCircle({ score }) {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference - (score / 100) * circumference;
    const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

    return (
        <div className="score-circle-wrap">
            <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                    cx="55" cy="55" r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={progress}
                    strokeLinecap="round"
                    transform="rotate(-90 55 55)"
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}80)` }}
                />
            </svg>
            <div className="score-circle-inner">
                <span className="score-number" style={{ color }}>{score}</span>
                <span className="score-label">/ 100</span>
            </div>
        </div>
    );
}

export default function ATSPanel({ atsResult, onScanComplete, onPopulate }) {
    const handleScan = async (text) => {
        const result = await analyzeRawText(text);
        onScanComplete(result);
    };

    if (!atsResult) {
        return (
            <div className="ats-panel">
                 <div className="ats-header" style={{ marginBottom: '1.5rem' }}>
                    <div>
                        <h3 className="ats-title">ATS Score Checker</h3>
                        <p className="ats-subtitle">Upload or fill details to start</p>
                    </div>
                </div>
                <FileUploader onAnalysisComplete={handleScan} />
                <div className="empty-ats" style={{ marginTop: '1rem' }}>
                    <TrendingUp size={32} className="empty-icon" />
                    <p>Fill in your resume or upload a PDF to see your ATS score</p>
                </div>
            </div>
        );
    }

    const { score, grade, issues, suggestions, strengths, breakdown } = atsResult;
    const badgeClass = score >= 80 ? 'badge-success' : score >= 60 ? 'badge-warning' : 'badge-danger';
    const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';

    const getPercent = (cat) => {
        if (!breakdown || !breakdown[cat]) return 0;
        return (breakdown[cat].score / breakdown[cat].max) * 100;
    };

    return (
        <div className="ats-panel">
            <div className="ats-header">
                <div>
                    <h3 className="ats-title">ATS Score</h3>
                    <p className="ats-subtitle">Applicant Tracking System compatibility</p>
                </div>
                <span className={`badge ${badgeClass} ats-grade`}>{grade} · {label}</span>
            </div>

            <FileUploader onAnalysisComplete={handleScan} />

            {atsResult.parsedData && (
                <button className="btn btn-primary btn-sm populate-btn" onClick={onPopulate}>
                    <Sparkles size={14} /> Auto-Fill Editor from Scanned File
                </button>
            )}

            <div className="ats-score-row">
                <ScoreCircle score={score} />
                <div className="ats-breakdown">
                    <div className="progress-item">
                        <div className="progress-header">
                            <span className="progress-label">Contact & Info</span>
                            <span className="progress-value">{Math.round(getPercent('completeness'))}%</span>
                        </div>
                        <div className="progress-bar-outer">
                            <div className="progress-bar-inner" style={{ width: `${getPercent('completeness')}%` }} />
                        </div>
                    </div>
                    <div className="progress-item">
                        <div className="progress-header">
                            <span className="progress-label">Impact & Metrics</span>
                            <span className="progress-value">{Math.round(getPercent('impact'))}%</span>
                        </div>
                        <div className="progress-bar-outer">
                            <div className="progress-bar-inner" style={{ width: `${getPercent('impact')}%` }} />
                        </div>
                    </div>
                    <div className="progress-item">
                        <div className="progress-header">
                            <span className="progress-label">Keywords</span>
                            <span className="progress-value">{Math.round(getPercent('keywords'))}%</span>
                        </div>
                        <div className="progress-bar-outer">
                            <div className="progress-bar-inner" style={{ width: `${getPercent('keywords')}%` }} />
                        </div>
                    </div>
                    <div className="progress-item">
                        <div className="progress-header">
                            <span className="progress-label">Extra Credentials</span>
                            <span className="progress-value">{Math.round(getPercent('extra'))}%</span>
                        </div>
                        <div className="progress-bar-outer">
                            <div className="progress-bar-inner" style={{ width: `${getPercent('extra')}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {strengths.length > 0 && (
                <div className="ats-section">
                    <h4 className="ats-section-title"><CheckCircle size={14} className="icon-success" /> Strengths</h4>
                    <ul className="ats-list strengths-list">
                        {strengths.slice(0, 4).map((s, i) => (
                            <li key={i}><CheckCircle size={12} /> {s}</li>
                        ))}
                    </ul>
                </div>
            )}

            {issues.length > 0 && (
                <div className="ats-section">
                    <h4 className="ats-section-title"><XCircle size={14} className="icon-danger" /> Issues</h4>
                    <ul className="ats-list issues-list">
                        {issues.map((iss, i) => (
                            <li key={i}><AlertCircle size={12} /> {iss}</li>
                        ))}
                    </ul>
                </div>
            )}

            {suggestions.length > 0 && (
                <div className="ats-section">
                    <h4 className="ats-section-title"><Lightbulb size={14} className="icon-warning" /> Suggestions</h4>
                    <ul className="ats-list suggestions-list">
                        {suggestions.slice(0, 4).map((s, i) => (
                            <li key={i}><Lightbulb size={12} /> {s}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
