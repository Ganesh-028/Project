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

const SWE_HARD_SKILLS = [
  'javascript', 'typescript', 'react', 'node.js', 'next.js', 'go', 'golang', 'rust', 'python',
  'java', 'c++', 'aws', 'docker', 'kubernetes', 'graphql', 'rest api', 'postgresql', 'mongodb',
  'system design', 'microservices', 'ci/cd', 'agile', 'scrum', 'tdd', 'testing', 'security'
];

export function calculateATSScore(resumeData) {
  const { personal, experience, education, skills, certifications, projects } = resumeData;
  
  let score = 0;
  const analysis = {
    completeness: { score: 0, max: 25, items: [] },
    impact: { score: 0, max: 40, items: [] },
    keywords: { score: 0, max: 25, items: [] },
    extra: { score: 0, max: 10, items: [] }
  };
  
  const issues = [];
  const strengths = [];
  const suggestions = [];

  // 1. COMPLETENESS (25 pts)
  let compScore = 0;
  if (personal.fullName?.trim()) compScore += 3;
  if (personal.email?.trim()) compScore += 3;
  if (personal.phone?.trim()) compScore += 2;
  if (personal.location?.trim()) compScore += 2;
  if (personal.linkedin?.trim()) compScore += 5;
  if (personal.portfolio?.trim() || personal.github?.trim()) compScore += 5;
  
  const summaryLength = personal.summary?.trim().length || 0;
  if (summaryLength > 150) {
    compScore += 5;
    strengths.push("Excellent summary depth");
  } else if (summaryLength > 0) {
    compScore += 2;
    suggestions.push("Expand your summary to ~200 characters for better narrative impact");
  } else {
    issues.push("Missing professional summary");
  }
  analysis.completeness.score = compScore;

  // 2. IMPACT & DEPTH (40 pts)
  let impactScore = 0;
  const validExp = experience.filter(e => e.role && e.description);
  
  // Experience Depth
  if (validExp.length >= 2) impactScore += 10;
  else if (validExp.length === 1) impactScore += 5;
  
  // Action Verbs & Metrics
  let totalBullets = 0;
  let actionVerbCount = 0;
  let metricCount = 0;
  
  validExp.forEach(exp => {
    const desc = exp.description.toLowerCase();
    const bullets = desc.split('\n').filter(b => b.trim().length > 10);
    totalBullets += bullets.length;
    
    ATS_KEYWORDS.technical.forEach(verb => {
      if (desc.includes(verb)) actionVerbCount++;
    });
    
    ATS_KEYWORDS.metrics.forEach(metric => {
       const regex = new RegExp(`\\d+.*${metric}|${metric}.*\\d+`, 'i');
       if (regex.test(desc)) metricCount++;
    });
  });

  if (actionVerbCount >= 5) impactScore += 10;
  if (metricCount >= 3) {
    impactScore += 15;
    strengths.push("Strong use of impact metrics");
  } else if (metricCount > 0) {
    impactScore += 7;
    suggestions.push("Quantify more achievements with specific numbers and percentages");
  } else {
    issues.push("Experience lacks measurable metrics");
  }
  
  if (totalBullets >= 6) impactScore += 5;
  analysis.impact.score = impactScore;

  // 3. KEYWORDS & SKILLS (25 pts)
  let keyScore = 0;
  let matchingSkills = 0;
  
  const userSkills = skills.map(s => s.toLowerCase());
  SWE_HARD_SKILLS.forEach(skill => {
    if (userSkills.includes(skill)) matchingSkills++;
  });

  if (matchingSkills >= 10) keyScore += 15;
  else if (matchingSkills >= 5) keyScore += 10;
  else keyScore += 5;

  if (userSkills.length >= 8 && userSkills.length <= 15) {
    keyScore += 10;
    strengths.push("Optimal skill list density");
  } else if (userSkills.length > 15) {
    keyScore += 5;
    suggestions.push("Skill list is slightly crowded; prioritize top 12 relevant skills");
  }
  analysis.keywords.score = keyScore;

  // 4. EXTRA CREDENTIALS (10 pts)
  let extraScore = 0;
  if (projects.filter(p => p.name).length >= 2) extraScore += 5;
  if (certifications.filter(c => c.name).length >= 1) extraScore += 5;
  analysis.extra.score = extraScore;

  // Calculate Finals
  const finalScore = compScore + impactScore + keyScore + extraScore;
  let grade = 'D';
  if (finalScore >= 90) grade = 'A+';
  else if (finalScore >= 80) grade = 'A';
  else if (finalScore >= 70) grade = 'B';
  else if (finalScore >= 60) grade = 'C';
  else if (finalScore >= 40) grade = 'D';
  else grade = 'F';

  return { 
    score: finalScore, 
    grade, 
    issues, 
    suggestions, 
    strengths,
    breakdown: analysis 
  };
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

export async function analyzeRawText(text) {
  // Simple simulation of text-based analysis
  const normalizedText = text.toLowerCase();
  
  const analysis = {
    completeness: { score: 0, max: 25 },
    impact: { score: 0, max: 40 },
    keywords: { score: 0, max: 25 },
    extra: { score: 0, max: 10 }
  };
  
  // 1. COMPLETENESS (25 pts)
  if (normalizedText.includes('@')) analysis.completeness.score += 5;
  if (normalizedText.includes('phone') || normalizedText.includes('+')) analysis.completeness.score += 5;
  if (normalizedText.includes('linkedin.com')) analysis.completeness.score += 5;
  if (normalizedText.includes('github.com')) analysis.completeness.score += 5;
  if (text.length > 500) analysis.completeness.score += 5;

  // 2. IMPACT (40 pts)
  const technicalWords = ['developed', 'engineered', 'implemented', 'architected', 'optimized', 'designed', 'built', 'deployed', 'automated', 'integrated', 'launched', 'created', 'led', 'managed', 'collaborated', 'improved', 'reduced', 'increased', 'delivered', 'scaled'];
  const metricWords = ['%', 'million', 'billion', 'thousand', '$', 'users', 'revenue', 'performance', 'efficiency', 'cost', 'time', 'growth', 'hours', 'minutes', 'days', 'weeks'];
  
  let verbCount = 0;
  technicalWords.forEach(v => { if (normalizedText.includes(v)) verbCount++; });
  analysis.impact.score = Math.min(20, verbCount * 2);
  
  let metricCount = 0;
  metricWords.forEach(m => { if (normalizedText.includes(m)) metricCount++; });
  analysis.impact.score += Math.min(20, metricCount * 2);

  // 3. KEYWORDS (25 pts)
  const hardSkills = ['javascript', 'typescript', 'react', 'node.js', 'next.js', 'go', 'golang', 'rust', 'python', 'java', 'c++', 'aws', 'docker', 'kubernetes', 'graphql', 'rest api', 'postgresql', 'mongodb', 'system design', 'microservices', 'ci/cd', 'agile', 'scrum', 'tdd', 'testing', 'security'];
  let skillCount = 0;
  hardSkills.forEach(s => { if (normalizedText.includes(s.toLowerCase())) skillCount++; });
  analysis.keywords.score = Math.min(25, skillCount * 2);

  // 4. EXTRA (10 pts)
  if (normalizedText.includes('project')) analysis.extra.score += 5;
  if (normalizedText.includes('certificat') || normalizedText.includes('award')) analysis.extra.score += 5;

  const finalScore = analysis.completeness.score + analysis.impact.score + analysis.keywords.score + analysis.extra.score;
  
  let grade = 'D';
  if (finalScore >= 90) grade = 'A+';
  else if (finalScore >= 80) grade = 'A';
  else if (finalScore >= 70) grade = 'B';
  else if (finalScore >= 60) grade = 'C';
  else grade = 'D';

  return {
    score: finalScore,
    grade,
    issues: ["Note: Scored based on raw text analysis. Contact info and formatting depth are estimated."],
    strengths: ["Text extraction successful", `${skillCount} key skills identified`],
    suggestions: ["Fill in the editor manually for a more accurate 24-point check."],
    breakdown: analysis,
    parsedData: parseResumeText(text) // Add parsed data for population
  };
}

function parseResumeText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const normalizedText = text.toLowerCase();
  
  const parsed = {
    personal: {
      fullName: lines[0] || '',
      email: text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || '',
      phone: text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/)?.[0] || '',
      linkedin: text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/)?.[0] || '',
      github: text.match(/github\.com\/[a-zA-Z0-9_-]+/)?.[0] || '',
      location: text.match(/(?:[A-Z][a-z]+(?: [A-Z][a-z]+)*),? (?:[A-Z]{2}|[A-Z][a-z]+)/)?.[0] || '',
      summary: '',
      title: lines[1] || ''
    },
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    projects: []
  };

  // 1. Extract Skills
  const hardSkills = ['javascript', 'typescript', 'react', 'node.js', 'next.js', 'go', 'golang', 'rust', 'python', 'java', 'c++', 'aws', 'docker', 'kubernetes', 'graphql', 'rest api', 'postgresql', 'mongodb', 'system design', 'microservices', 'ci/cd', 'agile', 'scrum', 'tdd', 'testing', 'security'];
  hardSkills.forEach(skill => {
    if (normalizedText.includes(skill)) {
      // Capitalize first letter of each word
      const capSkill = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      parsed.skills.push(capSkill);
    }
  });

  // 2. Simple Section Splitting
  const sections = text.split(/(EXPERIENCE|WORK EXPERIENCE|EXPERIENCE|PROJECTS|EDUCATION|CERTIFICATIONS|SKILLS|STRENGTHS|SUMMARY)/i);
  
  for (let i = 0; i < sections.length; i++) {
    const sectionName = sections[i].toUpperCase();
    const content = sections[i+1] || '';
    
    if (sectionName.includes('SUMMARY')) {
      parsed.personal.summary = content.trim().substring(0, 500);
    } else if (sectionName.includes('EXPERIENCE') || sectionName.includes('WORK')) {
      // Very basic extraction: split by common date patterns or job titles
      const entries = content.split(/\n(?=[A-Z])/);
      entries.forEach(entry => {
        if (entry.length > 20) {
          parsed.experience.push({
            id: `scan-exp-${Date.now()}-${Math.random()}`,
            company: 'Extracted Company',
            role: 'Extracted Role',
            description: entry.trim(),
            startDate: '',
            endDate: '',
            current: false
          });
        }
      });
    } else if (sectionName.includes('EDUCATION')) {
      const entries = content.split('\n');
      entries.forEach(entry => {
        if (entry.length > 10) {
          parsed.education.push({
            id: `scan-edu-${Date.now()}`,
            institution: entry.trim(),
            degree: '',
            field: '',
            startDate: '',
            endDate: ''
          });
        }
      });
    }
  }

  // Cleanup: Dedup skills and limit entries
  parsed.skills = [...new Set(parsed.skills)].slice(0, 15);
  parsed.experience = parsed.experience.slice(0, 3);
  parsed.education = parsed.education.slice(0, 2);

  return parsed;
}
