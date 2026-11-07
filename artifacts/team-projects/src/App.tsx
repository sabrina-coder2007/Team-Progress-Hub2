import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { ArrowRight, BookOpen, Check, ChevronRight, ClipboardCheck, FilePenLine, FileText, Languages, LockKeyhole, Menu, Save, UserRound, Bell, AlignLeft, Heading1, Heading2, Plus, Trash2, X, Building2, Users, Settings2, CircleCheck, CircleAlert, GraduationCap } from 'lucide-react';
import { currentStudentId, departmentId, loadStore, STORAGE_KEY, type DemoStore, type Profile, type Proposal, type ProposalStatus, type Role, type RolePermission, type UiLanguage } from './demo';
import { RegistrationFields } from './components/RegistrationFields';
import { ThesisEditor } from './components/ThesisEditor';

const words: Record<UiLanguage, Record<string, string>> = {
  en: {
    home:'Overview', dashboard:'Workspace', proposal:'Research proposal', review:'Review queue', editor:'Writing desk', department:'Department', administration:'Central administration',
    signIn:'Enter demo', register:'Create demo profile', signInTitle:'Choose a demo view', registerTitle:'Create a demo profile', fullName:'Full name', email:'Email address', continue:'Continue to demo', cancel:'Cancel',
     demo:'Demonstration environment', local:'Use fictional demo details only. Proposal data stays in this browser and is not securely stored.', notSecurity:'Role switching and permissions are demo UI only; they are not authentication or security controls.',
    heroEyebrow:'A clearer path from question to research', heroTitle:'Good research starts with a <em>clearer process.</em>', heroText:'Leeder brings proposals, supervisor feedback and writing milestones into one academic workspace — designed for university life in Algeria.',
    explore:'Explore the demo', heroMini:'A focused space for your next research milestone.', featureEyebrow:'A small system for a meaningful journey', featureTitle:'From first idea to first page.', feature1:'Shape your question', feature1d:'Build a structured proposal with the context, objectives and methods visible in one place.', feature2:'Review with context', feature2d:'Follow a sample approval workflow with useful, traceable feedback.', feature3:'Write when ready', feature3d:'The writing desk opens only after every required configured approval step is complete.',
    welcome:'Welcome,', student:'Student', supervisor:'Academic supervisor', departmentAdmin:'Department administrator', centralAdmin:'Central administrator', rolePreview:'Demo role preview — not a security feature',
    workspace:'Your research, in good order.', workspaceDesc:'A clear view of your research work and what comes next.', editProposal:'Edit proposal', currentStatus:'Proposal status', progress:'Journey progress', profile:'Profile', academic:'Academic details',
    university:'University', universityName:'Higher Normal School of Bouzaréah (ENSB)', departmentName:'Faculty of Social Sciences', degree:'Degree', degreeName:'Master 2 · Educational Sciences', year:'Academic year',
    notifications:'Recent updates', noNotifications:'No updates yet. New review activity will appear here.', nextStep:'Next milestone', title:'Working title', field:'Research field', problem:'Problem statement', objectives:'Research objectives', methodology:'Methodology', outline:'Proposed outline', language:'Research language', other:'Other',
    proposalPageDesc:'Bring your research question into focus. Your changes are saved on this device.', saveDraft:'Save as draft', submit:'Submit for review', saved:'Saved locally on this device.', required:'Please add a working title and problem statement before submitting.', submitted:'Proposal submitted to the demo review queue.',
    reviewTitle:'Review queue', reviewDesc:'Projects assigned to this sample reviewer. Only the current approval step can be advanced.', queue:'Assigned projects', reviewerNotes:'Review comments', notesHint:'Add a useful comment for the student…', approve:'Approve current step', requestChanges:'Request modifications', reject:'Reject proposal', actionSaved:'Decision saved to local demo data.',
    editorTitle:'Writing desk', editorDesc:'A quiet space for developing your approved research.', lockedTitle:'Writing desk locked', lockedDesc:'This preview opens after the final required step in your department workflow is approved.', unlock:'Open review queue', save:'Save draft', draftSaved:'Writing draft saved locally.', languageDirection:'Direction follows the research language.', noteOne:'Keep one claim per paragraph.', noteTwo:'Connect each section to a research objective.', noteThree:'Record sources as you read.', placeholder:'Begin with a short introduction to your topic…',
    status:'Status', feedback:'Review feedback', noFeedback:'No review feedback yet.', noProposal:'No proposal has been submitted.', statusDraft:'Draft', statusPending:'Pending review', statusModifications:'Modifications requested', statusApproved:'Approved', statusRejected:'Rejected',
    stepProfile:'Academic profile', stepProposal:'Proposal submitted', stepReview:'Configured review steps', stepWriting:'Writing desk', completed:'Complete', underway:'In progress', awaiting:'Awaiting review', available:'Available', draftNotice:'Draft only',
     honest:'Leeder is an academic project demo. No university authentication, real committee approval, secure document storage or email verification is provided. Passwords are not saved.', location:'Oran, Algeria', sample:'Sample profile', footer:'Academic research workspace prototype',
     studentRegistration:'Student registration', supervisorRegistration:'Supervisor application', registrationRole:'Account type', institution:'University', faculty:'Faculty or higher education institution', departmentField:'Department', chooseDepartment:'Select a department', noDepartments:'Ask central administration to add a department first.', specialization:'Specialization', academicYear:'Academic year', academicTitle:'Academic title', password:'Password', passwordNote:'Use a dummy password; this prototype does not save it.', officialEmailNote:'This field is a demo only. No email checks or verification are performed; use fictional details.', verificationPending:'Email verification pending — simulated only; no email is sent.', supervisorPending:'Pending department approval — simulated demo state.', approvedDemo:'Demo-approved sample account',
     supervisorDash:'Projects assigned to you', noAssigned:'No assigned projects in this sample view.', noSupervisor:'No supervisor assigned yet.', people:'Students and proposals', assignSupervisor:'Assign approved supervisor', chooseSupervisor:'Choose a supervisor', assign:'Assign', approveApplication:'Approve application', rejectApplication:'Reject application', pendingApplications:'Pending supervisor applications',
    academicSettings:'Academic setup', workflow:'Ordered approval workflow', addStep:'Add review step', stepName:'Step label', responsibleRole:'Responsible role', moveUp:'Move up', moveDown:'Move down', remove:'Remove', templates:'Department templates', addTemplate:'Add template', templateName:'Template name', saveChanges:'Save changes',
    institutions:'Institutions and departments', addInstitution:'Add institution', institutionName:'Institution name', newDepartment:'Department name', add:'Add', admins:'Department administrators', createAdmin:'Provision department admin', pendingCentral:'Pending central approval', approveAdmin:'Approve admin',
    oversight:'System overview', activity:'Recent activity', participation:'Participation', authorizedRoster:'Authorized supervisor roster', addSupervisor:'Add supervisor to roster', manageInstitutions:'Manage institutions', setupAccount:'Seeded initial-setup preview',
    currentStep:'Current approval step', completeWorkflow:'All configured approval steps are complete.', finalApproval:'Final step approved — writing desk available.', assignedTo:'Assigned to', comments:'Comments', statusLabel:'State', pending:'Pending', deleteConfirm:'Remove this item from the local demo?', rejectConfirm:'Reject this proposal in the local demo?',
     arabicNote:'Arabic interface: right-to-left layout. Document language and writing direction remain separate from interface language.', back:'Back to workspace', notFound:'Page not found', profileInitial:'AB', browse:'Browse workspace', notAuthorized:'This view is not part of the selected demo role.', openDashboard:'Open your workspace', rolePermissions:'Role permissions', permissionProposal:'Proposal workspace', permissionReview:'Review queue', permissionEditor:'Writing desk', permissionDepartment:'Department operations', permissionAdministration:'Central administration', permissionNotice:'These settings control demo navigation only, not real access control.',
  },
  fr: {
    home:'Aperçu', dashboard:'Espace de travail', proposal:'Projet de recherche', review:'File d’évaluation', editor:'Espace de rédaction', department:'Département', administration:'Administration centrale',
    signIn:'Entrer dans la démo', register:'Créer un profil démo', signInTitle:'Choisir une vue démo', registerTitle:'Créer un profil démo', fullName:'Nom complet', email:'Adresse e-mail', continue:'Continuer', cancel:'Annuler',
     demo:'Environnement de démonstration', local:'Utilisez uniquement des données fictives. Le projet reste dans ce navigateur, sans stockage sécurisé.', notSecurity:'Le changement de rôle et les permissions sont uniquement une interface de démonstration, pas une sécurité.',
    heroEyebrow:'Un chemin plus clair vers la recherche', heroTitle:'Une bonne recherche commence par un <em>parcours clair.</em>', heroText:'Leeder réunit projets, retours d’encadrement et étapes de rédaction dans un espace académique pensé pour l’université en Algérie.',
    explore:'Explorer la démo', heroMini:'Un espace serein pour votre prochaine étape.', featureEyebrow:'Un outil simple pour un parcours essentiel', featureTitle:'De la première idée à la première page.', feature1:'Préciser la question', feature1d:'Structurez le contexte, les objectifs et la méthode dans un même espace.', feature2:'Évaluer avec contexte', feature2d:'Suivez un circuit d’approbation simulé avec des retours utiles.', feature3:'Rédiger au bon moment', feature3d:'L’espace s’ouvre après toutes les étapes configurées.',
    welcome:'Bienvenue,', student:'Étudiant', supervisor:'Encadrant universitaire', departmentAdmin:'Administrateur du département', centralAdmin:'Administration centrale', rolePreview:'Prévisualisation démo — pas une fonction de sécurité',
    workspace:'Votre recherche, bien organisée.', workspaceDesc:'Suivez vos travaux et identifiez la prochaine étape.', editProposal:'Modifier le projet', currentStatus:'État du projet', progress:'Avancement', profile:'Profil', academic:'Parcours universitaire',
    university:'Université', universityName:'École normale supérieure de Bouzaréah (ENSB)', departmentName:'Faculté des sciences sociales', degree:'Diplôme', degreeName:'Master 2 · Sciences de l’éducation', year:'Année universitaire',
    notifications:'Dernières nouvelles', noNotifications:'Aucune nouvelle pour le moment.', nextStep:'Prochaine étape', title:'Titre provisoire', field:'Domaine', problem:'Problématique', objectives:'Objectifs', methodology:'Méthodologie', outline:'Plan provisoire', language:'Langue de recherche', other:'Autre',
    proposalPageDesc:'Précisez votre question de recherche. Les modifications sont enregistrées sur cet appareil.', saveDraft:'Enregistrer le brouillon', submit:'Soumettre à évaluation', saved:'Enregistré localement.', required:'Veuillez saisir un titre et une problématique.', submitted:'Projet transmis à la file démo.',
    reviewTitle:'File d’évaluation', reviewDesc:'Projets attribués à cet évaluateur démo. Seule l’étape actuelle peut avancer.', queue:'Projets attribués', reviewerNotes:'Commentaires', notesHint:'Ajouter un commentaire utile…', approve:'Approuver l’étape', requestChanges:'Demander des modifications', reject:'Refuser le projet', actionSaved:'Décision enregistrée localement.',
    editorTitle:'Espace de rédaction', editorDesc:'Un espace calme pour développer votre recherche approuvée.', lockedTitle:'Espace verrouillé', lockedDesc:'Ouvert après l’approbation de la dernière étape configurée.', unlock:'Ouvrir les évaluations', save:'Enregistrer', draftSaved:'Brouillon enregistré localement.', languageDirection:'Le sens suit la langue de recherche.', noteOne:'Une idée principale par paragraphe.', noteTwo:'Reliez chaque partie à un objectif.', noteThree:'Notez vos sources.', placeholder:'Commencez par une brève introduction…',
    status:'État', feedback:'Retour', noFeedback:'Aucun retour pour le moment.', noProposal:'Aucun projet soumis.', statusDraft:'Brouillon', statusPending:'En attente', statusModifications:'Modifications demandées', statusApproved:'Approuvé', statusRejected:'Refusé',
    stepProfile:'Profil universitaire', stepProposal:'Projet soumis', stepReview:'Étapes configurées', stepWriting:'Rédaction', completed:'Terminé', underway:'En cours', awaiting:'En attente', available:'Disponible', draftNotice:'Brouillon',
     honest:'Leeder est une démonstration académique. Aucun accès universitaire, approbation réelle, stockage sécurisé ni vérification d’e-mail. Les mots de passe ne sont pas enregistrés.', location:'Oran, Algérie', sample:'Profil exemple', footer:'Prototype d’espace de recherche',
     studentRegistration:'Inscription étudiante', supervisorRegistration:'Candidature encadrant', registrationRole:'Type de compte', institution:'Université', faculty:'Faculté ou établissement d’enseignement supérieur', departmentField:'Département', chooseDepartment:'Choisir un département', noDepartments:'Demandez au central d’ajouter un département.', specialization:'Spécialité', academicYear:'Année universitaire', academicTitle:'Titre académique', password:'Mot de passe', passwordNote:'Utilisez un mot de passe fictif ; ce prototype ne l’enregistre pas.', officialEmailNote:'Champ de démonstration : aucun e-mail n’est contrôlé ni vérifié. Utilisez des données fictives.', verificationPending:'Vérification e-mail en attente — simulée, aucun message envoyé.', supervisorPending:'En attente d’approbation du département — état simulé.', approvedDemo:'Compte exemple approuvé',
     supervisorDash:'Projets attribués', noAssigned:'Aucun projet attribué dans cet exemple.', noSupervisor:'Aucun encadrant n’est encore attribué.', people:'Étudiants et projets', assignSupervisor:'Attribuer un encadrant approuvé', chooseSupervisor:'Choisir un encadrant', assign:'Attribuer', approveApplication:'Approuver', rejectApplication:'Refuser', pendingApplications:'Candidatures en attente',
    academicSettings:'Configuration académique', workflow:'Circuit ordonné d’approbation', addStep:'Ajouter une étape', stepName:'Nom de l’étape', responsibleRole:'Rôle responsable', moveUp:'Monter', moveDown:'Descendre', remove:'Supprimer', templates:'Modèles du département', addTemplate:'Ajouter un modèle', templateName:'Nom du modèle', saveChanges:'Enregistrer',
    institutions:'Établissements et départements', addInstitution:'Ajouter un établissement', institutionName:'Nom de l’établissement', newDepartment:'Nom du département', add:'Ajouter', admins:'Administrateurs de département', createAdmin:'Provisionner un administrateur', pendingCentral:'En attente du central', approveAdmin:'Approuver',
    oversight:'Vue système', activity:'Activité récente', participation:'Participation', authorizedRoster:'Liste des encadrants autorisés', addSupervisor:'Ajouter à la liste', manageInstitutions:'Gérer les établissements', setupAccount:'Aperçu de configuration initiale',
    currentStep:'Étape actuelle', completeWorkflow:'Toutes les étapes configurées sont terminées.', finalApproval:'Dernière étape approuvée — rédaction disponible.', assignedTo:'Attribué à', comments:'Commentaires', statusLabel:'État', pending:'En attente', deleteConfirm:'Retirer cet élément de la démo locale ?', rejectConfirm:'Refuser ce projet dans la démo locale ?',
     arabicNote:'Interface arabe : disposition droite-à-gauche. La langue du document reste indépendante.', back:'Retour à l’espace', notFound:'Page introuvable', profileInitial:'AB', browse:'Voir l’espace', notAuthorized:'Cette vue ne fait pas partie du rôle démo sélectionné.', openDashboard:'Ouvrir votre espace', rolePermissions:'Autorisations par rôle', permissionProposal:'Espace de projet', permissionReview:'File d’évaluation', permissionEditor:'Espace de rédaction', permissionDepartment:'Gestion du département', permissionAdministration:'Administration centrale', permissionNotice:'Ces réglages concernent uniquement la navigation démo, pas le contrôle d’accès réel.',
  },
  ar: {
    home:'الرئيسية', dashboard:'مساحة العمل', proposal:'مقترح البحث', review:'قائمة المراجعة', editor:'مساحة الكتابة', department:'القسم', administration:'الإدارة المركزية',
    signIn:'دخول تجريبي', register:'إنشاء ملف تجريبي', signInTitle:'اختر عرضاً تجريبياً', registerTitle:'إنشاء ملف تجريبي', fullName:'الاسم الكامل', email:'البريد الإلكتروني', continue:'المتابعة للتجربة', cancel:'إلغاء',
     demo:'بيئة تجريبية', local:'استخدم بيانات تجريبية وهمية فقط. تبقى بيانات البحث في هذا المتصفح دون تخزين آمن.', notSecurity:'تبديل الدور والصلاحيات واجهة تجريبية فقط وليست مصادقة أو حماية.',
    heroEyebrow:'مسار أوضح نحو البحث العلمي', heroTitle:'يبدأ البحث الجيد <em>بمسار أوضح.</em>', heroText:'يجمع ليدر المقترحات وملاحظات المشرف ومراحل الكتابة في مساحة أكاديمية تراعي واقع الجامعة في الجزائر.',
    explore:'استكشف التجربة', heroMini:'مساحة مركزة لخطوتك البحثية القادمة.', featureEyebrow:'مساحة بسيطة لرحلة مهمة', featureTitle:'من الفكرة الأولى إلى الصفحة الأولى.', feature1:'حدد سؤالك', feature1d:'نظم السياق والأهداف والمنهجية في مكان واحد.', feature2:'مراجعة بسياق واضح', feature2d:'تابع سير اعتماد تجريبي مع ملاحظات مفيدة.', feature3:'اكتب عندما تكون جاهزاً', feature3d:'تفتح مساحة الكتابة بعد اكتمال كل مراحل الاعتماد المحددة.',
    welcome:'مرحباً،', student:'طالب', supervisor:'مشرف أكاديمي', departmentAdmin:'مسؤول القسم', centralAdmin:'الإدارة المركزية', rolePreview:'معاينة دور تجريبية — ليست ميزة أمنية',
    workspace:'بحثك، بخطوات واضحة.', workspaceDesc:'تابع أعمالك البحثية والخطوة التالية.', editProposal:'تعديل المقترح', currentStatus:'حالة المقترح', progress:'التقدم', profile:'الملف الشخصي', academic:'المعلومات الأكاديمية',
    university:'الجامعة', universityName:'المدرسة العليا للأساتذة بوزريعة', departmentName:'كلية العلوم الاجتماعية', degree:'الدرجة', degreeName:'ماستر 2 · علوم التربية', year:'السنة الجامعية',
    notifications:'آخر التحديثات', noNotifications:'لا توجد تحديثات حالياً.', nextStep:'المرحلة التالية', title:'عنوان مبدئي', field:'المجال البحثي', problem:'إشكالية البحث', objectives:'أهداف البحث', methodology:'المنهجية', outline:'الخطة المقترحة', language:'لغة البحث', other:'أخرى',
    proposalPageDesc:'صغ سؤال البحث بوضوح. تحفظ التعديلات على هذا الجهاز.', saveDraft:'حفظ كمسودة', submit:'إرسال للمراجعة', saved:'تم الحفظ محلياً.', required:'يرجى إدخال العنوان والإشكالية.', submitted:'تم إرسال المقترح إلى قائمة المراجعة التجريبية.',
    reviewTitle:'قائمة المراجعة', reviewDesc:'المشاريع المسندة لهذا المراجع التجريبي. يمكن تقديم المرحلة الحالية فقط.', queue:'المشاريع المسندة', reviewerNotes:'تعليقات المراجعة', notesHint:'أضف تعليقاً مفيداً للطالب…', approve:'اعتماد المرحلة الحالية', requestChanges:'طلب تعديلات', reject:'رفض المقترح', actionSaved:'تم حفظ القرار محلياً.',
    editorTitle:'مساحة الكتابة', editorDesc:'مساحة هادئة لتطوير بحثك المعتمد.', lockedTitle:'مساحة الكتابة مقفلة', lockedDesc:'تفتح بعد اعتماد آخر مرحلة مطلوبة في سير القسم.', unlock:'فتح قائمة المراجعة', save:'حفظ المسودة', draftSaved:'تم حفظ المسودة محلياً.', languageDirection:'الاتجاه يتبع لغة البحث.', noteOne:'اجعل لكل فقرة فكرة رئيسية واحدة.', noteTwo:'اربط كل قسم بهدف بحثي.', noteThree:'دوّن المصادر أثناء القراءة.', placeholder:'ابدأ بمقدمة قصيرة عن موضوعك…',
    status:'الحالة', feedback:'ملاحظات المراجعة', noFeedback:'لا توجد ملاحظات بعد.', noProposal:'لم يتم إرسال مقترح.', statusDraft:'مسودة', statusPending:'بانتظار المراجعة', statusModifications:'مطلوب تعديلات', statusApproved:'معتمد', statusRejected:'مرفوض',
    stepProfile:'الملف الأكاديمي', stepProposal:'إرسال المقترح', stepReview:'مراحل الاعتماد المحددة', stepWriting:'مساحة الكتابة', completed:'مكتمل', underway:'قيد التنفيذ', awaiting:'بانتظار المراجعة', available:'متاح', draftNotice:'مسودة',
     honest:'ليدر نموذج أكاديمي. لا يوفر دخولاً جامعياً أو اعتماداً حقيقياً أو تخزيناً آمناً أو تحققاً من البريد. لا تُحفظ كلمات المرور.', location:'وهران، الجزائر', sample:'ملف تجريبي', footer:'نموذج لمساحة بحث أكاديمي',
     studentRegistration:'تسجيل طالب', supervisorRegistration:'طلب انضمام مشرف', registrationRole:'نوع الحساب', institution:'الجامعة', faculty:'الكلية أو مؤسسة التعليم العالي', departmentField:'القسم', chooseDepartment:'اختر قسماً', noDepartments:'اطلب من الإدارة المركزية إضافة قسم أولاً.', specialization:'التخصص', academicYear:'السنة الجامعية', academicTitle:'الرتبة الأكاديمية', password:'كلمة المرور', passwordNote:'استخدم كلمة مرور وهمية؛ لا يحفظها هذا النموذج.', officialEmailNote:'حقل تجريبي فقط. لا يتم فحص البريد أو التحقق منه؛ استخدم بيانات وهمية.', verificationPending:'التحقق من البريد بانتظار الإجراء — محاكاة فقط، لا يتم إرسال بريد.', supervisorPending:'بانتظار موافقة القسم — حالة تجريبية.', approvedDemo:'حساب عينة معتمد تجريبياً',
     supervisorDash:'المشاريع المسندة إليك', noAssigned:'لا توجد مشاريع مسندة في هذه العينة.', noSupervisor:'لم يتم تعيين مشرف بعد.', people:'الطلاب والمقترحات', assignSupervisor:'تعيين مشرف معتمد', chooseSupervisor:'اختر مشرفاً', assign:'تعيين', approveApplication:'موافقة على الطلب', rejectApplication:'رفض الطلب', pendingApplications:'طلبات المشرفين بانتظار الموافقة',
    academicSettings:'الإعداد الأكاديمي', workflow:'سير اعتماد مرتب', addStep:'إضافة مرحلة مراجعة', stepName:'اسم المرحلة', responsibleRole:'الدور المسؤول', moveUp:'تحريك للأعلى', moveDown:'تحريك للأسفل', remove:'إزالة', templates:'قوالب القسم', addTemplate:'إضافة قالب', templateName:'اسم القالب', saveChanges:'حفظ التغييرات',
    institutions:'الجامعات والأقسام', addInstitution:'إضافة جامعة', institutionName:'اسم الجامعة', newDepartment:'اسم القسم', add:'إضافة', admins:'مسؤولو الأقسام', createAdmin:'تجهيز مسؤول قسم', pendingCentral:'بانتظار موافقة الإدارة المركزية', approveAdmin:'اعتماد المسؤول',
    oversight:'نظرة عامة للنظام', activity:'النشاط الأخير', participation:'المشاركة', authorizedRoster:'قائمة المشرفين المعتمدين', addSupervisor:'إضافة للقائمة', manageInstitutions:'إدارة المؤسسات', setupAccount:'معاينة الإعداد الأولي',
    currentStep:'مرحلة الاعتماد الحالية', completeWorkflow:'اكتملت كل مراحل الاعتماد المحددة.', finalApproval:'اعتماد المرحلة الأخيرة — مساحة الكتابة متاحة.', assignedTo:'مسند إلى', comments:'التعليقات', statusLabel:'الحالة', pending:'قيد الانتظار', deleteConfirm:'إزالة هذا العنصر من النسخة المحلية؟', rejectConfirm:'رفض هذا المقترح في النسخة التجريبية؟',
     arabicNote:'واجهة عربية باتجاه من اليمين إلى اليسار. تبقى لغة المستند مستقلة عن لغة الواجهة.', back:'العودة لمساحة العمل', notFound:'الصفحة غير موجودة', profileInitial:'أب', browse:'استعراض مساحة العمل', notAuthorized:'هذا العرض غير متاح للدور التجريبي المحدد.', openDashboard:'فتح مساحة العمل', rolePermissions:'صلاحيات الأدوار', permissionProposal:'مساحة المقترح', permissionReview:'قائمة المراجعة', permissionEditor:'مساحة الكتابة', permissionDepartment:'إدارة القسم', permissionAdministration:'الإدارة المركزية', permissionNotice:'تتحكم هذه الإعدادات في التنقل التجريبي فقط، ولا توفر تحكماً حقيقياً في الوصول.',
  },
};

const roleText: Record<Role, string> = { student:'student', supervisor:'supervisor', department:'departmentAdmin', central:'centralAdmin' };
const roles: Role[] = ['student', 'supervisor', 'department', 'central'];
const normalizeRole = (value: string | null): Role => value === 'reviewer' ? 'supervisor' : roles.includes(value as Role) ? value as Role : 'student';
const normalizeLanguage = (value: string | null): UiLanguage => value === 'ar' || value === 'fr' ? value : 'en';
const permissionOptions: { id:RolePermission; label:string }[] = [
  {id:'proposal',label:'permissionProposal'},
  {id:'review',label:'permissionReview'},
  {id:'editor',label:'permissionEditor'},
  {id:'department',label:'permissionDepartment'},
  {id:'administration',label:'permissionAdministration'},
];
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
const researchLangCode = (name: string) => name.toLowerCase().includes('arab') ? 'ar' : name.toLowerCase().includes('french') || name.toLowerCase().includes('français') ? 'fr' : name.toLowerCase().includes('english') ? 'en' : 'und';
const departmentKey = (institutionId: string, name: string) => {
  if(institutionId==='oran1'&&name==='Faculty of Social Sciences')return 'dept-social';
  if(institutionId==='oran1'&&name==='Department of Languages')return 'dept-languages';
  const slug=encodeURIComponent(name.trim()).replace(/%/g,'').replace(/[^A-Za-z0-9]+/g,'-');
  return `dept-${institutionId}-${slug||'new'}`;
};
const legacyDefaultDraftText = 'Introduction\n\nThis research explores the role of digital learning practices in Algerian public universities. It begins by examining how students access learning resources and participate in blended courses.\n\nResearch focus\n\nThe study considers access, study habits and student engagement as connected dimensions of the learning experience.';
const defaultDraftText = '';
const normalizeDraft = (value?: string) => value === legacyDefaultDraftText ? '' : value || '';
const buildStudentDraft = (profile: Profile, workflow: DemoStore['workflow'], profiles: Profile[]): Proposal => ({
  id: `proposal-${profile.id}`,
  ownerId: profile.id,
  ownerName: profile.name,
  title: '',
  field: '',
  problem: '',
  objectives: '',
  methodology: '',
  outline: '',
  researchLanguage: 'English',
  status: 'Draft',
  feedback: '',
  supervisorId: profiles.find(person => person.role === 'supervisor' && person.departmentId === profile.departmentId && person.state === 'demo-approved')?.id || '',
  departmentId: profile.departmentId,
  steps: workflow.map(step => ({ ...step, approved: false, comment: '' })),
});

function App() {
  const [store, setStore] = useState<DemoStore>(loadStore);
  const [language, setLanguage] = useState<UiLanguage>(() => normalizeLanguage(localStorage.getItem('leeder-language')));
  const [role, setRole] = useState<Role>(() => normalizeRole(localStorage.getItem('leeder-role')));
  const [activeStudentId, setActiveStudentId] = useState(() => localStorage.getItem('leeder-student-preview') || currentStudentId);
  const [supervisorPersonaId, setSupervisorPersonaId] = useState(() => localStorage.getItem('leeder-supervisor-preview') || 'supervisor-meriem');
  const [departmentPersonaId, setDepartmentPersonaId] = useState(() => localStorage.getItem('leeder-department-preview') || 'dept-admin');
  const [location, navigate] = useLocation();
  const [toast, setToast] = useState('');
  const [accessMode, setAccessMode] = useState<'login' | 'register' | null>(null);
  const [registrationRole, setRegistrationRole] = useState<'student' | 'supervisor'>('student');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setForm] = useState<Proposal>(() => store.proposals.find(item => item.ownerId === (localStorage.getItem('leeder-student-preview') || currentStudentId)) || store.proposals[0]);
  const [reviewSelectedId, setReviewSelectedId] = useState('proposal-amel');
  const [access, setAccess] = useState({ name:'', email:'', institution:'Higher Normal School of Bouzaréah (ENSB)', faculty:'Faculty of Social Sciences', department:'Faculty of Social Sciences', specialization:'Educational Sciences', year:'2024–2025', title:'Associate professor', password:'' });
  const [newText, setNewText] = useState('');
  const [adminInstitutionId, setAdminInstitutionId] = useState('oran1');
  const [adminDepartmentName, setAdminDepartmentName] = useState('Faculty of Social Sciences');
  const [draft, setDraft] = useState(() => normalizeDraft(store.drafts?.[localStorage.getItem('leeder-student-preview') || currentStudentId] ?? (localStorage.getItem('leeder-student-preview') === currentStudentId ? store.draft : undefined)));
  const t = (key: string) => words[language][key] || words.en[key] || key;
  const hasPermission = (permission: RolePermission) => store.rolePermissions[role]?.includes(permission) || false;
  const studentProfile = store.profiles.find(profile => profile.id === activeStudentId) || store.profiles.find(profile => profile.role === 'student') || store.profiles[0];
  const studentProposal = store.proposals.find(item => item.ownerId === studentProfile.id) || buildStudentDraft(studentProfile, store.departmentWorkflows[studentProfile.departmentId] || store.workflow, store.profiles);
  const updateStore = (updater: (old: DemoStore) => DemoStore) => setStore(updater);
  const statusText = (status: ProposalStatus) => ({ Draft:t('statusDraft'), 'Pending Review':t('statusPending'), 'Modifications Requested':t('statusModifications'), Approved:t('statusApproved'), Rejected:t('statusRejected') })[status];
  const statusBadge = (status: ProposalStatus) => <span className={`status status-${status.replaceAll(' ','-')}`} data-testid={`status-${status.toLowerCase().replaceAll(' ','-')}`}>{statusText(status)}</span>;
  const currentUser = role === 'supervisor'
    ? store.profiles.find(profile => profile.id === supervisorPersonaId) || store.profiles.find(profile => profile.role === role) || store.profiles[0]
    : role === 'student' ? studentProfile
    : role === 'department'
      ? store.profiles.find(profile => profile.id === departmentPersonaId && profile.role === 'department') || store.profiles.find(profile => profile.role === role) || store.profiles[0]
      : store.profiles.find(profile => profile.role === role) || store.profiles[0];
  const workflowComplete = (project: Proposal) => project.steps.length > 0 && project.steps.every(step => step.approved);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }, [store]);
  useEffect(() => { localStorage.setItem('leeder-student-preview', activeStudentId); }, [activeStudentId]);
  useEffect(() => {
    setForm(studentProposal);
    setDraft(normalizeDraft(store.drafts[activeStudentId] ?? (activeStudentId === currentStudentId ? store.draft : undefined)));
  }, [activeStudentId]);
  useEffect(() => {
    localStorage.setItem('leeder-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', language === 'ar');
  }, [language]);
  useEffect(() => { localStorage.setItem('leeder-role', role); }, [role]);
  useEffect(() => { localStorage.setItem('leeder-supervisor-preview', supervisorPersonaId); }, [supervisorPersonaId]);
  useEffect(() => { localStorage.setItem('leeder-department-preview', departmentPersonaId); }, [departmentPersonaId]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2800); return () => window.clearTimeout(timer); }, [toast]);
  const navigateTo = (href: string) => { navigate(href); setMobileMenu(false); };
  const closeAccess = () => { setAccessMode(null);setAccess(old=>({...old,password:''})); };
  const header = () => {
    const links: [string,string][] = [['/','home'],['/dashboard','dashboard']];
    if(role==='student'){
      if(hasPermission('proposal'))links.push(['/proposal','proposal']);
      if(hasPermission('editor'))links.push(['/editor','editor']);
    }
    if(role==='supervisor'&&hasPermission('review'))links.push(['/review','review']);
    if(role==='department'){
      if(hasPermission('department'))links.push(['/department','department']);
      if(hasPermission('review'))links.push(['/review','review']);
    }
    if(role==='central'){
      if(hasPermission('administration'))links.push(['/administration','administration']);
      if(hasPermission('review'))links.push(['/review','review']);
    }
    return <header className="topbar">
      <Link href="/" className="brand" data-testid="link-home" onClick={() => setMobileMenu(false)}><span className="brand-mark">L</span><span>leeder</span><span className="brand-caption">RESEARCH WORKSPACE</span></Link>
      <button className="mobile-menu-button" aria-label="Toggle navigation" aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)} data-testid="button-menu"><Menu size={19}/></button>
      <nav className={`nav-links ${mobileMenu ? 'nav-open' : ''}`} aria-label="Main navigation">
        {links.map(([href,key]) => <Link href={href} key={href} className={`nav-link ${location===href?'active':''}`} data-testid={`link-${key}`} onClick={() => setMobileMenu(false)}>{t(key)}</Link>)}
      </nav>
      <div className="nav-actions">
        <label className="sr-only" htmlFor="role-preview">{t('rolePreview')}</label>
        <select id="role-preview" className="role-select" value={role} aria-label={t('rolePreview')} onChange={event => { const nextRole=event.target.value as Role;setRole(nextRole);navigateTo(nextRole==='department'?'/department':nextRole==='central'?'/administration':'/dashboard'); }} data-testid="select-demo-role">
          {roles.map(item => <option key={item} value={item}>{t(roleText[item])}</option>)}
        </select>
        {role === 'student' && <select className="role-select student-persona-select" value={studentProfile.id} aria-label={t('student')} onChange={event => setActiveStudentId(event.target.value)} data-testid="select-student-persona">
          {store.profiles.filter(profile => profile.role === 'student').map(person => <option key={person.id} value={person.id}>{person.name}</option>)}
        </select>}
        <select className="lang-select" value={language} aria-label="Interface language" onChange={event => setLanguage(event.target.value as UiLanguage)} data-testid="select-language">
          <option value="en">EN</option><option value="fr">FR</option><option value="ar">عربي</option>
        </select>
      </div>
    </header>;
  };
  const notice = () => <div className="notice" data-testid="text-demo-notice"><span className="notice-dot"/><span><strong>{t('demo')}.</strong> {t('local')} <span className="notice-security">{t('notSecurity')}</span></span></div>;
  const pageHead = (eyebrow: string, title: string, desc: string, extra?: ReactNode) => <div className="page-head" style={{marginTop:28}}><div><div className="eyebrow">{eyebrow}</div><h1 className="page-title">{title}</h1><p className="page-subtitle">{desc}</p></div>{extra}</div>;
  const sampleProjects = store.proposals.filter(project => project.departmentId === currentUser.departmentId);
  const assignedProjects = currentUser.state === 'demo-approved' ? store.proposals.filter(project => project.supervisorId === currentUser.id) : [];

  const landing = () => <div className="landing">{header()}
    <section className="hero fade-in"><div>
      <div className="eyebrow">{t('heroEyebrow')}</div><h1 dangerouslySetInnerHTML={{__html:t('heroTitle')}}/><p className="hero-copy">{t('heroText')}</p>
      <div className="hero-actions"><button className="btn btn-primary" onClick={() => setAccessMode('login')} data-testid="button-enter-demo">{t('signIn')} <ArrowRight size={15}/></button><button className="btn btn-outline" onClick={() => { setRegistrationRole('student'); setAccessMode('register'); }} data-testid="button-register-demo">{t('register')}</button></div>
      <div style={{marginTop:26,maxWidth:540}}>{notice()}</div>
      <div className="role-entry-list"><button onClick={() => { setRole('student');navigateTo('/dashboard'); }}><GraduationCap size={16}/>{t('student')}<ChevronRight size={14}/></button><button onClick={() => { setRole('supervisor');navigateTo('/dashboard'); }}><UserRound size={16}/>{t('supervisor')}<ChevronRight size={14}/></button><button onClick={() => { setRole('department');navigateTo('/department'); }}><Building2 size={16}/>{t('departmentAdmin')}<ChevronRight size={14}/></button><button onClick={() => { setRole('central');navigateTo('/administration'); }}><Settings2 size={16}/>{t('centralAdmin')}<ChevronRight size={14}/></button></div>
    </div><div className="hero-art"><div className="art-kicker">LEEDER / RESEARCH JOURNEY</div><div className="art-title">{t('heroMini')}</div><div className="paper-card"><div className="meta-label">{t('proposal')}</div><div style={{fontWeight:700,fontSize:15,marginTop:10,color:'#213d54'}}>{studentProposal.title}</div><div className="paper-line"/><div className="paper-line short"/><div className="paper-line"/><span className="paper-tag">{statusText(studentProposal.status)}</span></div><div className="art-bottom">{t('universityName')}</div></div></section>
    <section className="landing-section"><div className="eyebrow">{t('featureEyebrow')}</div><h2 className="section-headline">{t('featureTitle')}</h2><p className="page-subtitle">{t('honest')}</p><div className="feature-grid">{[['01',t('feature1'),t('feature1d'),FileText],['02',t('feature2'),t('feature2d'),ClipboardCheck],['03',t('feature3'),t('feature3d'),BookOpen]].map(([n,title,desc,Icon])=>{const Mark=Icon as typeof FileText; return <article className="feature-card" key={n as string}><span className="feature-index">{n as string} / 03</span><div className="feature-card-title"><h3>{title as string}</h3><Mark size={18}/></div><p>{desc as string}</p></article>;})}</div></section>
    <footer className="landing-footer"><span>© Leeder · {t('footer')}</span><span>{t('sample')} · {t('location')}</span></footer>
    {accessMode && <div className="access-overlay" onClick={closeAccess}><section className="access-dialog" role="dialog" aria-modal="true" aria-labelledby="access-title" onClick={event => event.stopPropagation()}>
      <div className="access-dialog-top"><span className="brand-mark">L</span><button type="button" className="access-close" aria-label={t('cancel')} onClick={closeAccess}><X size={18}/></button></div><div className="eyebrow">{t('demo')}</div><h2 id="access-title">{accessMode === 'login' ? t('signInTitle') : t('registerTitle')}</h2>
      {accessMode === 'login' ? <div className="login-role-options">{roles.map(item => <button key={item} className="panel role-option" onClick={() => { setRole(item); setAccessMode(null); navigateTo(item === 'department' ? '/department' : item === 'central' ? '/administration' : '/dashboard'); }}><span className="role-option-icon">{item==='student'?<GraduationCap size={18}/>:item==='supervisor'?<UserRound size={18}/>:item==='department'?<Building2 size={18}/>:<Settings2 size={18}/>}</span><span><strong>{t(roleText[item])}</strong><small>{item==='central'?t('setupAccount'):t('rolePreview')}</small></span><ChevronRight size={16}/></button>)}</div> :
        <RegistrationFields registrationRole={registrationRole} setRegistrationRole={setRegistrationRole} institutions={store.institutions} access={access} setAccess={setAccess} t={t} onCancel={closeAccess} onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const itemRole = registrationRole;
          const institution=store.institutions.find(item=>item.name===access.institution);
          if(!institution||!institution.departments.includes(access.department)){setToast(t('noDepartments'));return;}
          const selectedDepartmentId=departmentKey(institution.id,access.department);
          const newProfile = { id:`profile-${Date.now()}`, name:access.name.trim(), email:access.email.trim(), role:itemRole, state:itemRole==='student'?'email-verification-pending':'pending-department-approval', institutionId:institution.id, departmentId:selectedDepartmentId, institutionName:institution.name, facultyName:access.faculty.trim(), departmentName:access.department.trim(), specialization:access.specialization, academicYear:access.year, title:access.title };
          const newProposal = itemRole === 'student' ? buildStudentDraft(newProfile, store.departmentWorkflows[selectedDepartmentId]||store.workflow, [...store.profiles,newProfile]) : undefined;
          updateStore(old => ({...old, profiles:[...old.profiles,newProfile], proposals:newProposal?[...old.proposals,newProposal]:old.proposals, activity:[`${newProfile.name} registered as ${itemRole}; ${itemRole==='student'?'email verification pending':'department approval pending'}.`,...old.activity].slice(0,8)}));
          if(itemRole==='student')setActiveStudentId(newProfile.id);
          if(itemRole==='supervisor')setSupervisorPersonaId(newProfile.id);
          setAccess(old=>({...old,name:'',email:'',password:''}));setRole(itemRole);setAccessMode(null);setToast(itemRole==='student'?t('verificationPending'):t('supervisorPending'));navigateTo('/dashboard');
        }}/> }
      </section></div>}
  </div>;

  const studentDashboard = () => {
    const p = studentProposal;
    const supervisor = store.profiles.find(profile => profile.id === p.supervisorId);
    const progress = workflowComplete(p) ? 100 : p.status==='Draft' ? 28 : 45 + Math.round((p.steps.filter(step=>step.approved).length/Math.max(p.steps.length,1))*45);
    const next = workflowComplete(p) ? t('editorTitle') : p.status==='Draft' ? t('proposal') : p.steps.find(step=>!step.approved)?.label || t('review');
    return <><main className="page-wrap fade-in">{notice()}{pageHead(`${t('welcome')} ${studentProfile.name}`,t('workspace'),t('workspaceDesc'),<button className="btn btn-primary" onClick={() => navigateTo('/proposal')}><FilePenLine size={15}/>{t('editProposal')}</button>)}
      {studentProfile.state==='email-verification-pending'&&<div className="callout" style={{marginTop:16}}>{t('verificationPending')} {t('notSecurity')}</div>}
      <div className="grid-main"><div className="stack">
        <section className="panel panel-pad"><div className="panel-topline"><div><div className="meta-label">{t('currentStatus')}</div><div style={{marginTop:9}}>{statusBadge(p.status)}</div></div><button className="btn btn-soft" onClick={() => navigateTo('/proposal')}>{t('proposal')} <ChevronRight size={14}/></button></div>
          <h2 className="proposal-title">{p.title || t('noProposal')}</h2><div className="muted" style={{fontSize:12}}>{p.field || '—'} · {p.researchLanguage}</div>{p.feedback && <div className="callout" style={{marginTop:17}}><strong>{t('feedback')}:</strong> <span dir="auto">{p.feedback}</span></div>}
          <div className="stat-row"><div className="stat"><div className="stat-label">{t('progress')}</div><div className="stat-value">{progress}%</div><div className="progress-track"><div className="progress-fill" style={{width:`${progress}%`}}/></div></div><div className="stat"><div className="stat-label">{t('nextStep')}</div><div className="stat-value stat-value-small">{next}</div></div><div className="stat"><div className="stat-label">{t('language')}</div><div className="stat-value stat-value-small">{p.researchLanguage}</div></div></div>
          <div className="meta-label">{t('stepReview')}</div><div className="steps">{p.steps.map((step,index)=><div className={`step ${step.approved?'done':index===p.steps.findIndex(item=>!item.approved)?'':'pending'}`} key={step.id}><span className="step-icon">{step.approved?<Check size={12}/>:index+1}</span><div><strong>{step.label}</strong><small>{step.approved?t('completed'):index===p.steps.findIndex(item=>!item.approved)?t('awaiting'):t('pending')}</small>{step.comment&&<small dir="auto">{step.comment}</small>}</div></div>)}</div>
        </section>
        <section className="panel panel-pad"><h2 className="section-title">{t('academic')}</h2><p className="section-caption">{t('sample')}</p><div className="stat-row" style={{marginBottom:0,gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))'}}>{[[t('university'),studentProfile.institutionName||t('universityName')],[t('faculty'),studentProfile.facultyName||'—'],[t('departmentField'),studentProfile.departmentName||t('departmentName')],[t('degree'),`${studentProfile.specialization} · ${studentProfile.academicYear}`]].map(([label,value])=><div className="stat" key={label}><div className="stat-label">{label}</div><div className="meta-value">{value}</div></div>)}</div></section>
      </div><aside className="stack"><section className="panel panel-pad"><h2 className="section-title">{t('profile')}</h2><div className="profile-line" style={{marginTop:18}}><div className="avatar">{initials(studentProfile.name)}</div><div><strong dir="auto">{studentProfile.name}</strong><div className="muted" style={{fontSize:11,marginTop:4}}>{studentProfile.specialization}</div></div></div><div className="divider"/><div className="meta-label">{t('supervisor')}</div><div className="profile-line" style={{marginTop:12}}><div className="avatar avatar-muted">{supervisor?initials(supervisor.name):<UserRound size={15}/>}</div><div><strong>{supervisor?.name||t('noSupervisor')}</strong><div className="muted" style={{fontSize:11,marginTop:4}}>{supervisor?.title||t('supervisor')} · {supervisor?.specialization||''}</div></div></div></section>
      <section className="panel panel-pad"><div className="panel-topline"><Bell size={15} color="#398879"/><h2 className="section-title" style={{margin:0}}>{t('notifications')}</h2></div>{p.feedback?<div className="notification"><span className="notification-mark"/><div><p dir="auto">{p.feedback}</p><time>{t('sample')} · local demo</time></div></div>:<div className="empty-inline">{t('noNotifications')}</div>}</section>
      <div className="callout"><strong>{t('demo')}.</strong> {t('honest')}</div></aside></div>
    </main></>;
  };

  const dashboard = () => role === 'student' ? studentDashboard() : role === 'supervisor' ? supervisorDashboard() : role === 'department' ? departmentDashboard() : centralDashboard();

  function supervisorDashboard() {
    return <main className="page-wrap fade-in">{notice()}{pageHead(`${t('supervisor')} · ${currentUser.name}`,t('supervisorDash'),t('reviewDesc'),<div className="supervisor-actions"><label className="sr-only" htmlFor="supervisor-preview">{t('supervisor')}</label><select id="supervisor-preview" className="role-select" value={currentUser.id} onChange={e=>setSupervisorPersonaId(e.target.value)}>{store.profiles.filter(profile=>profile.role==='supervisor').map(person=><option key={person.id} value={person.id}>{person.name} · {person.state==='demo-approved'?t('approvedDemo'):t('pending')}</option>)}</select><button className="btn btn-primary" onClick={() => navigateTo('/review')}><ClipboardCheck size={15}/>{t('reviewTitle')}</button></div>)}
      {currentUser.state!=='demo-approved'&&<div className="callout" style={{marginTop:16}}>{t('supervisorPending')} {t('notSecurity')}</div>}
      <div className="stats-strip"><div className="stat"><div className="stat-label">{t('assignedTo')}</div><div className="stat-value">{assignedProjects.length} projects</div></div><div className="stat"><div className="stat-label">{t('statusPending')}</div><div className="stat-value">{assignedProjects.filter(item=>item.status==='Pending Review').length}</div></div><div className="stat"><div className="stat-label">{t('feedback')}</div><div className="stat-value">{assignedProjects.filter(item=>item.feedback).length} updates</div></div></div>
        {!assignedProjects.length ? <div className="empty-state panel"><UserRound size={24}/><h2>{t('noAssigned')}</h2><p>{t('notSecurity')}</p></div> : <div className="project-list">{assignedProjects.map(project=><article className="panel project-card" key={project.id}><div className="project-card-top"><span className="feature-index">{project.ownerName} · {project.field}</span>{statusBadge(project.status)}</div><h2>{project.title}</h2><p dir="auto">{project.problem}</p><div className="project-card-bottom"><span className="muted">{t('currentStep')}: {project.steps.find(step=>!step.approved)?.label || t('completeWorkflow')}</span><button className="btn btn-soft" onClick={() => { setReviewSelectedId(project.id);navigateTo('/review'); }}>{t('reviewTitle')} <ArrowRight size={14}/></button></div></article>)}</div>}
    </main>;
  }

  const departmentDashboard = () => {
    const activeDepartmentId = currentUser.departmentId;
    const activeDepartmentName = currentUser.departmentName || t('departmentName');
    const departmentWorkflow = store.departmentWorkflows[activeDepartmentId] || store.workflow;
    const departmentConfig = store.departmentSettings[activeDepartmentId] || { years:store.years, specializations:store.specializations, templates:store.templates };
    const updateDepartmentConfig = (updater:(config:DemoStore['departmentSettings'][string])=>DemoStore['departmentSettings'][string]) => updateStore(old => {
      const current=old.departmentSettings[activeDepartmentId] || {years:old.years,specializations:old.specializations,templates:old.templates};
      return {...old,departmentSettings:{...old.departmentSettings,[activeDepartmentId]:updater(current)}};
    });
    const proposals = store.proposals.filter(project => project.departmentId === activeDepartmentId);
    const supervisors = store.profiles.filter(profile => profile.role==='supervisor' && profile.departmentId===activeDepartmentId);
    const pendingSupervisors = supervisors.filter(profile => profile.state==='pending' || profile.state==='pending-department-approval');
    const saveWorkflow = (workflow: DemoStore['workflow']) => updateStore(old => ({
      ...old,
      departmentWorkflows:{...old.departmentWorkflows,[activeDepartmentId]:workflow},
      proposals: old.proposals.map(project => {
        if(project.departmentId!==activeDepartmentId)return project;
        const steps=workflow.map(step=>{
          const existing=project.steps.find(item=>item.id===step.id);
          const sameReviewer=existing?.role===step.role;
          return {...step,approved:sameReviewer&&existing?.approved||false,comment:sameReviewer?existing?.comment||'':''};
        });
        const complete=steps.length>0&&steps.every(step=>step.approved);
        const status=project.status==='Draft'||project.status==='Rejected'||project.status==='Modifications Requested'
          ? project.status
          : complete?'Approved':'Pending Review';
        return {...project,steps,status};
      }),
      activity:['Department workflow updated; existing decisions were retained where steps still match.',...old.activity].slice(0,8),
    }));
    if(currentUser.state!=='demo-approved') return <main className="page-wrap fade-in">{notice()}{pageHead(`${t('departmentAdmin')} · ${activeDepartmentName}`,t('department'),t('pendingCentral'))}<div className="panel panel-pad">{t('pendingCentral')} · {t('notSecurity')}</div></main>;
    const departmentSwitcher=<select className="role-select" aria-label={t('departmentAdmin')} value={currentUser.id} onChange={event=>setDepartmentPersonaId(event.target.value)}>{store.profiles.filter(profile=>profile.role==='department').map(person=><option key={person.id} value={person.id}>{person.departmentName||person.email}</option>)}</select>;
    return <main className="page-wrap fade-in">{notice()}{pageHead(`${t('departmentAdmin')} · ${activeDepartmentName}`,t('department'),t('notSecurity'),departmentSwitcher)}
      <div className="stats-strip"><div className="stat"><div className="stat-label">{t('people')}</div><div className="stat-value">{store.profiles.filter(profile=>profile.departmentId===activeDepartmentId&&profile.role==='student').length} students</div></div><div className="stat"><div className="stat-label">{t('proposal')}</div><div className="stat-value">{proposals.length} projects</div></div><div className="stat"><div className="stat-label">{t('pendingApplications')}</div><div className="stat-value">{pendingSupervisors.length}</div></div></div>
      <div className="admin-grid">
        <section className="panel panel-pad admin-wide"><div className="section-heading-row"><div><h2 className="section-title">{t('people')}</h2><p className="section-caption">{activeDepartmentName} · sample department data only</p></div><Users size={18}/></div>
          <div className="table-wrap"><table><thead><tr><th>{t('student')}</th><th>{t('proposal')}</th><th>{t('status')}</th><th>{t('assignSupervisor')}</th></tr></thead><tbody>{proposals.map(project=><tr key={project.id}><td><strong>{project.ownerName}</strong><small>{project.field}</small></td><td>{project.title}</td><td>{statusBadge(project.status)}</td><td><div className="inline-controls"><select aria-label={`${t('chooseSupervisor')} ${project.ownerName}`} value={project.supervisorId} onChange={e=>updateStore(old=>({...old,proposals:old.proposals.map(item=>item.id===project.id?{...item,supervisorId:e.target.value}:item)}))}>{supervisors.filter(profile=>profile.state==='demo-approved').map(person=><option key={person.id} value={person.id}>{person.name}</option>)}</select></div></td></tr>)}</tbody></table></div>
        </section>
        <section className="panel panel-pad"><h2 className="section-title">{t('pendingApplications')}</h2><p className="section-caption">{t('supervisorPending')}</p>{pendingSupervisors.length===0?<div className="empty-inline"><CircleCheck size={16}/>{t('noAssigned')}</div>:pendingSupervisors.map(person=><div className="manage-row" key={person.id}><div><strong>{person.name}</strong><small>{person.specialization} · {person.title}</small></div><div className="row-actions"><button className="icon-action accept" aria-label={t('approveApplication')} onClick={()=>updateStore(old=>({...old,profiles:old.profiles.map(item=>item.id===person.id?{...item,state:'demo-approved'}:item)}))}><Check size={15}/></button><button className="icon-action reject" aria-label={t('rejectApplication')} onClick={()=>updateStore(old=>({...old,profiles:old.profiles.map(item=>item.id===person.id?{...item,state:'rejected-by-department'}:item)}))}><X size={15}/></button></div></div>)}</section>
        <section className="panel panel-pad">
          <div className="section-heading-row"><h2 className="section-title">{t('academicSettings')}</h2><Settings2 size={18}/></div>
          <div className="field"><label>{t('academicYear')}</label><div className="chips">{departmentConfig.years.map(year=><span className="chip" key={year}>{year}<button aria-label={`${t('remove')} ${year}`} onClick={()=>updateDepartmentConfig(config=>({...config,years:config.years.filter(value=>value!==year)}))}><X size={12}/></button></span>)}</div>
            <div className="inline-add"><input aria-label={t('academicYear')} value={newText} onChange={e=>setNewText(e.target.value)} placeholder={t('academicYear')}/><button className="btn btn-soft" onClick={()=>{if(newText.trim()){updateDepartmentConfig(config=>({...config,years:[...config.years,newText.trim()]}));setNewText('');}}}><Plus size={14}/>{t('add')}</button></div>
          </div>
          <div className="field" style={{marginTop:18}}><label>{t('specialization')}</label><div className="chips">{departmentConfig.specializations.map(item=><span className="chip" key={item}>{item}<button aria-label={`${t('remove')} ${item}`} onClick={()=>updateDepartmentConfig(config=>({...config,specializations:config.specializations.filter(value=>value!==item)}))}><X size={12}/></button></span>)}</div>
            <div className="inline-add"><input aria-label={t('specialization')} value={newText} onChange={e=>setNewText(e.target.value)} placeholder={t('specialization')}/><button className="btn btn-soft" onClick={()=>{if(newText.trim()){updateDepartmentConfig(config=>({...config,specializations:[...config.specializations,newText.trim()]}));setNewText('');}}}><Plus size={14}/>{t('add')}</button></div>
          </div>
        </section>
        <section className="panel panel-pad"><div className="section-heading-row"><h2 className="section-title">{t('templates')}</h2><FileText size={18}/></div>{departmentConfig.templates.map(template=><div className="manage-row" key={template}><strong>{template}</strong><button className="icon-action reject" aria-label={`${t('remove')} ${template}`} onClick={()=>updateDepartmentConfig(config=>({...config,templates:config.templates.filter(item=>item!==template)}))}><Trash2 size={14}/></button></div>)}<div className="inline-add"><input aria-label={t('templateName')} value={newText} onChange={e=>setNewText(e.target.value)} placeholder={t('templateName')}/><button className="btn btn-soft" onClick={()=>{if(newText.trim()){updateDepartmentConfig(config=>({...config,templates:[...config.templates,newText.trim()]}));setNewText('');}}}><Plus size={14}/>{t('add')}</button></div></section>
        <section className="panel panel-pad admin-wide"><div className="section-heading-row"><div><h2 className="section-title">{t('workflow')}</h2><p className="section-caption">{t('notSecurity')}</p></div><ClipboardCheck size={18}/></div>
          {departmentWorkflow.map((step,index)=><div className="workflow-row" key={step.id}><span className="workflow-order">{String(index+1).padStart(2,'0')}</span><input aria-label={t('stepName')} value={step.label} onChange={e=>saveWorkflow(departmentWorkflow.map(item=>item.id===step.id?{...item,label:e.target.value}:item))}/><select aria-label={t('responsibleRole')} value={step.role} onChange={e=>saveWorkflow(departmentWorkflow.map(item=>item.id===step.id?{...item,role:e.target.value as 'supervisor'|'department'|'central'}:item))}><option value="supervisor">{t('supervisor')}</option><option value="department">{t('departmentAdmin')}</option><option value="central">{t('centralAdmin')}</option></select><button className="icon-action" aria-label={t('moveUp')} disabled={index===0} onClick={()=>{const next=[...departmentWorkflow];[next[index-1],next[index]]=[next[index],next[index-1]];saveWorkflow(next);}}>↑</button><button className="icon-action" aria-label={t('moveDown')} disabled={index===departmentWorkflow.length-1} onClick={()=>{const next=[...departmentWorkflow];[next[index+1],next[index]]=[next[index],next[index+1]];saveWorkflow(next);}}>↓</button><button className="icon-action reject" aria-label={t('remove')} disabled={departmentWorkflow.length<=1} onClick={()=>saveWorkflow(departmentWorkflow.filter(item=>item.id!==step.id))}><Trash2 size={14}/></button></div>)}
          <button className="btn btn-soft" style={{marginTop:14}} onClick={()=>saveWorkflow([...departmentWorkflow,{id:`step-${Date.now()}`,label:'New review step',role:'department'}])}><Plus size={14}/>{t('addStep')}</button>
        </section>
      </div>
    </main>;
  };

  const centralDashboard = () => {
    const admins=store.profiles.filter(profile=>profile.role==='department');
    const authorized=store.profiles.filter(profile=>profile.role==='supervisor'&&profile.state==='demo-approved');
    const adminInstitution=store.institutions.find(institution=>institution.id===adminInstitutionId)||store.institutions[0];
    const adminDepartments=adminInstitution?.departments||[];
    const selectedAdminDepartment=adminDepartments.includes(adminDepartmentName)?adminDepartmentName:adminDepartments[0]||'';
    return <main className="page-wrap fade-in">{notice()}{pageHead(`${t('centralAdmin')} · ${t('setupAccount')}`,t('administration'),t('notSecurity'))}
      <div className="stats-strip"><div className="stat"><div className="stat-label">{t('institutions')}</div><div className="stat-value">{store.institutions.length}</div></div><div className="stat"><div className="stat-label">{t('people')}</div><div className="stat-value">{store.profiles.filter(profile=>profile.role==='student').length} students</div></div><div className="stat"><div className="stat-label">{t('participation')}</div><div className="stat-value">{store.proposals.length} sample projects</div></div></div>
      <div className="admin-grid">
        <section className="panel panel-pad admin-wide"><div className="section-heading-row"><div><h2 className="section-title">{t('institutions')}</h2><p className="section-caption">{t('manageInstitutions')}</p></div><Building2 size={18}/></div>
          {store.institutions.map(institution=><div className="institution-block" key={institution.id}><div className="institution-top"><strong>{institution.name}</strong><button className="icon-action reject" aria-label={t('remove')} onClick={()=>updateStore(old=>({...old,institutions:old.institutions.filter(item=>item.id!==institution.id)}))}><Trash2 size={14}/></button></div><div className="chips">{institution.departments.map(item=><span className="chip" key={item}>{item}<button aria-label={`${t('remove')} ${item}`} onClick={()=>updateStore(old=>({...old,institutions:old.institutions.map(record=>record.id===institution.id?{...record,departments:record.departments.filter(name=>name!==item)}:record)}))}><X size={12}/></button></span>)}</div><div className="inline-add"><input aria-label={t('newDepartment')} value={newText} onChange={e=>setNewText(e.target.value)} placeholder={t('newDepartment')}/><button className="btn btn-soft" onClick={()=>{if(newText.trim()){updateStore(old=>({...old,institutions:old.institutions.map(item=>item.id===institution.id?{...item,departments:[...item.departments,newText.trim()]}:item)}));setNewText('');}}}><Plus size={14}/>{t('add')}</button></div></div>)}
          <div className="institution-add"><input aria-label={t('institutionName')} value={newText} onChange={e=>setNewText(e.target.value)} placeholder={t('institutionName')}/><button className="btn btn-primary" onClick={()=>{if(newText.trim()){updateStore(old=>({...old,institutions:[...old.institutions,{id:`inst-${Date.now()}`,name:newText.trim(),departments:[]}]}));setNewText('');}}}><Plus size={14}/>{t('addInstitution')}</button></div>
        </section>
        <section className="panel panel-pad"><h2 className="section-title">{t('admins')}</h2>
          {admins.map(person=><div className="manage-row" key={person.id}><div><strong>{person.name}</strong><small>{person.email} · {person.institutionName||''} · {person.departmentName||''} · {person.state==='pending-central-approval'?t('pendingCentral'):t('approvedDemo')}</small></div>{person.state==='pending-central-approval'&&<button className="btn btn-soft" onClick={()=>updateStore(old=>({...old,profiles:old.profiles.map(item=>item.id===person.id?{...item,state:'demo-approved'}:item)}))}>{t('approveAdmin')}</button>}</div>)}
          <div className="create-admin-form">
            <input aria-label={t('fullName')} placeholder={t('fullName')} value={access.name} onChange={e=>setAccess({...access,name:e.target.value})}/>
            <input aria-label={t('email')} placeholder={t('email')} value={access.email} onChange={e=>setAccess({...access,email:e.target.value})}/>
            <select aria-label={t('institution')} value={adminInstitution?.id||''} onChange={e=>{setAdminInstitutionId(e.target.value);setAdminDepartmentName(store.institutions.find(item=>item.id===e.target.value)?.departments[0]||'');}}>
              {store.institutions.map(institution=><option key={institution.id} value={institution.id}>{institution.name}</option>)}
            </select>
            <select aria-label={t('departmentField')} value={selectedAdminDepartment} onChange={e=>setAdminDepartmentName(e.target.value)} disabled={!adminDepartments.length}>
              {adminDepartments.map(name=><option key={name} value={name}>{name}</option>)}
            </select>
            <button className="btn btn-primary" onClick={()=>{
              if(access.name.trim()&&access.email.trim()&&adminInstitution&&selectedAdminDepartment){
                const id=`dept-admin-${Date.now()}`;
                const newAdmin:Profile={id,name:access.name.trim(),email:access.email.trim(),role:'department',state:'pending-central-approval',institutionId:adminInstitution.id,departmentId:departmentKey(adminInstitution.id,selectedAdminDepartment),institutionName:adminInstitution.name,departmentName:selectedAdminDepartment,specialization:'Department administration',academicYear:store.years[0]||''};
                updateStore(old=>({...old,profiles:[...old.profiles,newAdmin],activity:[`${newAdmin.name} provisioned for ${selectedAdminDepartment}; pending central approval.`,...old.activity].slice(0,8)}));
                setDepartmentPersonaId(id);setAccess(old=>({...old,name:'',email:''}));
              }
            }}><Plus size={14}/>{t('createAdmin')}</button>
          </div>
        </section>
        <section className="panel panel-pad admin-wide" data-testid="panel-role-permissions">
          <div className="section-heading-row"><div><h2 className="section-title">{t('rolePermissions')}</h2><p className="section-caption">{t('permissionNotice')}</p></div><Settings2 size={18}/></div>
          <div className="permission-grid">
            {roles.map(permissionRole=>{
              const enabled=store.rolePermissions[permissionRole]||[];
              return <section className="permission-role" key={permissionRole}>
                <h3>{t(roleText[permissionRole])}</h3>
                {permissionOptions.map(permission=><label className="permission-choice" key={permission.id}>
                  <input type="checkbox" aria-label={`${t(roleText[permissionRole])}: ${t(permission.label)}`} data-testid={`checkbox-permission-${permissionRole}-${permission.id}`} checked={enabled.includes(permission.id)} disabled={permissionRole==='central'&&permission.id==='administration'} onChange={()=>updateStore(old=>({...old,rolePermissions:{...old.rolePermissions,[permissionRole]:enabled.includes(permission.id)?enabled.filter(item=>item!==permission.id):[...enabled,permission.id]}}))}/>
                  <span>{t(permission.label)}</span>
                </label>)}
              </section>;
            })}
          </div>
        </section>
        <section className="panel panel-pad"><div className="section-heading-row"><h2 className="section-title">{t('authorizedRoster')}</h2><UserRound size={18}/></div>{authorized.map(person=><div className="manage-row" key={person.id}><div><strong>{person.name}</strong><small>{person.specialization}</small></div><button className="icon-action reject" aria-label={t('remove')} onClick={()=>updateStore(old=>({...old,profiles:old.profiles.map(item=>item.id===person.id?{...item,state:'pending'}:item)}))}><X size={14}/></button></div>)}<div className="inline-add"><select aria-label={t('addSupervisor')} value={newText} onChange={e=>setNewText(e.target.value)}><option value="">{t('chooseSupervisor')}</option>{store.profiles.filter(person=>person.role==='supervisor'&&person.state!=='demo-approved').map(person=><option key={person.id} value={person.id}>{person.name}</option>)}</select><button className="btn btn-soft" onClick={()=>{if(newText){updateStore(old=>({...old,profiles:old.profiles.map(item=>item.id===newText?{...item,state:'demo-approved'}:item)}));setNewText('');}}}><Plus size={14}/>{t('addSupervisor')}</button></div></section>
        <section className="panel panel-pad"><div className="section-heading-row"><div><h2 className="section-title">{t('academicSettings')}</h2><p className="section-caption">{t('year')} · {t('specialization')} · workflow options</p></div><Settings2 size={18}/></div>
          <div className="meta-label">{t('academicYear')}</div><div className="chips">{store.years.map(year=><span className="chip" key={year}>{year}<button aria-label={`${t('remove')} ${year}`} onClick={()=>updateStore(old=>({...old,years:old.years.filter(item=>item!==year)}))}><X size={12}/></button></span>)}</div>
          <div className="inline-add"><input aria-label={t('academicYear')} placeholder={t('academicYear')} value={newText} onChange={e=>setNewText(e.target.value)}/><button className="btn btn-soft" onClick={()=>{if(newText.trim()){updateStore(old=>({...old,years:[...old.years,newText.trim()]}));setNewText('');}}}><Plus size={14}/>{t('add')}</button></div>
          <div className="meta-label" style={{marginTop:17}}>{t('specialization')}</div><div className="chips">{store.specializations.map(item=><span className="chip" key={item}>{item}<button aria-label={`${t('remove')} ${item}`} onClick={()=>updateStore(old=>({...old,specializations:old.specializations.filter(value=>value!==item)}))}><X size={12}/></button></span>)}</div>
          <div className="inline-add"><input aria-label={t('specialization')} placeholder={t('specialization')} value={newText} onChange={e=>setNewText(e.target.value)}/><button className="btn btn-soft" onClick={()=>{if(newText.trim()){updateStore(old=>({...old,specializations:[...old.specializations,newText.trim()]}));setNewText('');}}}><Plus size={14}/>{t('add')}</button></div>
          <div className="meta-label" style={{marginTop:18}}>{t('workflow')}</div>{store.workflow.map(step=><div className="manage-row" key={step.id}><div><strong>{step.label}</strong><small>{t(roleText[step.role])}</small></div><button className="icon-action reject" aria-label={`${t('remove')} ${step.label}`} onClick={()=>updateStore(old=>({...old,workflow:old.workflow.filter(item=>item.id!==step.id)}))}><Trash2 size={14}/></button></div>)}
          <button className="btn btn-soft" style={{marginTop:12}} onClick={()=>updateStore(old=>({...old,workflow:[...old.workflow,{id:`option-${Date.now()}`,label:'New central review option',role:'central'}]}))}><Plus size={14}/>{t('addStep')}</button>
        </section>
        <section className="panel panel-pad"><div className="section-heading-row"><h2 className="section-title">{t('oversight')}</h2><CircleAlert size={18}/></div><div className="stat-row" style={{gridTemplateColumns:'1fr 1fr'}}><div className="stat"><div className="stat-label">{t('participation')}</div><div className="stat-value">{store.profiles.filter(profile=>profile.role==='student').length} student profiles</div></div><div className="stat"><div className="stat-label">{t('statusPending')}</div><div className="stat-value">{store.proposals.filter(item=>item.status==='Pending Review').length} projects</div></div></div><h3 className="section-title" style={{marginTop:18}}>{t('activity')}</h3>{store.activity.slice(0,4).map((item,index)=><div className="activity-item" key={`${item}-${index}`}><span className="notification-mark"/><span dir="auto">{item}</span></div>)}</section>
      </div>
    </main>;
  };

  const proposalPage = () => {
    const proposalSupervisor = store.profiles.find(profile => profile.id === studentProposal.supervisorId);
    const field = (key: 'problem'|'objectives'|'methodology'|'outline', label: string, tall=false) => <div className="field full"><label htmlFor={`field-${key}`}>{label}</label><textarea id={`field-${key}`} className={tall?'tall':''} dir="auto" lang={researchLangCode(form.researchLanguage)} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} data-testid={`input-${key}`}/></div>;
    const save = (submit: boolean) => {
      if(submit&&(!form.title.trim()||!form.problem.trim())){setToast(t('required'));return;}
      const updated: Proposal = {
        ...form,
        id: studentProposal.id,
        ownerId: studentProfile.id,
        ownerName: studentProfile.name,
        departmentId: studentProfile.departmentId,
        status: submit?'Pending Review':form.status==='Approved'||form.status==='Rejected'?'Draft':form.status,
        feedback: submit?'':form.feedback,
        steps: submit?form.steps.map(step=>({...step,approved:false,comment:''})):form.steps,
      };
      setForm(updated);
      updateStore(old=>({
        ...old,
        proposals: old.proposals.some(item=>item.ownerId===studentProfile.id)
          ? old.proposals.map(item=>item.ownerId===studentProfile.id?{...updated,id:item.id}:item)
          : [...old.proposals,updated],
        activity:[submit?t('submitted'):t('saved'),...old.activity].slice(0,8),
      }));
      setToast(submit?t('submitted'):t('saved'));navigateTo('/dashboard');
    };
    return <main className="page-wrap fade-in">{notice()}{pageHead(`01 / ${t('student')}`,t('proposal'),t('proposalPageDesc'),statusBadge(studentProposal.status))}
      <div className="grid-main"><section className="panel panel-pad"><div className="form-grid">
        <div className="field full"><label htmlFor="field-title">{t('title')}</label><input id="field-title" dir="auto" lang={researchLangCode(form.researchLanguage)} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} data-testid="input-title"/></div>
        <div className="field"><label htmlFor="field-field">{t('field')}</label><input id="field-field" value={form.field} onChange={e=>setForm({...form,field:e.target.value})} data-testid="input-field"/></div>
        <div className="field"><label htmlFor="field-language">{t('language')}</label><select id="field-language" value={form.researchLanguage} onChange={e=>setForm({...form,researchLanguage:e.target.value})} data-testid="select-research-language"><option>English</option><option>French</option><option>Arabic</option><option>Other</option></select></div>
        {field('problem',t('problem'),true)}{field('objectives',t('objectives'))}{field('methodology',t('methodology'))}{field('outline',t('outline'))}
      </div><div className="form-actions"><span className="muted form-footnote">{t('local')}</span><div className="button-row"><button className="btn btn-outline" onClick={()=>save(false)} data-testid="button-save-proposal">{t('saveDraft')}</button><button className="btn btn-teal" onClick={()=>save(true)} data-testid="button-submit-proposal">{t('submit')} <ArrowRight size={14}/></button></div></div></section>
      <aside className="stack"><section className="panel panel-pad"><div className="panel-topline"><h2 className="section-title">{t('status')}</h2>{statusBadge(studentProposal.status)}</div><div className="divider"/><p className="section-caption">{studentProposal.feedback||t('awaiting')}</p></section><section className="panel panel-pad"><h2 className="section-title">{t('supervisor')}</h2><div className="profile-line" style={{marginTop:16}}><div className="avatar avatar-muted">{proposalSupervisor?initials(proposalSupervisor.name):<UserRound size={15}/>}</div><div><strong>{proposalSupervisor?.name||t('noSupervisor')}</strong><div className="muted" style={{fontSize:11,marginTop:4}}>{proposalSupervisor?.title||t('supervisor')} · {proposalSupervisor?.specialization||''}</div></div></div></section><div className="callout">{t('honest')}</div></aside></div>
    </main>;
  };

  const reviewPage = () => {
    const projects = role==='supervisor' ? assignedProjects : role==='department' ? sampleProjects : role==='central' ? store.proposals : [];
    const project=projects.find(item=>item.id===reviewSelectedId)||projects[0];
    const notes=project ? store.reviewerNotes[project.id] || '' : '';
    const activeStep=project?.steps.find(step=>!step.approved);
    const reviewerAuthorized = !!project && !!activeStep && currentUser.state==='demo-approved' && (role===activeStep.role || (role==='supervisor'&&activeStep.role==='supervisor'&&project.supervisorId===currentUser.id));
    const decide=(decision:'Approved'|'Modifications Requested'|'Rejected')=>{
      if(!project||!reviewerAuthorized)return;
      if(decision==='Rejected'&&!window.confirm(t('rejectConfirm')))return;
      const feedback=notes.trim()||t('actionSaved');
      updateStore(old=>({...old,proposals:old.proposals.map(item=>{
        if(item.id!==project.id)return item;
        const steps=item.steps.map(step=>step.id===activeStep!.id?{...step,approved:decision==='Approved',comment:feedback}:step);
        const done=steps.length>0&&steps.every(step=>step.approved);
        return {...item,steps,status:decision==='Rejected'?'Rejected':decision==='Modifications Requested'?'Modifications Requested':done?'Approved':'Pending Review',feedback};
      }),reviewerNotes:{...old.reviewerNotes,[project.id]:notes},activity:[`${project.title}: ${decision==='Approved'?'approval step completed':decision==='Rejected'?'rejected':'modifications requested'}.`,...old.activity].slice(0,8)}));
      setToast(t('actionSaved'));
    };
    return <main className="page-wrap fade-in">{notice()}{pageHead(`02 / ${t(roleText[role])}`,t('reviewTitle'),t('reviewDesc'))}
      {!['supervisor','department','central'].includes(role)?<div className="empty-state panel"><LockKeyhole size={24}/><h2>{t('rolePreview')}</h2><button className="btn btn-primary" onClick={()=>setRole('supervisor')}>{t('supervisor')}</button></div>:
      <div className="grid-main"><div className="stack"><section className="panel panel-pad"><div className="section-heading-row"><div><div className="meta-label">{t('queue')}</div><h2 className="section-title" style={{marginTop:8}}>{project?project.ownerName:t('noAssigned')}</h2></div>{project&&statusBadge(project.status)}</div>
        {!project?<div className="empty-inline"><ClipboardCheck size={18}/>{t('noAssigned')}</div>:<><div className="divider"/><div className="review-project-select"><label className="field"><span>{t('queue')}</span><select value={project.id} onChange={e=>setReviewSelectedId(e.target.value)}>{projects.map(item=><option value={item.id} key={item.id}>{item.ownerName} — {item.title}</option>)}</select></label></div><h3 className="review-project-title">{project.title}</h3><div className="meta-label">{t('currentStep')}</div><p className="meta-value">{activeStep?.label||t('completeWorkflow')} {activeStep&&<span className="muted"> · {t(roleText[activeStep.role])}</span>}</p>
        {[['problem',t('problem')],['objectives',t('objectives')],['methodology',t('methodology')],['outline',t('outline')]].map(([key,label])=><div key={key} className="review-section"><div className="meta-label">{label}</div><p dir="auto" lang={researchLangCode(project.researchLanguage)}>{project[key as keyof Proposal] as string}</p></div>)}
        <div className="steps compact-steps">{project.steps.map((step,index)=><div className={`step ${step.approved?'done':index===project.steps.findIndex(item=>!item.approved)?'':'pending'}`} key={step.id}><span className="step-icon">{step.approved?<Check size={12}/>:index+1}</span><div><strong>{step.label}</strong><small>{step.approved?t('completed'):`${t('assignedTo')}: ${t(roleText[step.role])}`}</small>{step.comment&&<small dir="auto">{step.comment}</small>}</div></div>)}</div></>}</section></div>
      {project&&<aside className="stack"><section className="panel panel-pad"><h2 className="section-title">{t('reviewerNotes')}</h2><p className="section-caption">{t('local')}</p><div className="field" style={{marginTop:16}}><textarea className="tall" dir="auto" value={notes} onChange={e=>updateStore(old=>({...old,reviewerNotes:{...old.reviewerNotes,[project.id]:e.target.value}}))} placeholder={t('notesHint')} data-testid="input-review-notes"/></div>
        {!reviewerAuthorized?<div className="callout" style={{marginTop:15}}>{activeStep?`${t('currentStep')}: ${t(roleText[activeStep.role])}. ${t('notSecurity')}`:t('completeWorkflow')}</div>:<div className="review-actions"><button className="btn btn-teal" onClick={()=>decide('Approved')} data-testid="button-approve"><Check size={14}/>{t('approve')}</button><button className="btn btn-soft" onClick={()=>decide('Modifications Requested')} data-testid="button-request-changes">{t('requestChanges')}</button><button className="btn btn-danger" onClick={()=>decide('Rejected')} data-testid="button-reject">{t('reject')}</button></div>}
      </section><section className="panel panel-pad"><h2 className="section-title">{t('feedback')}</h2><p className="section-caption" dir="auto" style={{marginTop:9}}>{project.feedback||t('noFeedback')}</p></section></aside>}</div>}
    </main>;
  };

  const editorPage = () => {
    const unlocked=workflowComplete(studentProposal)&&studentProposal.status==='Approved';
    const saveWritingDraft=(content:string)=>{updateStore(old=>({...old,draft:content,drafts:{...old.drafts,[studentProfile.id]:content}}));setDraft(content);setToast(t('draftSaved'));};
    const updateWritingDraft=(content:string)=>{setDraft(content);updateStore(old=>({...old,draft:content,drafts:{...old.drafts,[studentProfile.id]:content}}));};
    return <main className="page-wrap fade-in">{notice()}{pageHead(`03 / ${t('stepWriting')}`,t('editorTitle'),t('editorDesc'))}
      {!unlocked?<div className="panel panel-pad locked-panel"><div className="locked"><LockKeyhole size={17}/><div><strong>{t('lockedTitle')}.</strong> {t('lockedDesc')}</div></div><div className="locked-content"><div className="avatar locked-avatar"><BookOpen size={22}/></div><h2>{t('editorTitle')}</h2><p>{t('lockedDesc')}</p><div className="callout">{t('currentStep')}: {studentProposal.steps.find(step=>!step.approved)?.label||t('completeWorkflow')}</div><button className="btn btn-primary" onClick={()=>navigateTo('/dashboard')} style={{marginTop:18}}>{t('back')} <ArrowRight size={14}/></button></div></div>:<><ThesisEditor draft={draft} onDraftChange={updateWritingDraft} title={studentProposal.title} researchLanguage={studentProposal.researchLanguage} studentId={studentProfile.id} onSave={saveWritingDraft}/><div className="thesis-status-row"><section className="panel panel-pad"><div className="meta-label">{t('currentStatus')}</div><div style={{marginTop:9}}>{statusBadge(studentProposal.status)}</div><p className="section-caption" style={{marginTop:12}}>{t('finalApproval')}</p></section></div></>}
    </main>;
  };

  const fallback = () => <main className="page-wrap"><div className="panel panel-pad"><h1 className="page-title">{t('notFound')}</h1><Link href="/">{t('back')}</Link></div></main>;
  const restrictedPage = () => <main className="page-wrap fade-in">{notice()}{pageHead(t('demo'),t('notAuthorized'),t('notSecurity'))}<section className="panel panel-pad access-restricted"><p>{t('notAuthorized')}</p><button className="btn btn-primary" onClick={() => navigateTo(role==='department'?'/department':role==='central'?'/administration':'/dashboard')}>{t('openDashboard')} <ArrowRight size={14}/></button></section></main>;
  const dashboardAvailable = role==='student'||role==='supervisor'||(role==='department'&&hasPermission('department'))||(role==='central'&&hasPermission('administration'));
  return <div className="app-shell">
    <Switch>
      <Route path="/">{landing()}</Route>
      <Route path="/dashboard">{header()}{dashboardAvailable?dashboard():restrictedPage()}</Route>
      <Route path="/proposal">{header()}{role==='student'&&hasPermission('proposal')?proposalPage():restrictedPage()}</Route>
      <Route path="/review">{header()}{hasPermission('review')?reviewPage():restrictedPage()}</Route>
      <Route path="/editor">{header()}{role==='student'&&hasPermission('editor')?editorPage():restrictedPage()}</Route>
      <Route path="/department">{header()}{role==='department'&&hasPermission('department')?departmentDashboard():restrictedPage()}</Route>
      <Route path="/administration">{header()}{role==='central'&&hasPermission('administration')?centralDashboard():restrictedPage()}</Route>
      <Route>{fallback()}</Route>
    </Switch>
    {toast&&<div className="toast-message" role="status">{toast}</div>}
  </div>;
}

export default App;
