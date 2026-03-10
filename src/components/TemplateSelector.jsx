import React from 'react';
import { Check, Layout, Briefcase, Palette } from 'lucide-react';
import '../styles/TemplateSelector.css';

const templates = [
    {
        id: 'professional',
        name: 'Professional',
        description: 'Clean, ATS-optimized single-column layout. Best for corporate roles.',
        icon: <Briefcase size={20} />,
        accentColor: '#6366f1',
        tags: ['ATS Best', 'Corporate', 'Classic'],
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Two-column layout with a dark sidebar. Great visual impact.',
        icon: <Layout size={20} />,
        accentColor: '#8b5cf6',
        tags: ['Visual', 'Tech', 'Two-Column'],
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Contemporary accented layout for design & creative professionals.',
        icon: <Palette size={20} />,
        accentColor: '#ec4899',
        tags: ['Design', 'Creative', 'Minimal'],
    },
];

export default function TemplateSelector({ selected, onSelect }) {
    return (
        <div className="template-selector">
            <div className="template-selector-header">
                <h3>Choose a Template</h3>
                <p>All templates are ATS-compatible</p>
            </div>
            <div className="template-grid">
                {templates.map(tpl => (
                    <button
                        key={tpl.id}
                        className={`template-card ${selected === tpl.id ? 'selected' : ''}`}
                        onClick={() => onSelect(tpl.id)}
                        style={{ '--tpl-accent': tpl.accentColor }}
                    >
                        <div className="template-icon-wrap" style={{ background: `${tpl.accentColor}22`, color: tpl.accentColor }}>
                            {tpl.icon}
                        </div>
                        <div className="template-info">
                            <div className="template-name">{tpl.name}</div>
                            <div className="template-desc">{tpl.description}</div>
                            <div className="template-tags">
                                {tpl.tags.map(t => (
                                    <span key={t} className="template-tag">{t}</span>
                                ))}
                            </div>
                        </div>
                        {selected === tpl.id && (
                            <div className="template-check">
                                <Check size={12} />
                            </div>
                        )}
                        <div className="template-preview-bar" />
                    </button>
                ))}
            </div>
        </div>
    );
}
