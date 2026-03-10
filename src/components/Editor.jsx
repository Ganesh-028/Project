import React, { useState } from 'react';
import {
    User, Briefcase, GraduationCap, Code, Award, FolderGit2,
    Languages, Plus, Trash2, Wand2, ChevronDown, ChevronUp, Palette
} from 'lucide-react';
import { generateAISummary, enhanceBulletPoint } from '../services/aiService';
import '../styles/Editor.css';

const TABS = [
    { id: 'personal', label: 'Personal', icon: <User size={14} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={14} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={14} /> },
    { id: 'skills', label: 'Skills', icon: <Code size={14} /> },
    { id: 'certifications', label: 'Certs', icon: <Award size={14} /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 size={14} /> },
    { id: 'design', label: 'Design', icon: <Palette size={14} /> },
];

function PersonalSection({ data, onChange }) {
    const [genLoading, setGenLoading] = useState(false);

    const set = (key, val) => onChange({ ...data, [key]: val });

    const handleGenSummary = async () => {
        setGenLoading(true);
        try {
            const summary = await generateAISummary({ personal: data, skills: [] });
            set('summary', summary);
        } finally {
            setGenLoading(false);
        }
    };

    return (
        <div className="section-form animate-fade-in-up">
            <div className="grid-2">
                <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" placeholder="Alex Johnson" value={data.fullName} onChange={e => set('fullName', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Job Title *</label>
                    <input className="form-input" placeholder="Senior Software Engineer" value={data.title} onChange={e => set('title', e.target.value)} />
                </div>
            </div>
            <div className="grid-2">
                <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" placeholder="alex@email.com" value={data.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" placeholder="+1 (555) 000-0000" value={data.phone} onChange={e => set('phone', e.target.value)} />
                </div>
            </div>
            <div className="grid-2">
                <div className="form-group">
                    <label className="form-label">Location</label>
                    <input className="form-input" placeholder="San Francisco, CA" value={data.location} onChange={e => set('location', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">LinkedIn</label>
                    <input className="form-input" placeholder="linkedin.com/in/username" value={data.linkedin} onChange={e => set('linkedin', e.target.value)} />
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Website / Portfolio</label>
                <input className="form-input" placeholder="yourwebsite.com" value={data.website} onChange={e => set('website', e.target.value)} />
            </div>
            <div className="form-group">
                <div className="label-row">
                    <label className="form-label">Professional Summary</label>
                    <button className="btn btn-ghost btn-sm ai-btn" onClick={handleGenSummary} disabled={genLoading}>
                        {genLoading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Wand2 size={13} />}
                        {genLoading ? 'Generating...' : 'AI Generate'}
                    </button>
                </div>
                <textarea className="form-input" rows={4} placeholder="Write a compelling professional summary..." value={data.summary} onChange={e => set('summary', e.target.value)} />
                <p className="input-hint">{data.summary?.length || 0}/500 characters · Aim for 2-4 sentences</p>
            </div>
        </div>
    );
}

function ExperienceSection({ data, onChange }) {
    const [expandedId, setExpandedId] = useState(data[0]?.id);
    const [enhancing, setEnhancing] = useState(null);

    const addEntry = () => {
        const newId = `exp-${Date.now()}`;
        onChange([...data, { id: newId, company: '', role: '', startDate: '', endDate: '', current: false, description: '' }]);
        setExpandedId(newId);
    };

    const removeEntry = (id) => onChange(data.filter(e => e.id !== id));

    const updateEntry = (id, key, val) => onChange(data.map(e => e.id === id ? { ...e, [key]: val } : e));

    const handleEnhance = async (id, text) => {
        setEnhancing(id);
        try {
            const enhanced = await enhanceBulletPoint(text);
            updateEntry(id, 'description', enhanced);
        } finally {
            setEnhancing(null);
        }
    };

    return (
        <div className="section-form animate-fade-in-up">
            {data.map((exp, idx) => (
                <div key={exp.id} className="entry-card">
                    <div className="entry-header" onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}>
                        <div className="entry-title">
                            <Briefcase size={14} className="entry-icon" />
                            <span>{exp.role || exp.company || `Experience ${idx + 1}`}</span>
                            {exp.company && exp.role && <span className="entry-sub">@ {exp.company}</span>}
                        </div>
                        <div className="entry-actions" onClick={e => e.stopPropagation()}>
                            {data.length > 1 && <button className="icon-btn danger" onClick={() => removeEntry(exp.id)}><Trash2 size={13} /></button>}
                            <button className="icon-btn">{expandedId === exp.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
                        </div>
                    </div>
                    {expandedId === exp.id && (
                        <div className="entry-body">
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Company *</label>
                                    <input className="form-input" placeholder="Acme Corp" value={exp.company} onChange={e => updateEntry(exp.id, 'company', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Role / Title *</label>
                                    <input className="form-input" placeholder="Software Engineer" value={exp.role} onChange={e => updateEntry(exp.id, 'role', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Start Date</label>
                                    <input className="form-input" type="month" value={exp.startDate} onChange={e => updateEntry(exp.id, 'startDate', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">End Date</label>
                                    <input className="form-input" type="month" value={exp.endDate} disabled={exp.current} onChange={e => updateEntry(exp.id, 'endDate', e.target.value)} />
                                </div>
                            </div>
                            <label className="checkbox-row">
                                <input type="checkbox" checked={exp.current} onChange={e => { updateEntry(exp.id, 'current', e.target.checked); if (e.target.checked) updateEntry(exp.id, 'endDate', ''); }} />
                                <span className="form-label">Currently working here</span>
                            </label>
                            <div className="form-group">
                                <div className="label-row">
                                    <label className="form-label">Description (use bullets)</label>
                                    <button className="btn btn-ghost btn-sm ai-btn" disabled={enhancing === exp.id} onClick={() => handleEnhance(exp.id, exp.description)}>
                                        {enhancing === exp.id ? <span className="spinner" style={{ width: 13, height: 13 }} /> : <Wand2 size={13} />}
                                        {enhancing === exp.id ? 'Enhancing...' : 'AI Enhance'}
                                    </button>
                                </div>
                                <textarea className="form-input" rows={5} placeholder="• Led a team of 5 engineers...&#10;• Reduced page load time by 40%..." value={exp.description} onChange={e => updateEntry(exp.id, 'description', e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <button className="btn btn-secondary btn-sm add-btn" onClick={addEntry}><Plus size={14} /> Add Experience</button>
        </div>
    );
}

function EducationSection({ data, onChange }) {
    const [expandedId, setExpandedId] = useState(data[0]?.id);

    const addEntry = () => {
        const newId = `edu-${Date.now()}`;
        onChange([...data, { id: newId, institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }]);
        setExpandedId(newId);
    };

    const removeEntry = (id) => onChange(data.filter(e => e.id !== id));
    const updateEntry = (id, key, val) => onChange(data.map(e => e.id === id ? { ...e, [key]: val } : e));

    return (
        <div className="section-form animate-fade-in-up">
            {data.map((edu, idx) => (
                <div key={edu.id} className="entry-card">
                    <div className="entry-header" onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}>
                        <div className="entry-title">
                            <GraduationCap size={14} className="entry-icon" />
                            <span>{edu.institution || `Education ${idx + 1}`}</span>
                            {edu.degree && <span className="entry-sub">{edu.degree} {edu.field}</span>}
                        </div>
                        <div className="entry-actions" onClick={e => e.stopPropagation()}>
                            {data.length > 1 && <button className="icon-btn danger" onClick={() => removeEntry(edu.id)}><Trash2 size={13} /></button>}
                            <button className="icon-btn">{expandedId === edu.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
                        </div>
                    </div>
                    {expandedId === edu.id && (
                        <div className="entry-body">
                            <div className="form-group">
                                <label className="form-label">Institution *</label>
                                <input className="form-input" placeholder="University of California" value={edu.institution} onChange={e => updateEntry(edu.id, 'institution', e.target.value)} />
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Degree</label>
                                    <input className="form-input" placeholder="B.S. / M.S. / Ph.D." value={edu.degree} onChange={e => updateEntry(edu.id, 'degree', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Field of Study</label>
                                    <input className="form-input" placeholder="Computer Science" value={edu.field} onChange={e => updateEntry(edu.id, 'field', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Start Date</label>
                                    <input className="form-input" type="month" value={edu.startDate} onChange={e => updateEntry(edu.id, 'startDate', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">End Date</label>
                                    <input className="form-input" type="month" value={edu.endDate} onChange={e => updateEntry(edu.id, 'endDate', e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">GPA (optional)</label>
                                <input className="form-input" placeholder="3.8 / 4.0" value={edu.gpa} onChange={e => updateEntry(edu.id, 'gpa', e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <button className="btn btn-secondary btn-sm add-btn" onClick={addEntry}><Plus size={14} /> Add Education</button>
        </div>
    );
}

function SkillsSection({ data, onChange }) {
    const [input, setInput] = useState('');

    const addSkill = () => {
        const trimmed = input.trim();
        if (trimmed && !data.includes(trimmed)) {
            onChange([...data, trimmed]);
            setInput('');
        }
    };

    const removeSkill = (skill) => onChange(data.filter(s => s !== skill));

    const handleKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } };

    const POPULAR_SKILLS = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'SQL', 'Git', 'Agile'];

    return (
        <div className="section-form animate-fade-in-up">
            <div className="form-group">
                <label className="form-label">Add Skill</label>
                <div className="skill-input-row">
                    <input className="form-input" placeholder="Type a skill and press Enter" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
                    <button className="btn btn-primary btn-sm" onClick={addSkill}><Plus size={14} /></button>
                </div>
            </div>
            {data.length > 0 && (
                <div className="skills-tags">
                    {data.map(skill => (
                        <span key={skill} className="tag">
                            {skill}
                            <span className="remove" onClick={() => removeSkill(skill)}>✕</span>
                        </span>
                    ))}
                </div>
            )}
            <div className="suggested-skills">
                <p className="form-label">Suggestions</p>
                <div className="skills-tags">
                    {POPULAR_SKILLS.filter(s => !data.includes(s)).map(s => (
                        <button key={s} className="tag suggestion-tag" onClick={() => onChange([...data, s])}><Plus size={10} /> {s}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CertificationsSection({ data, onChange }) {
    const addEntry = () => onChange([...data, { id: `cert-${Date.now()}`, name: '', issuer: '', date: '' }]);
    const removeEntry = (id) => onChange(data.filter(e => e.id !== id));
    const updateEntry = (id, key, val) => onChange(data.map(e => e.id === id ? { ...e, [key]: val } : e));

    return (
        <div className="section-form animate-fade-in-up">
            {data.map((cert, idx) => (
                <div key={cert.id} className="entry-card flat-card">
                    <div className="flat-card-header">
                        <Award size={14} className="entry-icon" />
                        <span className="form-label">Certification {idx + 1}</span>
                        {data.length > 1 && <button className="icon-btn danger" style={{ marginLeft: 'auto' }} onClick={() => removeEntry(cert.id)}><Trash2 size={13} /></button>}
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Certification Name</label>
                            <input className="form-input" placeholder="AWS Certified Solutions Architect" value={cert.name} onChange={e => updateEntry(cert.id, 'name', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Issuing Organization</label>
                            <input className="form-input" placeholder="Amazon Web Services" value={cert.issuer} onChange={e => updateEntry(cert.id, 'issuer', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Date</label>
                        <input className="form-input" type="month" value={cert.date} onChange={e => updateEntry(cert.id, 'date', e.target.value)} />
                    </div>
                </div>
            ))}
            <button className="btn btn-secondary btn-sm add-btn" onClick={addEntry}><Plus size={14} /> Add Certification</button>
        </div>
    );
}

function ProjectsSection({ data, onChange }) {
    const addEntry = () => onChange([...data, { id: `proj-${Date.now()}`, name: '', description: '', tech: '', url: '' }]);
    const removeEntry = (id) => onChange(data.filter(e => e.id !== id));
    const updateEntry = (id, key, val) => onChange(data.map(e => e.id === id ? { ...e, [key]: val } : e));

    return (
        <div className="section-form animate-fade-in-up">
            {data.map((proj, idx) => (
                <div key={proj.id} className="entry-card flat-card">
                    <div className="flat-card-header">
                        <FolderGit2 size={14} className="entry-icon" />
                        <span className="form-label">{proj.name || `Project ${idx + 1}`}</span>
                        {data.length > 1 && <button className="icon-btn danger" style={{ marginLeft: 'auto' }} onClick={() => removeEntry(proj.id)}><Trash2 size={13} /></button>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Project Name</label>
                        <input className="form-input" placeholder="Awesome Project" value={proj.name} onChange={e => updateEntry(proj.id, 'name', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-input" rows={3} placeholder="What does this project do?" value={proj.description} onChange={e => updateEntry(proj.id, 'description', e.target.value)} />
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Technologies</label>
                            <input className="form-input" placeholder="React, Node.js, MongoDB" value={proj.tech} onChange={e => updateEntry(proj.id, 'tech', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">URL / Link</label>
                            <input className="form-input" placeholder="github.com/user/project" value={proj.url} onChange={e => updateEntry(proj.id, 'url', e.target.value)} />
                        </div>
                    </div>
                </div>
            ))}
            <button className="btn btn-secondary btn-sm add-btn" onClick={addEntry}><Plus size={14} /> Add Project</button>
        </div>
    );
}

function SettingsSection({ data, onChange }) {
    // If settings is undefined from old local storage, provide a default
    const safeData = data || { fontFamily: "'Inter', sans-serif", fontSize: '10pt' };
    const update = (key, val) => onChange({ ...safeData, [key]: val });

    const PRESET_FONTS = [
        { label: 'Inter (Modern Sans)', value: "'Inter', sans-serif" },
        { label: 'Roboto (Google Sans)', value: "'Roboto', sans-serif" },
        { label: 'Arial (Classic Sans)', value: "'Arial', sans-serif" },
        { label: 'Times New Roman (Serif)', value: "'Times New Roman', serif" },
        { label: 'Georgia (Elegant Serif)', value: "'Georgia', serif" },
        { label: 'Courier New (Monospace)', value: "'Courier New', monospace" },
    ];

    const PRESET_SIZES = ['9pt', '9.5pt', '10pt', '10.5pt', '11pt', '11.5pt', '12pt'];

    return (
        <div className="section-form animate-fade-in-up">
            <h3 style={{ marginBottom: 15, fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Resume Typography</h3>
            <div className="grid-2">
                <div className="form-group">
                    <label className="form-label">Font Family</label>
                    <select className="form-input" value={safeData.fontFamily} onChange={e => update('fontFamily', e.target.value)}>
                        {PRESET_FONTS.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Base Font Size</label>
                    <select className="form-input" value={safeData.fontSize} onChange={e => update('fontSize', e.target.value)}>
                        {PRESET_SIZES.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>
            <p className="input-hint" style={{ marginTop: 10 }}>These settings apply across all templates automatically.</p>
        </div>
    );
}

export default function Editor({ resumeData, onChange }) {
    const [activeTab, setActiveTab] = useState('personal');

    const updateSection = (section, value) => onChange({ ...resumeData, [section]: value });

    const renderTab = () => {
        switch (activeTab) {
            case 'personal': return <PersonalSection data={resumeData.personal} onChange={v => updateSection('personal', v)} />;
            case 'experience': return <ExperienceSection data={resumeData.experience} onChange={v => updateSection('experience', v)} />;
            case 'education': return <EducationSection data={resumeData.education} onChange={v => updateSection('education', v)} />;
            case 'skills': return <SkillsSection data={resumeData.skills} onChange={v => updateSection('skills', v)} />;
            case 'certifications': return <CertificationsSection data={resumeData.certifications} onChange={v => updateSection('certifications', v)} />;
            case 'projects': return <ProjectsSection data={resumeData.projects} onChange={v => updateSection('projects', v)} />;
            case 'design': return <SettingsSection data={resumeData.settings} onChange={v => updateSection('settings', v)} />;
            default: return null;
        }
    };

    return (
        <div className="editor">
            <div className="tab-bar editor-tabs">
                {TABS.map(tab => (
                    <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                        {tab.icon} <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className="editor-content">
                {renderTab()}
            </div>
        </div>
    );
}
