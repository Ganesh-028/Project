import React from 'react';
import { Sparkles, ArrowRight, Target, UserPlus, FileCheck, ShieldAlert, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/TipsPanel.css';

const tips = [
  {
    id: 'ats-friendly',
    title: 'ATS-Friendly Guide',
    description: 'Learn how to beat the AI bots in 2026.',
    icon: <Target size={18} />,
    color: 'var(--accent-primary)'
  },
  {
    id: 'fresher-tips',
    title: 'Fresher Advice',
    description: 'Stand out even without experience.',
    icon: <UserPlus size={18} />,
    color: 'var(--success)'
  },
  {
    id: 'best-format',
    title: '2026 Best Format',
    description: 'The "Gold Standard" layout revealed.',
    icon: <FileCheck size={18} />,
    color: 'var(--warning)'
  },
  {
    id: 'mistakes-avoid',
    title: 'Avoid Top Mistakes',
    description: '10 errors that kill your chances.',
    icon: <ShieldAlert size={18} />,
    color: 'var(--error)'
  },
  {
    id: 'keywords-eng',
    title: 'Engineer Keywords',
    description: 'High-value terms for software roles.',
    icon: <Key size={18} />,
    color: 'var(--info)'
  }
];

export default function TipsPanel() {
  const navigate = useNavigate();

  return (
    <div className="tips-panel">
      <div className="tips-header">
        <div className="tips-title">
          <Sparkles size={16} className="sparkle-icon" />
          <span>Resume Success Tips</span>
        </div>
        <button className="view-all-btn">View All articles</button>
      </div>
      
      <div className="tips-grid">
        {tips.map((tip) => (
          <div 
            key={tip.id} 
            className="tip-card"
            onClick={() => navigate(`/tips/${tip.id}`)}
          >
            <div className="tip-card-icon" style={{ color: tip.color, backgroundColor: `${tip.color}15` }}>
              {tip.icon}
            </div>
            <div className="tip-card-content">
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </div>
            <div className="tip-card-arrow">
              <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
