import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

function formatDate(d) {
    if (!d) return '';
    const [y, m] = d.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function ProfessionalTemplate({ data }) {
    const { personal, experience, education, skills, certifications, projects, settings } = data;
    const { fontFamily = "'Georgia', serif", fontSize = '10pt' } = settings || {};
    const validExp = experience.filter(e => e.company || e.role);
    const validEdu = education.filter(e => e.institution);
    const validCerts = certifications.filter(c => c.name);
    const validProjs = projects.filter(p => p.name);

    return (
        <div className="resume-professional" style={{
            fontFamily,
            color: '#1a1a2e',
            background: '#ffffff',
            padding: '48px 52px',
            minHeight: '297mm',
            maxWidth: '210mm',
            margin: '0 auto',
            fontSize,
            lineHeight: 1.5,
        }}>
            {/* Header */}
            <div style={{ borderBottom: '2px solid #1a1a2e', paddingBottom: 14, marginBottom: 16 }}>
                <h1 style={{ fontFamily, margin: 0, fontSize: '2.2em', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
                    {personal.fullName || 'Your Name'}
                </h1>
                {personal.title && <p style={{ margin: '4px 0 0', fontSize: '12pt', color: '#4a4a6a', fontStyle: 'italic' }}>{personal.title}</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: 10, fontSize: '9pt', color: '#5a5a7a' }}>
                    {personal.email && <span>✉ {personal.email}</span>}
                    {personal.phone && <span>✆ {personal.phone}</span>}
                    {personal.location && <span>⚲ {personal.location}</span>}
                    {personal.linkedin && <span>in {personal.linkedin}</span>}
                    {personal.website && <span>⊕ {personal.website}</span>}
                </div>
            </div>

            {/* Summary */}
            {personal.summary && (
                <Section title="Professional Summary">
                    <p style={{ margin: 0, color: '#3a3a5a' }}>{personal.summary}</p>
                </Section>
            )}

            {/* Experience */}
            {validExp.length > 0 && (
                <Section title="Work Experience">
                    {validExp.map((exp, i) => (
                        <div key={exp.id} style={{ marginBottom: i < validExp.length - 1 ? 14 : 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <div>
                                    <strong style={{ fontSize: '10.5pt' }}>{exp.role}</strong>
                                    <span style={{ color: '#5a5a7a' }}> · {exp.company}</span>
                                </div>
                                <span style={{ color: '#8a8aaa', fontSize: '9pt', whiteSpace: 'nowrap' }}>
                                    {formatDate(exp.startDate)}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : formatDate(exp.endDate)}
                                </span>
                            </div>
                            {exp.description && (
                                <div style={{ marginTop: 5, color: '#3a3a5a', whiteSpace: 'pre-line', fontSize: '9.5pt' }}>
                                    {exp.description}
                                </div>
                            )}
                        </div>
                    ))}
                </Section>
            )}

            {/* Education */}
            {validEdu.length > 0 && (
                <Section title="Education">
                    {validEdu.map((edu, i) => (
                        <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: i < validEdu.length - 1 ? 10 : 0 }}>
                            <div>
                                <strong>{edu.institution}</strong>
                                {(edu.degree || edu.field) && <span style={{ color: '#5a5a7a' }}> · {edu.degree} {edu.field}</span>}
                                {edu.gpa && <span style={{ color: '#8a8aaa', fontSize: '9pt' }}> (GPA: {edu.gpa})</span>}
                            </div>
                            <span style={{ color: '#8a8aaa', fontSize: '9pt', whiteSpace: 'nowrap' }}>
                                {formatDate(edu.startDate)}{edu.startDate ? ' – ' : ''}{formatDate(edu.endDate)}
                            </span>
                        </div>
                    ))}
                </Section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <Section title="Skills">
                    <p style={{ margin: 0, color: '#3a3a5a' }}>{skills.join(' · ')}</p>
                </Section>
            )}

            {/* Projects */}
            {validProjs.length > 0 && (
                <Section title="Projects">
                    {validProjs.map((proj, i) => (
                        <div key={proj.id} style={{ marginBottom: i < validProjs.length - 1 ? 10 : 0 }}>
                            <strong>{proj.name}</strong>
                            {proj.tech && <span style={{ color: '#5a5a7a', fontSize: '9pt' }}> | {proj.tech}</span>}
                            {proj.description && <p style={{ margin: '3px 0 0', color: '#3a3a5a', fontSize: '9.5pt' }}>{proj.description}</p>}
                        </div>
                    ))}
                </Section>
            )}

            {/* Certifications */}
            {validCerts.length > 0 && (
                <Section title="Certifications">
                    {validCerts.map((cert, i) => (
                        <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < validCerts.length - 1 ? 6 : 0 }}>
                            <span><strong>{cert.name}</strong>{cert.issuer && <span style={{ color: '#5a5a7a' }}> · {cert.issuer}</span>}</span>
                            {cert.date && <span style={{ color: '#8a8aaa', fontSize: '9pt' }}>{formatDate(cert.date)}</span>}
                        </div>
                    ))}
                </Section>
            )}
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'inherit', fontSize: '1.05em', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#1a1a2e', borderBottom: '1px solid #d0d0e8', paddingBottom: 4, marginBottom: 10, margin: '0 0 8px 0' }}>
                {title}
            </h2>
            {children}
        </div>
    );
}
