
export type UiLanguage = 'en' | 'fr' | 'ar';

export type Role =
  | 'student'
  | 'supervisor'
  | 'department'
  | 'central';

export type RolePermission =
  | 'proposal'
  | 'review'
  | 'editor'
  | 'department'
  | 'administration';

export type ProposalStatus =
  | 'Draft'
  | 'Pending Review'
  | 'Modifications Requested'
  | 'Approved'
  | 'Rejected';

export type ReviewStep = {
  id: string;
  label: string;
  role: 'supervisor' | 'department' | 'central';
  approved: boolean;
  comment: string;
};

export type Proposal = {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  field: string;
  problem: string;
  objectives: string;
  methodology: string;
  outline: string;
  researchLanguage: string;
  status: ProposalStatus;
  feedback: string;
  supervisorId: string;
  departmentId: string;
  steps: ReviewStep[];
};

export type WorkflowStep = {
  id: string;
  label: string;
  role: 'supervisor' | 'department' | 'central';
};

export type DepartmentSettings = {
  years: string[];
  specializations: string[];
  templates: string[];
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  state: string;
  institutionId: string;
  departmentId: string;
  specialization: string;
  academicYear: string;
  title?: string;
  institutionName?: string;
  facultyName?: string;
  departmentName?: string;
};

export type DemoStore = {
  profiles: Profile[];
  institutions: {
    id: string;
    name: string;
    departments: string[];
  }[];
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

// --------------------------------------------------
// Leeder institution configuration
// --------------------------------------------------

export const institutionId = 'ensb-bouzareah';

export const departmentId = 'dept-arabic-literature';

export const currentStudentId = 'student-demo-01';

export const institutionName =
  'المدرسة العليا للأساتذة بوزريعة';

export const departmentName =
  'قسم اللغة العربية وآدابها';

export const specializations = [
  'الأدب العربي',
  'اللسانيات العربية',
  'اللسانيات التطبيقية',
  'تعليمية اللغة العربية',
];

// --------------------------------------------------
// Review workflow
// --------------------------------------------------

export const workflowSeed: DemoStore['workflow'] = [
  {
    id: 'supervisor',
    label: 'Supervisor review',
    role: 'supervisor',
  },
  {
    id: 'department',
    label: 'Department committee',
    role: 'department',
  },
  {
    id: 'central',
    label: 'Graduate studies office',
    role: 'central',
  },
];

// --------------------------------------------------
// Demo database
// All identities below are fictional demo identities.
// --------------------------------------------------

export const seedStore: DemoStore = {
  profiles: [
    {
      id: currentStudentId,
      name: 'Student Demo 01',
      email: 'student01@leeder.demo',
      role: 'student',
      state: 'demo-approved',
      institutionId,
      departmentId,
      specialization: 'الأدب العربي',
      academicYear: '2026–2027',
    },
    {
      id: 'supervisor-demo-01',
      name: 'Supervisor Demo 01',
      email: 'supervisor01@leeder.demo',
      role: 'supervisor',
      state: 'demo-approved',
      institutionId,
      departmentId,
      specialization: 'اللسانيات العربية',
      academicYear: '2026–2027',
      title: 'Associate professor',
    },
    {
      id: 'supervisor-demo-02',
      name: 'Supervisor Demo 02',
      email: 'supervisor02@leeder.demo',
      role: 'supervisor',
      state: 'pending',
      institutionId,
      departmentId,
      specialization: 'الأدب العربي',
      academicYear: '2026–2027',
      title: 'Lecturer',
    },
    {
      id: 'department-admin-demo',
      name: 'Department Admin Demo',
      email: 'department@leeder.demo',
      role: 'department',
      state: 'demo-approved',
      institutionId,
      departmentId,
      specialization: departmentName,
      academicYear: '2026–2027',
    },
    {
      id: 'central-admin-demo',
      name: 'Central Admin Demo',
      email: 'central@leeder.demo',
      role: 'central',
      state: 'demo-approved',
      institutionId,
      departmentId,
      specialization: 'Central administration',
      academicYear: '2026–2027',
    },
    {
      id: 'student-demo-02',
      name: 'Student Demo 02',
      email: 'student02@leeder.demo',
      role: 'student',
      state: 'demo-approved',
      institutionId,
      departmentId,
      specialization: 'اللسانيات التطبيقية',
      academicYear: '2026–2027',
    },
    {
      id: 'student-demo-03',
      name: 'Student Demo 03',
      email: 'student03@leeder.demo',
      role: 'student',
      state: 'demo-approved',
      institutionId,
      departmentId,
      specialization: 'تعليمية اللغة العربية',
      academicYear: '2026–2027',
    },
  ],

  institutions: [
    {
      id: institutionId,
      name: institutionName,
      departments: [departmentName],
    },
  ],

  years: [
    '2025–2026',
    '2026–2027',
  ],

  specializations,

  workflow: workflowSeed,

  departmentWorkflows: {
    [departmentId]: workflowSeed,
  },

  departmentSettings: {
    [departmentId]: {
      years: [
        '2025–2026',
        '2026–2027',
      ],
      specializations,
      templates: [
        'قالب مقترح بحث',
        'نموذج ملاحظات المشرف',
        'نموذج مراجعة اللجنة',
      ],
    },
  },

  // ------------------------------------------------
  // Sample research proposals
  // ------------------------------------------------

  proposals: [
    {
      id: 'proposal-demo-01',
      ownerId: currentStudentId,
      ownerName: 'Student Demo 01',
      title: 'التحولات الدلالية في اللغة العربية المعاصرة',
      field: 'اللسانيات العربية',
      problem:
        'كيف تتشكل التحولات الدلالية في المفردات العربية المعاصرة، وما العوامل اللغوية والثقافية المؤثرة فيها؟',
      objectives:
        'رصد نماذج من التحولات الدلالية، وتحليل أسبابها، وتصنيف مظاهرها في الاستعمال العربي المعاصر.',
      methodology:
        'منهج وصفي تحليلي يعتمد على جمع نماذج لغوية من مصادر مكتوبة، ثم تحليلها دلاليًا وسياقيًا.',
      outline:
        '1. مقدمة وإطار نظري\n2. مفهوم التحول الدلالي\n3. عوامل التحول الدلالي\n4. دراسة تطبيقية\n5. النتائج والخاتمة',
      researchLanguage: 'Arabic',
      status: 'Pending Review',
      feedback: '',
      supervisorId: 'supervisor-demo-01',
      departmentId,
      steps: workflowSeed.map((step) => ({
        ...step,
        approved: false,
        comment: '',
      })),
    },

    {
      id: 'proposal-demo-02',
      ownerId: 'student-demo-02',
      ownerName: 'Student Demo 02',
      title: 'الترابط النصي وأثره في بناء المعنى',
      field: 'اللسانيات التطبيقية',
      problem:
        'ما دور وسائل الترابط النصي في تحقيق الانسجام وبناء المعنى داخل النصوص العربية؟',
      objectives:
        'تحديد أبرز وسائل الترابط النصي، وتحليل وظائفها، وبيان أثرها في فهم النص.',
      methodology:
        'منهج وصفي تحليلي يعتمد على دراسة نماذج مختارة من النصوص العربية.',
      outline:
        'مقدمة\nالفصل الأول: مفهوم النص والترابط\nالفصل الثاني: وسائل الترابط النصي\nالفصل الثالث: دراسة تطبيقية\nخاتمة',
      researchLanguage: 'Arabic',
      status: 'Modifications Requested',
      feedback: 'يرجى توضيح معايير اختيار مدونة الدراسة.',
      supervisorId: 'supervisor-demo-01',
      departmentId,
      steps: workflowSeed.map((step) => ({
        ...step,
        approved: false,
        comment: '',
      })),
    },

    {
      id: 'proposal-demo-03',
      ownerId: 'student-demo-03',
      ownerName: 'Student Demo 03',
      title: 'تعليمية النحو العربي ومشكلات اكتساب المفاهيم النحوية',
      field: 'تعليمية اللغة العربية',
      problem:
        'ما أبرز الصعوبات التي تواجه المتعلمين في اكتساب المفاهيم النحوية، وما السبل الممكنة لمعالجتها؟',
      objectives:
        'تحديد الصعوبات النحوية الشائعة، وتحليل أسبابها، واقتراح مداخل تعليمية مناسبة.',
      methodology:
        'منهج وصفي تحليلي يجمع بين تحليل المحتوى التعليمي ودراسة عينة من إجابات المتعلمين.',
      outline:
        'مقدمة\nالفصل الأول: تعليمية النحو العربي\nالفصل الثاني: صعوبات اكتساب المفاهيم النحوية\nالفصل الثالث: مقترحات المعالجة\nخاتمة',
      researchLanguage: 'Arabic',
      status: 'Approved',
      feedback: 'Approved in the sample department workflow.',
      supervisorId: 'supervisor-demo-02',
      departmentId,
      steps: workflowSeed.map((step) => ({
        ...step,
        approved: true,
        comment: 'Reviewed in the sample workflow.',
      })),
    },
  ],

  templates: [
    'قالب مقترح بحث',
    'نموذج ملاحظات المشرف',
    'نموذج مراجعة اللجنة',
  ],

  activity: [
    'Sample review queue prepared for the department.',
    'Initial demo workspace configured.',
  ],

  draft: '',
  drafts: {},
  reviewerNotes: {},

  // ------------------------------------------------
  // Role permissions
  // ------------------------------------------------

  rolePermissions: {
    student: ['proposal', 'editor'],
    supervisor: ['review'],
    department: ['review', 'department'],
    central: ['review', 'administration'],
  },
};

// --------------------------------------------------
// Storage configuration
// A new key prevents loading the old demo identities.
// --------------------------------------------------

export const STORAGE_KEY = 'leeder-demo-v2';

// --------------------------------------------------
// Load demo data
// --------------------------------------------------

export function loadStore(): DemoStore {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return structuredClone(seedStore);
    }

    const value = JSON.parse(saved) as Partial<DemoStore>;

    // Use the new demo identities for seeded profiles.
    const savedProfiles = value.profiles || [];

    const profiles = seedStore.profiles.map((seedProfile) => {
      const savedProfile = savedProfiles.find(
        (profile) => profile.id === seedProfile.id
      );

      const profile = savedProfile
        ? {
            ...savedProfile,
            name: seedProfile.name,
            email: seedProfile.email,
          }
        : { ...seedProfile };

      // Migrate legacy academic details for ENSB demo accounts.
      // ENSB is the higher education institution; the Arabic department
      // is not a faculty and must never be replaced by "Faculty of Social Sciences".
      if (seedProfile.institutionId === institutionId) {
        return {
          ...profile,
          institutionName,
          facultyName: '',
          departmentId,
          departmentName,
        };
      }

      return profile;
    });

    // Keep proposal data while ensuring demo owner names stay fictional.
    const savedProposals = value.proposals || [];

    const proposals = seedStore.proposals.map((seedProposal) => {
      const savedProposal = savedProposals.find(
        (proposal) => proposal.id === seedProposal.id
      );

      return savedProposal
        ? {
            ...savedProposal,
            ownerName: seedProposal.ownerName,
          }
        : structuredClone(seedProposal);
    });

    return {
      ...structuredClone(seedStore),
      ...value,

      profiles,

      institutions: structuredClone(seedStore.institutions),

      proposals,

      workflow:
        value.workflow || structuredClone(seedStore.workflow),

      departmentWorkflows:
        value.departmentWorkflows ||
        structuredClone(seedStore.departmentWorkflows),

      departmentSettings:
        value.departmentSettings ||
        structuredClone(seedStore.departmentSettings),

      rolePermissions:
        value.rolePermissions ||
        structuredClone(seedStore.rolePermissions),

      drafts:
        value.drafts || {
          [currentStudentId]: value.draft || '',
        },
    };
  } catch (error) {
    console.error('Unable to load Leeder demo data:', error);
    return structuredClone(seedStore);
  }
}
