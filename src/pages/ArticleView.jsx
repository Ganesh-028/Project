import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, User, Clock } from 'lucide-react';
import { articleData } from '../data/articleData';
import '../styles/ArticleView.css';

export default function ArticleView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = articleData[id];

  if (!article) {
    return (
      <div className="article-not-found">
        <h2>Article not found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">Go Back Home</button>
      </div>
    );
  }

  // Simple Markdown-like renderer (handling basic syntax)
  const renderContent = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) return <h1 key={index}>{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={index}>{line.replace('## ', '')}</h2>;
      if (line.startsWith('- ')) return <li key={index}>{line.replace('- ', '')}</li>;
      if (line.trim() === '') return <br key={index} />;
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div className="article-container">
      <div className="article-nav">
        <button onClick={() => navigate('/')} className="back-link">
          <ChevronLeft size={16} /> Back to Editor
        </button>
      </div>
      
      <article className="article-content">
        <header className="article-header">
          <h1>{article.title}</h1>
          <div className="article-meta">
            <span><Calendar size={14} /> 2026 Edition</span>
            <span><User size={14} /> ResumeAI Team</span>
            <span><Clock size={14} /> 5 min read</span>
          </div>
        </header>
        
        <div className="article-body">
          {renderContent(article.content)}
        </div>
      </article>

      <footer className="article-footer">
        <div className="next-steps">
          <h3>Ready to apply these tips?</h3>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Start Building Your Resume
          </button>
        </div>
      </footer>
    </div>
  );
}
