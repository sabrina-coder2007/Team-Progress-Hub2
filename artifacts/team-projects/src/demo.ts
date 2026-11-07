export type UiLanguage = 'en' | 'fr' | 'ar';
export type Role = 'student' | 'supervisor' | 'department' | 'central';
export type RolePermission = 'proposal' | 'review' | 'editor' | 'department' | 'administration';
export type ProposalStatus = 'Draft' | 'Pending Review' | 'Modifications Requested' | 'Approved' | 'Rejected';
export type ReviewStep = { id: string; label: string; role: 'supervisor' | 'department' | 'central'; approved: boolean; comment: string };
export type Proposal = {
  id: string; ownerId: string; ownerName: string; title: string; field: string; problem: string;
  objectives: string; methodology: string; outline: string; researchLanguage: string;
  status: ProposalStatus; feedback: string; supervisorId: string; departmentId: string;
  steps: ReviewStep[];
};
export type WorkflowStep = { id: string; label: string; role: 'supervisor' | 'department' | 'central' };
export type DepartmentSettings = { years: string[]; specializations: string[]; templates: string[] };
export type Profile = {
  id: string; name: string; email: string; role: Role; state: string; institutionId: string;
  departmentId: string; specialization: string; academicYear: string; title?: string;
  institutionName?: string; facultyName?: string; departmentName?: string;
};
export type DemoStore = {
  profiles: Profile[];
  institutions: { id: string; name: string; departments: string[] }[];
  years: string[];
  specializations: string[];
  workflow: WorkflowStep[];
  departmentWorkflows: Record<string, WorkflowStep[]>;
  departmentSettings: Record<string, DepartmentSettings>;
  proposals: Proposal[];
  templates: string[];
  activity: string[];
  draft: string;
  drafts: Record<string, string>;
  reviewerNotes: Record<string, string>;
  rolePermissions: Record<Role, RolePermission[]>;
};

export const currentStudentId = 'student-amel';
export const departmentId = 'dept-social';
export const workflowSeed: DemoStore['workflow'] = [
  { id: 'supervisor', label: 'Supervisor review', role: 'supervisor' },
  { id: 'department', label: 'Department committee', role: 'department' },
  { id: 'central', label: 'Graduate studies office', role: 'central' },
];

export const seedStore: DemoStore = {
  profiles: [
    { id: currentStudentId, name: 'Amel Bensalem', email: 'amel.bensalem@demo.edu.dz', role: 'student', state: 'demo-approved', institutionId: 'oran1', departmentId, specialization: 'Educational Sciences', academicYear: '2024–2025' },
    { id: 'supervisor-meriem', name: 'Dr. Meriem Kaci', email: 'meriem.kaci@demo.edu.dz', role: 'supervisor', state: 'demo-approved', institutionId: 'oran1', departmentId, specialization: 'Educational Technology', academicYear: '2024–2025', title: 'Associate professor' },
    { id: 'supervisor-yacine', name: 'Dr. Yacine Haddad', email: 'yacine.haddad@demo.edu.dz', role: 'supervisor', state: 'pending', institutionId: 'oran1', departmentId, specialization: 'Sociology', academicYear: '2024–2025', title: 'Lecturer' },
    { id: 'dept-admin', name: 'Nadia Bouzid', email: 'nadia.bouzid@demo.edu.dz', role: 'department', state: 'demo-approved', institutionId: 'oran1', departmentId, specialization: 'Department administration', academicYear: '2024–2025' },
    { id: 'central-admin', name: 'Leeder Initial Setup', email: 'setup@leeder.demo', role: 'central', state: 'demo-approved', institutionId: 'oran1', departmentId, specialization: 'Central administration', academicYear: '2024–2025' },
    { id: 'student-samira', name: 'Samira Belkacem', email: 'samira.belkacem@demo.edu.dz', role: 'student', state: 'demo-approved', institutionId: 'oran1', departmentId, specialization: 'Sociology', academicYear: '2024–2025' },
    { id: 'student-karim', name: 'Karim Amrani', email: 'karim.amrani@demo.edu.dz', role: 'student', state: 'demo-approved', institutionId: 'oran1', departmentId: 'dept-languages', specialization: 'Applied Linguistics', academicYear: '2024–2025' },
  ],
  institutions: [{ id: 'oran1', name: 'University of Oran 1 Ahmed Ben Bella', departments: ['Faculty of Social Sciences', 'Department of Languages'] }],
  years: ['2024–2025', '2025–2026'],
  specializations: ['Educational Sciences', 'Educational Technology', 'Sociology', 'Applied Linguistics'],
  workflow: workflowSeed,
  departmentWorkflows: { [departmentId]: workflowSeed },
  departmentSettings: {
    [departmentId]: {
      years: ['2024–2025', '2025–2026'],
      specializations: ['Educational Sciences', 'Educational Technology', 'Sociology'],
      templates: ['Master research proposal outline', 'Supervisor review notes'],
    },
  },
  proposals: [
    {
      id: 'proposal-amel', ownerId: currentStudentId, ownerName: 'Amel Bensalem',
      title: 'Digital learning practices in Algerian public universities', field: 'Educational technology',
      problem: 'How do access to digital learning resources and students’ study habits shape engagement in blended courses at public universities in Algeria?',
      objectives: 'Map student access to digital learning tools; identify study practices linked to engagement; develop practical recommendations for more inclusive blended learning.',
      methodology: 'A mixed-methods study combining a student survey with semi-structured interviews. The sample will include undergraduate students from two public universities.',
      outline: '1. Introduction and context\n2. Literature review\n3. Research design\n4. Findings and discussion\n5. Recommendations',
      researchLanguage: 'English', status: 'Pending Review', feedback: '', supervisorId: 'supervisor-meriem', departmentId,
      steps: workflowSeed.map((step, index) => ({ ...step, approved: false, comment: '', ...(index === 0 ? {} : {}) })),
    },
    {
      id: 'proposal-samira', ownerId: 'student-samira', ownerName: 'Samira Belkacem', title: 'Community archives and memory in western Algeria', field: 'Sociology',
      problem: 'How do local community archives shape intergenerational accounts of urban change?', objectives: 'Document community archive practices and describe their role in shared memory.',
      methodology: 'Oral history interviews and a review of locally held archival material.', outline: 'Context\nMethods\nFindings', researchLanguage: 'French', status: 'Modifications Requested',
      feedback: 'Please clarify the interview selection criteria.', supervisorId: 'supervisor-meriem', departmentId,
      steps: workflowSeed.map(step => ({ ...step, approved: false, comment: '' })),
    },
    {
      id: 'proposal-karim', ownerId: 'student-karim', ownerName: 'Karim Amrani', title: 'Multilingual feedback in first-year writing seminars', field: 'Applied Linguistics',
      problem: 'What kinds of written feedback help first-year students revise academic arguments?', objectives: 'Compare feedback approaches and identify revision strategies.',
      methodology: 'A qualitative analysis of anonymized seminar drafts and student interviews.', outline: 'Introduction\nLiterature\nAnalysis', researchLanguage: 'Arabic', status: 'Approved',
      feedback: 'Approved in the sample department workflow.', supervisorId: 'supervisor-yacine', departmentId: 'dept-languages',
      steps: workflowSeed.map(step => ({ ...step, approved: true, comment: 'Reviewed in the sample workflow.' })),
    },
  ],
  templates: ['Master research proposal outline', 'Supervisor review notes'],
  activity: ['Sample review queue prepared for the department.', 'Initial demo workspace configured.'],
  draft: '',
  drafts: {},
  reviewerNotes: {},
  rolePermissions: {
    student: ['proposal', 'editor'],
    supervisor: ['review'],
    department: ['review', 'department'],
    central: ['review', 'administration'],
  },
};

export function loadStore(): DemoStore {
  try {
    const saved = localStorage.getItem('leeder-demo-v1');
    if (!saved) return structuredClone(seedStore);
    const value = JSON.parse(saved) as Partial<DemoStore>;
    return {
      ...structuredClone(seedStore), ...value,
      profiles: value.profiles || structuredClone(seedStore.profiles),
      proposals: value.proposals || structuredClone(seedStore.proposals),
      workflow: value.workflow || structuredClone(seedStore.workflow),
      departmentWorkflows: value.departmentWorkflows || { [departmentId]: value.workflow || structuredClone(seedStore.workflow) },
      departmentSettings: value.departmentSettings || structuredClone(seedStore.departmentSettings),
      rolePermissions: value.rolePermissions || structuredClone(seedStore.rolePermissions),
      drafts: value.drafts || { [currentStudentId]: value.draft || '' },
    };
  } catch { return structuredClone(seedStore); }
}
