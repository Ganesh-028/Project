import React from 'react';
import { FileText, Sparkles, Sun, Moon } from 'lucide-react';
import '../styles/Navbar.css';

export default function Navbar({ onLoadSample, theme, onToggleTheme }) {
    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="navbar-brand">
                    <div className="brand-icon">
                        <FileText size={18} />
                    </div>
                    <span className="brand-name">
                        <span className="gradient-text">ResumeAI</span>
                    </span>
                    <span className="brand-badge badge badge-accent">
                        <Sparkles size={10} /> AI-Powered
                    </span>
                </div>
                <div className="navbar-actions">
                    <button className="btn btn-ghost btn-sm" onClick={onLoadSample}>
                        Load Sample
                    </button>

                    {/* Theme Toggle */}
                    <button
                        className="theme-toggle"
                        onClick={onToggleTheme}
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        <div className={`theme-toggle-track ${theme === 'light' ? 'light' : ''}`}>
                            <span className="theme-icon sun"><Sun size={11} /></span>
                            <span className="theme-icon moon"><Moon size={11} /></span>
                            <div className="theme-toggle-thumb" />
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    );
}
