import React, { useState } from 'react';
import { Upload, FileText, X, AlertCircle, Sparkles } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function FileUploader({ onAnalysisComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractTextFromPDF = async (arrayBuffer) => {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + ' ';
    }
    
    return fullText;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const text = await extractTextFromPDF(arrayBuffer);
      onAnalysisComplete(text);
    } catch (err) {
      console.error('PDF Analysis Error:', err);
      setError('Failed to analyze PDF. Please try again or fill manually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-uploader">
      <div className="upload-container">
        <input
          type="file"
          id="resume-upload"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden-input"
        />
        <label htmlFor="resume-upload" className={`upload-label ${loading ? 'loading' : ''}`}>
          {loading ? (
            <div className="upload-loading">
              <span className="spinner" />
              <span>Analyzing Resume...</span>
            </div>
          ) : (
            <>
              <Upload size={20} />
              <div className="upload-text">
                <strong>Import Existing Resume</strong>
                <span>Upload PDF to get instant ATS score</span>
              </div>
            </>
          )}
        </label>
      </div>
      
      {error && (
        <div className="upload-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      <style jsx>{`
        .file-uploader {
          margin-bottom: 1rem;
        }
        .hidden-input {
          display: none;
        }
        .upload-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(var(--accent-primary-rgb), 0.1);
          border: 1px dashed var(--accent-primary);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .upload-label:hover {
          background: rgba(var(--accent-primary-rgb), 0.15);
          transform: translateY(-2px);
        }
        .upload-text {
          display: flex;
          flex-direction: column;
        }
        .upload-text strong {
          font-size: 0.85rem;
          color: var(--accent-primary);
        }
        .upload-text span {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }
        .upload-loading {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--accent-primary);
          font-weight: 500;
        }
        .upload-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          color: var(--error);
          font-size: 0.75rem;
          background: rgba(var(--error-rgb), 0.1);
          padding: 0.5rem;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
