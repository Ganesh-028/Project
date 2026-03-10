// AI Service - Simulates AI-powered resume enhancement and ATS scoring

const ATS_KEYWORDS = {
    technical: [
        'developed', 'engineered', 'implemented', 'architected', 'optimized', 'designed',
        'built', 'deployed', 'automated', 'integrated', 'launched', 'created', 'led',
        'managed', 'collaborated', 'improved', 'reduced', 'increased', 'delivered', 'scaled',
    ],
    metrics: [
        '%', 'million', 'billion', 'thousand', '$', 'users', 'revenue', 'performance',
        'efficiency', 'cost', 'time', 'growth', 'hours', 'minutes', 'days', 'weeks',
    ],
    buzzwords: [
        'agile', 'scrum', 'cross-functional', 'stakeholder', 'roi', 'kpi', 'saas', 'b2b', 'b2c',
        'mvp', 'product', 'roadmap', 'sprint', 'backlog', 'devops', 'microservices', 'cloud',
    ],
};

const SUMMARY_TEMPLATES = [
    (data) => `Results-driven ${data.title || 'professional'} with proven expertise in ${(data.skills || []).slice(0, 3).join(', ')}. Passionate about delivering high-quality solutions that drive business value and enhance user experience. Strong track record of collaborating with cross-functional teams to meet and exceed project goals.`,
    (data) => `Dynamic ${data.title || 'professional'} with hands-on experience in ${(data.skills || []).slice(0, 3).join(', ')}. Committed to continuous learning and leveraging cutting-edge technology to solve complex problems. Proven ability to lead projects from conception to delivery while maintaining high standards of quality.`,
    (data) => `Innovative ${data.title || 'professional'} specializing in ${(data.skills || []).slice(0, 3).join(', ')}. Adept at translating technical requirements into practical solutions. Recognized for strong analytical skills, attention to detail, and a collaborative approach to teamwork.`,
];

export function calculateATSScore(resumeData) {
    let score = 0;
    const issues = [];
    const suggestions = [];
    const strengths = [];

    const { personal, experience, education, skills, certifications, projects } = resumeData;

    // --- PERSONAL INFO (20 pts) ---
    if (personal.fullName?.trim()) { score += 3; strengths.push('Full name present'); }
    if (personal.email?.trim()) { score += 3; strengths.push('Email address present'); }
    if (personal.phone?.trim()) { score += 2; strengths.push('Phone number included'); }
    if (personal.location?.trim()) { score += 2; strengths.push('Location listed'); }
    if (personal.linkedin?.trim()) { score += 3; strengths.push('LinkedIn profile included'); }
    if (personal.title?.trim()) { score += 3; strengths.push('Job title specified'); }
    if (personal.summary?.trim() && personal.summary.length > 80) {
        score += 4;
        strengths.push('Professional summary included');
    } else {
        issues.push('Summary is missing or too short (aim for 80+ characters)');
        suggestions.push('Add a compelling professional summary with key skills and achievements');
    }

    // --- EXPERIENCE (30 pts) ---
    const validExp = experience.filter(e => e.company?.trim() && e.role?.trim() && e.description?.trim());
    if (validExp.length === 0) {
        issues.push('No work experience entries found');
        suggestions.push('Add at least one work experience entry');
    } else if (validExp.length === 1) {
        score += 10;
    } else {
        score += 20;
        strengths.push(`${validExp.length} experience entries`);
    }

    let hasBullets = false, hasMetrics = false;
    validExp.forEach(exp => {
        const desc = exp.description?.toLowerCase() || '';
        if (desc.includes('•') || desc.includes('-') || desc.includes('\n')) hasBullets = true;
        ATS_KEYWORDS.metrics.forEach(m => { if (desc.includes(m)) hasMetrics = true; });
    });

    if (hasBullets) { score += 5; strengths.push('Bullet-point format used in experience'); }
    else { issues.push('Use bullet points in experience descriptions'); suggestions.push('Start each bullet with an action verb (Led, Built, Optimized...)'); }

    if (hasMetrics) { score += 5; strengths.push('Quantified achievements with metrics'); }
    else { suggestions.push('Add numbers and metrics (e.g., "Reduced load time by 40%", "Managed team of 5")'); }

    // --- EDUCATION (15 pts) ---
    const validEdu = education.filter(e => e.institution?.trim() && e.degree?.trim());
    if (validEdu.length > 0) {
        score += 15;
        strengths.push('Education section complete');
    } else {
        issues.push('Education section is empty');
        suggestions.push('Add your educational background including degree and institution');
    }

    // --- SKILLS (20 pts) ---
    if (skills.length === 0) {
        issues.push('No skills listed');
        suggestions.push('Add at least 6-10 relevant technical skills');
    } else if (skills.length < 5) {
        score += 5;
        suggestions.push('Add more skills (aim for 8-12 for better ATS matching)');
    } else if (skills.length <= 12) {
        score += 20;
        strengths.push(`${skills.length} skills listed (optimal range)`);
    } else {
        score += 15;
        suggestions.push('Consider trimming skills to the most relevant 10-12 (too many can dilute focus)');
    }

    // --- CERTIFICATIONS (8 pts) ---
    const validCerts = certifications.filter(c => c.name?.trim());
    if (validCerts.length > 0) {
        score += 8;
        strengths.push('Certifications included');
    } else {
        suggestions.push('Add certifications to boost credibility (e.g., AWS, Google, PMP)');
    }

    // --- PROJECTS (7 pts) ---
    const validProjs = projects.filter(p => p.name?.trim() && p.description?.trim());
    if (validProjs.length > 0) {
        score += 7;
        strengths.push('Projects section showcases hands-on work');
    } else {
        suggestions.push('Add personal or open-source projects to demonstrate applied skills');
    }

    const finalScore = Math.min(100, score);
    let grade = 'D';
    if (finalScore >= 90) grade = 'A+';
    else if (finalScore >= 80) grade = 'A';
    else if (finalScore >= 70) grade = 'B';
    else if (finalScore >= 60) grade = 'C';
    else if (finalScore >= 50) grade = 'D';

    return { score: finalScore, grade, issues, suggestions, strengths };
}

export async function generateAISummary(resumeData) {
    // Simulate an AI API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const { personal } = resumeData;
    const templateFn = SUMMARY_TEMPLATES[Math.floor(Math.random() * SUMMARY_TEMPLATES.length)];
    return templateFn({ title: personal.title, skills: resumeData.skills });
}

export async function enhanceBulletPoint(text) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const actionVerbs = ['Led', 'Engineered', 'Developed', 'Optimized', 'Architected', 'Deployed', 'Launched', 'Streamlined', 'Delivered'];
    const verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    const cleaned = text.replace(/^[•\-\*]\s*/, '').trim();
    if (!cleaned) return text;
    const firstWord = cleaned.split(' ')[0];
    const rest = cleaned.substring(firstWord.length);
    return `${verb}${rest}, resulting in measurable improvements to team efficiency and product quality`;
}
