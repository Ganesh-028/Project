import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Lightbulb, TrendingUp } from 'lucide-react';
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

export default function ATSPanel({ atsResult }) {
    if (!atsResult) {
        return (
            <div className="ats-panel empty-ats">
                <TrendingUp size={32} className="empty-icon" />
                <p>Fill in your resume to see your ATS score</p>
            </div>
        );
    }

    const { score, grade, issues, suggestions, strengths } = atsResult;
    const badgeClass = score >= 80 ? 'badge-success' : score >= 60 ? 'badge-warning' : 'badge-danger';
    const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';

    return (
        <div className="ats-panel">
            <div className="ats-header">
                <div>
                    <h3 className="ats-title">ATS Score</h3>
                    <p className="ats-subtitle">Applicant Tracking System compatibility</p>
                </div>
                <span className={`badge ${badgeClass} ats-grade`}>{grade} · {label}</span>
            </div>

            <div className="ats-score-row">
                <ScoreCircle score={score} />
                <div className="ats-breakdown">
                    <div className="progress-item">
                        <span className="progress-label">Contact Info</span>
                        <div className="progress-bar-outer">
                            <div className="progress-bar-inner" style={{ width: `${Math.min(100, score * 1.2)}%` }} />
                        </div>
                    </div>
                    <div className="progress-item">
                        <span className="progress-label">Experience</span>
                        <div className="progress-bar-outer">
                            <div className="progress-bar-inner" style={{ width: `${Math.min(100, score * 0.9)}%` }} />
                        </div>
                    </div>
                    <div className="progress-item">
                        <span className="progress-label">Keywords</span>
                        <div className="progress-bar-outer">
                            <div className="progress-bar-inner" style={{ width: `${Math.min(100, score * 0.8)}%` }} />
                        </div>
                    </div>
                    <div className="progress-item">
                        <span className="progress-label">Skills</span>
                        <div className="progress-bar-outer">
                            <div className="progress-bar-inner" style={{ width: `${Math.min(100, score)}%` }} />
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
