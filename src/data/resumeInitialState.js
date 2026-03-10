export const initialResumeData = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  experience: [
    {
      id: 'exp-1',
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    },
  ],
  skills: [],
  certifications: [
    {
      id: 'cert-1',
      name: '',
      issuer: '',
      date: '',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: '',
      description: '',
      tech: '',
      url: '',
    },
  ],
  languages: [],
  settings: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '10pt',
  },
};

export const sampleResumeData = {
  personal: {
    fullName: 'Alex Johnson',
    title: 'Senior Software Engineer',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 012-3456',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    website: 'alexjohnson.dev',
    summary: 'Results-driven Senior Software Engineer with 6+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud infrastructure. Led cross-functional teams to deliver complex projects 20% under budget.',
  },
  experience: [
    {
      id: 'exp-1',
      company: 'TechCorp Inc.',
      role: 'Senior Software Engineer',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: '• Led a team of 5 engineers to redesign the core API, reducing latency by 40%\n• Architected a microservices migration serving 2M+ daily users\n• Implemented CI/CD pipelines, cutting deployment time from 2 hours to 15 minutes',
    },
    {
      id: 'exp-2',
      company: 'StartupXYZ',
      role: 'Full Stack Developer',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: '• Built a React-based dashboard used by 500+ enterprise clients\n• Optimized database queries improving page load speed by 60%\n• Mentored 3 junior developers, accelerating their onboarding by 2 weeks',
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'B.S.',
      field: 'Computer Science',
      startDate: '2014-08',
      endDate: '2018-05',
      gpa: '3.8',
    },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL', 'CI/CD'],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2022-05',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OpenSource Analytics Dashboard',
      description: 'A real-time analytics platform built with React and D3.js. 800+ GitHub stars.',
      tech: 'React, D3.js, Node.js, WebSocket',
      url: 'github.com/alexj/analytics',
    },
  ],
  languages: ['English (Native)', 'Spanish (Professional)'],
  settings: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '10pt',
  },
};
