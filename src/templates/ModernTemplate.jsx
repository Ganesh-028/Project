import React from 'react';

function formatDate(d) {
    if (!d) return '';
    const [y, m] = d.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m, 10) - 1]} ${y}`;
}

const ACCENT = '#6366f1';
const SIDEBAR_BG = '#1a1a35';

export default function ModernTemplate({ data }) {
    const { personal, experience, education, skills, certifications, projects, settings } = data;
    const { fontFamily = "'Inter', 'Helvetica Neue', sans-serif", fontSize = '9.5pt' } = settings || {};
    const validExp = experience.filter(e => e.company || e.role);
    const validEdu = education.filter(e => e.institution);
    const validCerts = certifications.filter(c => c.name);
    const validProjs = projects.filter(p => p.name);

    return (
        <div style={{
            display: 'flex',
            fontFamily,
            background: '#ffffff',
            minHeight: '297mm',
            maxWidth: '210mm',
            margin: '0 auto',
            fontSize,
            lineHeight: 1.5,
        }}>
            {/* Sidebar */}
            <div style={{ width: '32%', background: SIDEBAR_BG, color: '#e8e8f8', padding: '36px 20px', flexShrink: 0 }}>
                {/* Name */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22pt', fontWeight: 800, color: 'white', marginBottom: 14, boxShadow: `0 0 20px ${ACCENT}66` }}>
                        {(personal.fullName || 'R').charAt(0).toUpperCase()}
                    </div>
                    <h1 style={{ margin: 0, fontSize: '13pt', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>{personal.fullName || 'Your Name'}</h1>
                    {personal.title && <p style={{ margin: '5px 0 0', fontSize: '9pt', color: ACCENT, fontWeight: 500 }}>{personal.title}</p>}
                </div>

                {/* Contact */}
                <SideSection title="Contact">
                    {personal.email && <SideItem label="Email" value={personal.email} />}
                    {personal.phone && <SideItem label="Phone" value={personal.phone} />}
                    {personal.location && <SideItem label="Location" value={personal.location} />}
                    {personal.linkedin && <SideItem label="LinkedIn" value={personal.linkedin} />}
                    {personal.website && <SideItem label="Website" value={personal.website} />}
                </SideSection>

                {/* Skills */}
                {skills.length > 0 && (
                    <SideSection title="Skills">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                            {skills.map(s => (
                                <span key={s} style={{ background: 'rgba(99,102,241,0.2)', border: `1px solid ${ACCENT}55`, borderRadius: 100, padding: '2px 8px', fontSize: '8pt', color: '#c8c8f8' }}>{s}</span>
                            ))}
                        </div>
                    </SideSection>
                )}

                {/* Education */}
                {validEdu.length > 0 && (
                    <SideSection title="Education">
                        {validEdu.map(edu => (
                            <div key={edu.id} style={{ marginBottom: 10 }}>
                                <div style={{ fontWeight: 600, color: '#e8e8f8', fontSize: '9pt' }}>{edu.degree} {edu.field}</div>
                                <div style={{ color: '#a0a0c8', fontSize: '8.5pt' }}>{edu.institution}</div>
                                <div style={{ color: '#6868a0', fontSize: '8pt' }}>{formatDate(edu.startDate)}{edu.startDate ? ' – ' : ''}{formatDate(edu.endDate)}</div>
                                {edu.gpa && <div style={{ color: '#8080b0', fontSize: '8pt' }}>GPA: {edu.gpa}</div>}
                            </div>
                        ))}
                    </SideSection>
                )}

                {/* Certifications */}
                {validCerts.length > 0 && (
                    <SideSection title="Certifications">
                        {validCerts.map(cert => (
                            <div key={cert.id} style={{ marginBottom: 8 }}>
                                <div style={{ fontWeight: 600, color: '#e8e8f8', fontSize: '8.5pt' }}>{cert.name}</div>
                                {cert.issuer && <div style={{ color: '#a0a0c8', fontSize: '8pt' }}>{cert.issuer}</div>}
                                {cert.date && <div style={{ color: '#6868a0', fontSize: '8pt' }}>{formatDate(cert.date)}</div>}
                            </div>
                        ))}
                    </SideSection>
                )}
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '36px 32px' }}>
                {/* Summary */}
                {personal.summary && (
                    <MainSection title="About Me" accent={ACCENT}>
                        <p style={{ margin: 0, color: '#3a3a5a' }}>{personal.summary}</p>
                    </MainSection>
                )}

                {/* Experience */}
                {validExp.length > 0 && (
                    <MainSection title="Work Experience" accent={ACCENT}>
                        {validExp.map((exp, i) => (
                            <div key={exp.id} style={{ marginBottom: i < validExp.length - 1 ? 16 : 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '10pt', color: '#1a1a2e' }}>{exp.role}</div>
                                        <div style={{ fontWeight: 500, color: ACCENT, fontSize: '9pt' }}>{exp.company}</div>
                                    </div>
                                    <span style={{ color: '#9090b0', fontSize: '8.5pt', whiteSpace: 'nowrap', marginLeft: 8, marginTop: 2 }}>
                                        {formatDate(exp.startDate)}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : formatDate(exp.endDate)}
                                    </span>
                                </div>
                                {exp.description && (
                                    <div style={{ color: '#4a4a6a', whiteSpace: 'pre-line', fontSize: '9pt', marginTop: 4 }}>
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </MainSection>
                )}

                {/* Projects */}
                {validProjs.length > 0 && (
                    <MainSection title="Projects" accent={ACCENT}>
                        {validProjs.map((proj, i) => (
                            <div key={proj.id} style={{ marginBottom: i < validProjs.length - 1 ? 12 : 0 }}>
                                <div style={{ fontWeight: 700, fontSize: '9.5pt', color: '#1a1a2e' }}>{proj.name}</div>
                                {proj.tech && <div style={{ fontSize: '8.5pt', color: ACCENT, marginBottom: 2 }}>{proj.tech}</div>}
                                {proj.description && <div style={{ fontSize: '9pt', color: '#4a4a6a' }}>{proj.description}</div>}
                            </div>
                        ))}
                    </MainSection>
                )}
            </div>
        </div>
    );
}

function SideSection({ title, children }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#6366f1', fontWeight: 700, marginBottom: 10, borderBottom: '1px solid rgba(99,102,241,0.3)', paddingBottom: 5 }}>{title}</div>
            {children}
        </div>
    );
}

function SideItem({ label, value }) {
    return (
        <div style={{ marginBottom: 7 }}>
            <div style={{ fontSize: '7.5pt', color: '#6868a0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            <div style={{ fontSize: '8.5pt', color: '#c8c8f8', wordBreak: 'break-all' }}>{value}</div>
        </div>
    );
}

function MainSection({ title, accent, children }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 3, height: 16, background: accent, borderRadius: 3 }} />
                <h2 style={{ margin: 0, fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#1a1a2e' }}>{title}</h2>
            </div>
            {children}
        </div>
    );
}
