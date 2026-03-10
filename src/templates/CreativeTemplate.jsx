import React from 'react';

function formatDate(d) {
    if (!d) return '';
    const [y, m] = d.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m, 10) - 1]} ${y}`;
}

const PINK = '#ec4899';
const PURPLE = '#8b5cf6';
const DARK = '#0f0f1e';

export default function CreativeTemplate({ data }) {
    const { personal, experience, education, skills, certifications, projects, settings } = data;
    const { fontFamily = "'Inter', 'Helvetica Neue', sans-serif", fontSize = '9.5pt' } = settings || {};
    const validExp = experience.filter(e => e.company || e.role);
    const validEdu = education.filter(e => e.institution);
    const validCerts = certifications.filter(c => c.name);
    const validProjs = projects.filter(p => p.name);

    return (
        <div style={{
            fontFamily,
            color: '#1a1a2e',
            background: '#ffffff',
            minHeight: '297mm',
            maxWidth: '210mm',
            margin: '0 auto',
            fontSize,
            lineHeight: 1.5,
        }}>
            {/* Header banner */}
            <div style={{ background: `linear-gradient(135deg, ${DARK} 0%, #1a1a35 60%, ${PURPLE}44 100%)`, color: 'white', padding: '36px 48px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `${PINK}22`, border: `2px solid ${PINK}44` }} />
                <div style={{ position: 'absolute', top: 20, right: 80, width: 60, height: 60, borderRadius: '50%', background: `${PURPLE}22`, border: `1px solid ${PURPLE}44` }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.1 }}>
                        {personal.fullName || 'Your Name'}
                    </h1>
                    {personal.title && (
                        <p style={{ margin: '6px 0 0', fontSize: '11pt', background: `linear-gradient(90deg, ${PINK}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 600 }}>
                            {personal.title}
                        </p>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 14, fontSize: '8.5pt', color: '#b0b0d8' }}>
                        {personal.email && <span>✉ {personal.email}</span>}
                        {personal.phone && <span>✆ {personal.phone}</span>}
                        {personal.location && <span>⚲ {personal.location}</span>}
                        {personal.linkedin && <span>in {personal.linkedin}</span>}
                        {personal.website && <span>⊕ {personal.website}</span>}
                    </div>
                </div>
            </div>

            {/* Accent bar */}
            <div style={{ height: 4, background: `linear-gradient(90deg, ${PINK}, ${PURPLE}, #6366f1)` }} />

            {/* Content */}
            <div style={{ padding: '28px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                {/* Left column */}
                <div>
                    {personal.summary && (
                        <CreativeSection title="About" color={PINK}>
                            <p style={{ margin: 0, color: '#4a4a6a' }}>{personal.summary}</p>
                        </CreativeSection>
                    )}

                    {validExp.length > 0 && (
                        <CreativeSection title="Experience" color={PURPLE}>
                            {validExp.map((exp, i) => (
                                <div key={exp.id} style={{ marginBottom: i < validExp.length - 1 ? 14 : 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: '10pt', color: '#1a1a2e' }}>{exp.role}</div>
                                    <div style={{ color: PURPLE, fontWeight: 600, fontSize: '8.5pt' }}>{exp.company}</div>
                                    <div style={{ color: '#9898b8', fontSize: '8pt', marginBottom: 4 }}>
                                        {formatDate(exp.startDate)}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : formatDate(exp.endDate)}
                                    </div>
                                    {exp.description && <div style={{ color: '#4a4a6a', whiteSpace: 'pre-line', fontSize: '9pt' }}>{exp.description}</div>}
                                </div>
                            ))}
                        </CreativeSection>
                    )}

                    {validProjs.length > 0 && (
                        <CreativeSection title="Projects" color={PINK}>
                            {validProjs.map((proj, i) => (
                                <div key={proj.id} style={{ marginBottom: i < validProjs.length - 1 ? 10 : 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: '9.5pt', color: '#1a1a2e' }}>{proj.name}</div>
                                    {proj.tech && <div style={{ fontSize: '8pt', color: PINK, marginBottom: 2 }}>{proj.tech}</div>}
                                    {proj.description && <div style={{ fontSize: '9pt', color: '#4a4a6a' }}>{proj.description}</div>}
                                </div>
                            ))}
                        </CreativeSection>
                    )}
                </div>

                {/* Right column */}
                <div>
                    {skills.length > 0 && (
                        <CreativeSection title="Skills" color={PINK}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                {skills.map(s => (
                                    <span key={s} style={{ padding: '3px 10px', borderRadius: 100, fontSize: '8.5pt', border: `1.5px solid ${PINK}55`, color: '#5a3a6a', background: `${PINK}0d`, fontWeight: 500 }}>{s}</span>
                                ))}
                            </div>
                        </CreativeSection>
                    )}

                    {validEdu.length > 0 && (
                        <CreativeSection title="Education" color={PURPLE}>
                            {validEdu.map(edu => (
                                <div key={edu.id} style={{ marginBottom: 10 }}>
                                    <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '9.5pt' }}>{edu.institution}</div>
                                    <div style={{ color: PURPLE, fontSize: '8.5pt' }}>{edu.degree} {edu.field}</div>
                                    <div style={{ color: '#9898b8', fontSize: '8pt' }}>{formatDate(edu.startDate)}{edu.startDate ? ' – ' : ''}{formatDate(edu.endDate)}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
                                </div>
                            ))}
                        </CreativeSection>
                    )}

                    {validCerts.length > 0 && (
                        <CreativeSection title="Certifications" color={PINK}>
                            {validCerts.map(cert => (
                                <div key={cert.id} style={{ marginBottom: 8 }}>
                                    <div style={{ fontWeight: 600, fontSize: '9pt', color: '#1a1a2e' }}>{cert.name}</div>
                                    {cert.issuer && <div style={{ color: '#7a7a9a', fontSize: '8.5pt' }}>{cert.issuer}{cert.date ? ' · ' + formatDate(cert.date) : ''}</div>}
                                </div>
                            ))}
                        </CreativeSection>
                    )}
                </div>
            </div>
        </div>
    );
}

function CreativeSection({ title, color, children }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${PURPLE})`, flexShrink: 0 }} />
                <h2 style={{ margin: 0, fontSize: '9pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#1a1a2e' }}>{title}</h2>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}44, transparent)` }} />
            </div>
            {children}
        </div>
    );
}
