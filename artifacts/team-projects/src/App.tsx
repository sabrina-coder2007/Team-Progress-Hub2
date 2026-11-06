import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { ArrowRight, BookOpen, Check, ChevronRight, ClipboardCheck, FilePenLine, FileText, Languages, LockKeyhole, Save, UserRound, Bell, AlignLeft, Heading1, Heading2 } from 'lucide-react';

type Language = 'en' | 'fr' | 'ar';
type Role = 'student' | 'reviewer';
type Status = 'Draft' | 'Pending Review' | 'Modifications Requested' | 'Approved' | 'Rejected';
type Proposal = { title:string; field:string; problem:string; objectives:string; methodology:string; outline:string; researchLanguage:string; status:Status; feedback:string };
type DemoData = { proposal:Proposal; draft:string; notes:string; notifications:string[] };

const starter: DemoData = {
  proposal: {
    title:'Digital learning practices in Algerian public universities',
    field:'Educational technology',
    problem:'How do access to digital learning resources and students’ study habits shape engagement in blended courses at public universities in Algeria?',
    objectives:'Map student access to digital learning tools; identify study practices linked to engagement; develop practical recommendations for more inclusive blended learning.',
    methodology:'A mixed-methods study combining a student survey with semi-structured interviews. The sample will include undergraduate students from two public universities.',
    outline:'1. Introduction and context\n2. Literature review\n3. Research design\n4. Findings and discussion\n5. Recommendations',
    researchLanguage:'English', status:'Pending Review', feedback:''
  },
  draft:'',
  notes:'',
  notifications:['Your proposal is ready for a demo committee review.']
};

const copy: Record<Language, Record<string,string>> = {
  en: {
    home:'Overview', dashboard:'Workspace', proposal:'Research proposal', review:'Committee review', editor:'Writing desk',
    signIn:'Enter demo', register:'Create demo profile', signInTitle:'Continue with a demo profile', registerTitle:'Create a student demo profile',
    fullName:'Full name', emailAddress:'Email address', continueDemo:'Continue to demo', cancel:'Cancel',
    accessNote:'This prototype does not create or verify accounts. Any email is accepted for the demo.',
    accessRequired:'Add the required demo details to continue.', accessComplete:'Demo profile opened.',
    defaultNotification:'Your proposal is ready for a demo committee review.', justNow:'Just now', daysAgo:'days ago', localDemoTag:'local demo',
    researchProposalLabel:'Research proposal', universityResearchLabel:'University research · Algeria', location:'Oran, Algeria',
    demo:'Demonstration environment', local:'Your information stays in this browser as local demo data. It is not secure storage.',
    heroEyebrow:'A clearer path from question to research', heroTitle:'Good research starts with a <em>clearer process.</em>',
    heroText:'Leeder brings your proposal, supervisor feedback and writing milestones into one thoughtful academic workspace — designed for the realities of university life in Algeria.',
    explore:'Explore the demo', how:'How it works', heroMini:'A focused space for your next research milestone.',
    featureEyebrow:'A small system for a meaningful journey', featureTitle:'From first idea to first page.',
    feature1:'Shape your question', feature1d:'Build a structured proposal with the context, objectives and methods visible in one place.',
    feature2:'Review with context', feature2d:'Explore a simulated committee workflow and see feedback reflected in your student workspace.',
    feature3:'Write when ready', feature3d:'The writing desk opens only after an approved status in this demo.',
    welcome:'Good morning,', studentName:'Amel Bensalem', workspace:'Your research, in good order.', workspaceDesc:'A clear view of your proposal journey and what comes next.',
    editProposal:'Edit proposal', currentStatus:'Proposal status', progress:'Journey progress', profile:'Student profile', academic:'Academic details',
    university:'University', universityName:'University of Oran 1 Ahmed Ben Bella', department:'Department', departmentName:'Faculty of Social Sciences',
    degree:'Degree', degreeName:'Master 2 · Educational Sciences', year:'Year', academicField:'Educational Sciences', supervisor:'Supervisor', supervisorRole:'Thesis supervisor',
    notifications:'Recent updates', noNotifications:'No updates yet. New review activity will appear here.', nextStep:'Next milestone',
    proposalPageTitle:'Research proposal', proposalPageDesc:'Bring your research question into focus. Your changes are saved on this device.',
    title:'Working title', field:'Research field', problem:'Problem statement', objectives:'Research objectives', methodology:'Methodology',
    languageOther:'Other',
    outline:'Proposed outline', language:'Research language', saveDraft:'Save as draft', submit:'Submit for review', saved:'Saved locally on this device.',
    required:'Please add a working title and problem statement before submitting.', submitted:'Proposal submitted to the demo review queue.',
    reviewTitle:'Committee review', reviewDesc:'A simulated review desk for exploring feedback and status changes.',
    reviewerLabel:'Reviewing as', queue:'Proposal queue', reviewProposal:'Proposal under review', reviewerNotes:'Committee notes', notesHint:'Add a note for the student…',
    approve:'Approve proposal', requestChanges:'Request modifications', reject:'Reject proposal', actionSaved:'Review decision saved to local demo data.',
    editorTitle:'Writing desk', editorDesc:'A quiet space for developing your approved research.',
    lockedTitle:'Writing desk locked', lockedDesc:'This preview opens when the proposal status is Approved. Explore the committee demo to change the status.',
    unlock:'Open committee review', save:'Save draft', draftSaved:'Writing draft saved locally.', languageDirection:'Writing direction follows the research language.',
    notes:'Academic notes', noteOne:'Keep one claim per paragraph.', noteTwo:'Connect each section to a research objective.', noteThree:'Record sources as you read.',
    placeholder:'Begin with a short introduction to your topic…', markTitle:'Title', markHeading:'Heading', markParagraph:'Paragraph',
    roleStudent:'Student view', roleReviewer:'Reviewer view', roleHint:'Choose a demo role', status:'Status', feedback:'Committee feedback',
    noFeedback:'No committee feedback yet.', noProposal:'No proposal has been submitted for review.',
    statusDraft:'Draft', statusPendingReview:'Pending review', statusModifications:'Modifications requested', statusApproved:'Approved', statusRejected:'Rejected',
    approvedFeedback:'The proposal is approved in this demo.', rejectedFeedback:'The proposal was rejected in this demo.',
    requestFeedback:'Please clarify the scope and strengthen the link between objectives and methodology.',
    notFound:'Page not found',
    stepProfile:'Academic profile', stepProposal:'Proposal submitted', stepReview:'Committee review', stepWriting:'Writing desk',
    completed:'Complete', underway:'In progress', awaiting:'Awaiting review', available:'Available', draftNotice:'Draft only',
    honest:'Leeder is an academic project demo. No university authentication, real committee approval, secure document storage or plagiarism detection is provided.',
    footer:'A student research workflow prototype', reviewerOnly:'Demo reviewer controls', rejectConfirm:'Mark this proposal as rejected?',
    back:'Back to workspace', profileInitial:'AB', sample:'Sample student profile'
  },
  fr: {
    home:'Aperçu', dashboard:'Espace étudiant', proposal:'Projet de recherche', review:'Évaluation', editor:'Espace de rédaction',
    signIn:'Entrer dans la démo', register:'Créer un profil démo', signInTitle:'Continuer avec un profil démo', registerTitle:'Créer un profil étudiant démo',
    fullName:'Nom complet', emailAddress:'Adresse e-mail', continueDemo:'Continuer dans la démo', cancel:'Annuler',
    accessNote:'Ce prototype ne crée ni ne vérifie de comptes. Toute adresse e-mail est acceptée pour la démo.',
    accessRequired:'Renseignez les champs requis pour continuer.', accessComplete:'Profil démo ouvert.',
    defaultNotification:'Votre projet est prêt pour une évaluation de démonstration.', justNow:'À l’instant', daysAgo:'jours', localDemoTag:'démo locale',
    researchProposalLabel:'Projet de recherche', universityResearchLabel:'Recherche universitaire · Algérie', location:'Oran, Algérie',
    demo:'Environnement de démonstration', local:'Vos informations restent dans ce navigateur, comme données de démonstration locales. Ce stockage n’est pas sécurisé.',
    heroEyebrow:'Un chemin plus clair vers la recherche', heroTitle:'Une bonne recherche commence par un <em>parcours clair.</em>',
    heroText:'Leeder réunit votre proposition, les retours de votre encadrant et vos étapes de rédaction dans un espace académique pensé pour les réalités universitaires en Algérie.',
    explore:'Explorer la démo', how:'Le parcours', heroMini:'Un espace serein pour votre prochaine étape de recherche.',
    featureEyebrow:'Un outil simple pour un parcours essentiel', featureTitle:'De la première idée à la première page.',
    feature1:'Préciser votre question', feature1d:'Structurez votre projet avec son contexte, ses objectifs et sa méthode.',
    feature2:'Évaluer avec contexte', feature2d:'Explorez un comité simulé et consultez les retours dans votre espace étudiant.',
    feature3:'Rédiger au bon moment', feature3d:'Dans cette démo, l’espace de rédaction s’ouvre après approbation.',
    welcome:'Bonjour,', studentName:'Amel Bensalem', workspace:'Votre recherche, bien organisée.', workspaceDesc:'Suivez votre projet et identifiez la prochaine étape.',
    editProposal:'Modifier le projet', currentStatus:'État du projet', progress:'Avancement', profile:'Profil étudiant', academic:'Parcours universitaire',
    university:'Université', universityName:'Université d’Oran 1 Ahmed Ben Bella', department:'Département', departmentName:'Faculté des sciences sociales',
    degree:'Diplôme', degreeName:'Master 2 · Sciences de l’éducation', year:'Année', academicField:'Sciences de l’éducation', supervisor:'Encadrant', supervisorRole:'Directeur de mémoire',
    notifications:'Dernières nouvelles', noNotifications:'Aucune nouvelle. Les activités de la commission apparaîtront ici.', nextStep:'Prochaine étape',
    proposalPageTitle:'Projet de recherche', proposalPageDesc:'Précisez votre question de recherche. Vos modifications sont enregistrées sur cet appareil.',
    title:'Titre provisoire', field:'Domaine', problem:'Problématique', objectives:'Objectifs de recherche', methodology:'Méthodologie',
    languageOther:'Autre',
    outline:'Plan provisoire', language:'Langue de recherche', saveDraft:'Enregistrer le brouillon', submit:'Soumettre à évaluation', saved:'Enregistré localement sur cet appareil.',
    required:'Veuillez saisir un titre provisoire et une problématique.', submitted:'Projet transmis à la file de révision de démonstration.',
    reviewTitle:'Évaluation par la commission', reviewDesc:'Un espace de révision simulé pour explorer les retours et les états.',
    reviewerLabel:'Évaluation en tant que', queue:'File des projets', reviewProposal:'Projet à évaluer', reviewerNotes:'Notes de la commission', notesHint:'Ajouter une note à l’étudiant…',
    approve:'Approuver le projet', requestChanges:'Demander des modifications', reject:'Refuser le projet', actionSaved:'Décision enregistrée dans les données locales de démonstration.',
    editorTitle:'Espace de rédaction', editorDesc:'Un espace calme pour développer votre recherche approuvée.',
    lockedTitle:'Espace de rédaction verrouillé', lockedDesc:'Cet aperçu s’ouvre lorsque le projet est approuvé. Essayez la commission de démonstration.',
    unlock:'Ouvrir l’évaluation', save:'Enregistrer le brouillon', draftSaved:'Brouillon enregistré localement.', languageDirection:'Le sens d’écriture suit la langue de recherche.',
    notes:'Notes académiques', noteOne:'Une idée principale par paragraphe.', noteTwo:'Reliez chaque partie à un objectif de recherche.', noteThree:'Notez vos sources au fil de la lecture.',
    placeholder:'Commencez par une brève introduction à votre sujet…', markTitle:'Titre', markHeading:'Intertitre', markParagraph:'Paragraphe',
    roleStudent:'Vue étudiant', roleReviewer:'Vue évaluateur', roleHint:'Choisir un rôle démo', status:'État', feedback:'Retour de la commission',
    noFeedback:'Aucun retour de la commission.', noProposal:'Aucun projet soumis à évaluation.',
    statusDraft:'Brouillon', statusPendingReview:'En attente d’évaluation', statusModifications:'Modifications demandées', statusApproved:'Approuvé', statusRejected:'Refusé',
    approvedFeedback:'Le projet est approuvé dans cette démo.', rejectedFeedback:'Le projet est refusé dans cette démo.',
    requestFeedback:'Veuillez préciser le périmètre et renforcer le lien entre les objectifs et la méthodologie.',
    notFound:'Page introuvable',
    stepProfile:'Profil universitaire', stepProposal:'Projet soumis', stepReview:'Évaluation', stepWriting:'Espace de rédaction',
    completed:'Terminé', underway:'En cours', awaiting:'En attente', available:'Disponible', draftNotice:'Brouillon',
    honest:'Leeder est une démonstration de projet académique. Aucun accès universitaire, aucune approbation réelle, aucun stockage sécurisé ni détection de plagiat.',
    footer:'Prototype de parcours de recherche étudiant', reviewerOnly:'Commandes évaluateur démo', rejectConfirm:'Refuser ce projet ?',
    back:'Retour à l’espace', profileInitial:'AB', sample:'Profil étudiant exemple'
  },
  ar: {
    home:'الرئيسية', dashboard:'مساحة الطالب', proposal:'مقترح البحث', review:'مراجعة اللجنة', editor:'مساحة الكتابة',
    signIn:'دخول تجريبي', register:'إنشاء ملف تجريبي', signInTitle:'المتابعة بملف تجريبي', registerTitle:'إنشاء ملف طالب تجريبي',
    fullName:'الاسم الكامل', emailAddress:'البريد الإلكتروني', continueDemo:'المتابعة إلى التجربة', cancel:'إلغاء',
    accessNote:'هذا النموذج لا ينشئ الحسابات ولا يتحقق منها. يُقبل أي بريد إلكتروني لأغراض التجربة.',
    accessRequired:'يرجى إدخال المعلومات المطلوبة للمتابعة.', accessComplete:'تم فتح الملف التجريبي.',
    defaultNotification:'المقترح جاهز لمراجعة اللجنة التجريبية.', justNow:'الآن', daysAgo:'أيام مضت', localDemoTag:'نسخة تجريبية محلية',
    researchProposalLabel:'مقترح بحث', universityResearchLabel:'بحث جامعي · الجزائر', location:'وهران، الجزائر',
    demo:'بيئة تجريبية', local:'تبقى معلوماتك في هذا المتصفح كبيانات تجريبية محلية. هذا التخزين غير آمن.',
    heroEyebrow:'مسار أوضح نحو البحث العلمي', heroTitle:'يبدأ البحث الجيد <em>بمسار أوضح.</em>',
    heroText:'يجمع ليدر مقترحك وملاحظات المشرف ومراحل الكتابة في مساحة أكاديمية تراعي واقع الجامعة في الجزائر.',
    explore:'استكشف النسخة التجريبية', how:'كيف يعمل', heroMini:'مساحة مركزة لخطوتك البحثية القادمة.',
    featureEyebrow:'مساحة بسيطة لرحلة مهمة', featureTitle:'من الفكرة الأولى إلى الصفحة الأولى.',
    feature1:'حدد سؤالك', feature1d:'نظم مقترحك وسياقه وأهدافه ومنهجيته في مكان واحد.',
    feature2:'مراجعة بسياق واضح', feature2d:'استكشف سير عمل لجنة تجريبية وشاهد الملاحظات في مساحة الطالب.',
    feature3:'اكتب عندما تكون جاهزاً', feature3d:'تُفتح مساحة الكتابة بعد اعتماد الحالة في هذه التجربة.',
    welcome:'صباح الخير،', studentName:'أمل بن سالم', workspace:'بحثك، بخطوات واضحة.', workspaceDesc:'تابع تقدم المقترح والخطوة التالية.',
    editProposal:'تعديل المقترح', currentStatus:'حالة المقترح', progress:'التقدم', profile:'ملف الطالب', academic:'المعلومات الأكاديمية',
    university:'الجامعة', universityName:'جامعة وهران 1 أحمد بن بلة', department:'القسم', departmentName:'كلية العلوم الاجتماعية',
    degree:'الدرجة', degreeName:'ماستر 2 · علوم التربية', year:'السنة', academicField:'علوم التربية', supervisor:'المشرف', supervisorRole:'مشرف المذكرة',
    notifications:'آخر التحديثات', noNotifications:'لا توجد تحديثات حالياً. ستظهر هنا أنشطة المراجعة الجديدة.', nextStep:'المرحلة التالية',
    proposalPageTitle:'مقترح البحث', proposalPageDesc:'صغ سؤال البحث بوضوح. تحفظ التعديلات على هذا الجهاز.',
    title:'عنوان مبدئي', field:'المجال البحثي', problem:'إشكالية البحث', objectives:'أهداف البحث', methodology:'المنهجية',
    languageOther:'أخرى',
    outline:'الخطة المقترحة', language:'لغة البحث', saveDraft:'حفظ كمسودة', submit:'إرسال للمراجعة', saved:'تم الحفظ محلياً على هذا الجهاز.',
    required:'يرجى إدخال العنوان والإشكالية قبل الإرسال.', submitted:'تم إرسال المقترح إلى قائمة المراجعة التجريبية.',
    reviewTitle:'مراجعة اللجنة', reviewDesc:'مساحة مراجعة تجريبية لاستكشاف الملاحظات وتغيير الحالة.',
    reviewerLabel:'المراجعة بصفة', queue:'قائمة المقترحات', reviewProposal:'المقترح قيد المراجعة', reviewerNotes:'ملاحظات اللجنة', notesHint:'أضف ملاحظة للطالب…',
    approve:'اعتماد المقترح', requestChanges:'طلب تعديلات', reject:'رفض المقترح', actionSaved:'تم حفظ قرار المراجعة في البيانات التجريبية المحلية.',
    editorTitle:'مساحة الكتابة', editorDesc:'مساحة هادئة لتطوير بحثك المعتمد.',
    lockedTitle:'مساحة الكتابة مقفلة', lockedDesc:'تُفتح هذه المعاينة عند اعتماد المقترح. استكشف اللجنة التجريبية لتغيير الحالة.',
    unlock:'فتح مراجعة اللجنة', save:'حفظ المسودة', draftSaved:'تم حفظ المسودة محلياً.', languageDirection:'اتجاه الكتابة يتبع لغة البحث.',
    notes:'ملاحظات أكاديمية', noteOne:'اجعل لكل فقرة فكرة رئيسية واحدة.', noteTwo:'اربط كل قسم بهدف بحثي.', noteThree:'دوّن المصادر أثناء القراءة.',
    placeholder:'ابدأ بمقدمة قصيرة عن موضوعك…', markTitle:'عنوان', markHeading:'عنوان فرعي', markParagraph:'فقرة',
    roleStudent:'عرض الطالب', roleReviewer:'عرض المراجع', roleHint:'اختر الدور التجريبي', status:'الحالة', feedback:'ملاحظات اللجنة',
    noFeedback:'لا توجد ملاحظات من اللجنة بعد.', noProposal:'لم يتم إرسال مقترح للمراجعة.',
    statusDraft:'مسودة', statusPendingReview:'بانتظار المراجعة', statusModifications:'مطلوب تعديلات', statusApproved:'معتمد', statusRejected:'مرفوض',
    approvedFeedback:'تم اعتماد المقترح في هذه التجربة.', rejectedFeedback:'تم رفض المقترح في هذه التجربة.',
    requestFeedback:'يرجى توضيح نطاق البحث وتعزيز الصلة بين الأهداف والمنهجية.',
    notFound:'الصفحة غير موجودة',
    stepProfile:'الملف الأكاديمي', stepProposal:'إرسال المقترح', stepReview:'مراجعة اللجنة', stepWriting:'مساحة الكتابة',
    completed:'مكتمل', underway:'قيد التنفيذ', awaiting:'بانتظار المراجعة', available:'متاح', draftNotice:'مسودة',
    honest:'ليدر نموذج لمشروع أكاديمي. لا يوفر دخولاً جامعياً أو اعتماداً حقيقياً أو تخزيناً آمناً أو كشفاً للانتحال.',
    footer:'نموذج لمسار بحث الطالب', reviewerOnly:'أدوات المراجع التجريبية', rejectConfirm:'رفض هذا المقترح؟',
    back:'العودة للمساحة', profileInitial:'أب', sample:'ملف طالب تجريبي'
  }
};

const storageKey = 'leeder-demo-v1';
function loadDemo(): DemoData {
  try {
    const value = localStorage.getItem(storageKey);
    if (!value) return { ...starter, proposal: { ...starter.proposal }, notifications: ['proposal-ready'] };
    const parsed = JSON.parse(value) as Partial<DemoData>;
    return { ...starter, ...parsed, proposal: { ...starter.proposal, ...(parsed.proposal || {}) }, notifications: parsed.notifications || [] };
  } catch { return { ...starter, proposal: { ...starter.proposal }, notifications: ['proposal-ready'] }; }
}

function StatusBadge({ status, label }: {status:Status; label:string}) {
  return <span className={`status status-${status.replaceAll(' ','-')}`} data-testid="status-proposal">{label}</span>;
}

function App() {
  const [data, setData] = useState<DemoData>(loadDemo);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('leeder-language') as Language) || 'en');
  const [role, setRole] = useState<Role>(() => (localStorage.getItem('leeder-role') as Role) || 'student');
  const [accessMode, setAccessMode] = useState<'login'|'register'|null>(null);
  const [accessName, setAccessName] = useState('');
  const [accessEmail, setAccessEmail] = useState('');
  const [demoStudentName, setDemoStudentName] = useState(() => localStorage.getItem('leeder-demo-student-name') || '');
  const [toast, setToast] = useState('');
  const [location, navigate] = useLocation();
  const t = (key:string) => copy[language][key] || copy.en[key] || key;
  const isArabic = language === 'ar';
  const studentDisplayName = demoStudentName || t('studentName');
  const statusLabel = (status:Status) => ({
    Draft:t('statusDraft'),
    'Pending Review':t('statusPendingReview'),
    'Modifications Requested':t('statusModifications'),
    Approved:t('statusApproved'),
    Rejected:t('statusRejected')
  })[status];
  const profileInitials = studentDisplayName.trim().split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase() || t('profileInitial');

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data]);
  useEffect(() => {
    localStorage.setItem('leeder-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', isArabic);
  }, [language, isArabic]);
  useEffect(() => { localStorage.setItem('leeder-role', role); }, [role]);
  useEffect(() => { if (demoStudentName) localStorage.setItem('leeder-demo-student-name', demoStudentName); }, [demoStudentName]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const submitDemoAccess = (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessEmail.trim() || (accessMode==='register' && !accessName.trim())) {
      setToast(t('accessRequired'));
      return;
    }
    if (accessMode==='register') setDemoStudentName(accessName.trim());
    setAccessMode(null);
    setToast(t('accessComplete'));
    navigate(role==='reviewer'?'/review':'/dashboard');
  };
  const updateProposal = (patch:Partial<Proposal>) => setData(prev => ({ ...prev, proposal: { ...prev.proposal, ...patch } }));
  const updateData = (patch:Partial<DemoData>) => setData(prev => ({ ...prev, ...patch }));
  const setStatus = (status:Status, feedback:string) => {
    setData(prev => ({ ...prev, proposal:{ ...prev.proposal, status, feedback }, notifications:[`${statusLabel(status)}: ${feedback || t('actionSaved')}`, ...prev.notifications].slice(0,5) }));
    setToast(t('actionSaved'));
  };

  function Header() {
    const navItems = [['/', 'home'], ['/dashboard', 'dashboard'], ['/proposal', 'proposal'], ['/review', 'review'], ['/editor', 'editor']];
    return <header className="topbar">
      <Link href="/" className="brand" data-testid="link-home"><span className="brand-mark">L</span>leeder</Link>
      <nav className="nav-links" aria-label="Main navigation">
        {navItems.map(([href,key]) => <Link href={href} key={href} className={`nav-link ${location===href?'active':''}`} data-testid={`link-${key}`}>{t(key)}</Link>)}
      </nav>
      <div className="nav-actions">
        <select className="role-select" value={role} aria-label={t('roleHint')} onChange={e=>setRole(e.target.value as Role)} data-testid="select-demo-role">
          <option value="student">{t('roleStudent')}</option><option value="reviewer">{t('roleReviewer')}</option>
        </select>
        <select className="lang-select" value={language} aria-label="Language" onChange={e=>setLanguage(e.target.value as Language)} data-testid="select-language">
          <option value="en">EN</option><option value="fr">FR</option><option value="ar">عربي</option>
        </select>
      </div>
    </header>;
  }

  function Notice() { return <div className="notice" data-testid="text-demo-notice"><span className="notice-dot"/><span><strong>{t('demo')}.</strong> {t('local')}</span></div>; }

  function Landing() {
    return <div className="landing">
      <Header />
      <section className="hero fade-in">
        <div>
          <div className="eyebrow">{t('heroEyebrow')}</div>
          <h1 dangerouslySetInnerHTML={{__html:t('heroTitle')}} />
          <p className="hero-copy">{t('heroText')}</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={()=>setAccessMode('login')} data-testid="button-enter-demo">{t('signIn')} <ArrowRight size={15}/></button>
            <button className="btn btn-outline" onClick={()=>{setRole('student');setAccessMode('register');}} data-testid="button-register-demo">{t('register')}</button>
          </div>
          <div style={{marginTop:28,maxWidth:490}}><Notice/></div>
        </div>
        <div className="hero-art" aria-label={t('heroMini')}>
          <div className="art-kicker">Leeder / Research journey</div>
          <div className="art-title">{t('heroMini')}</div>
          <div className="paper-card">
            <div className="meta-label">{t('researchProposalLabel')}</div>
            <div style={{fontWeight:700,fontSize:15,marginTop:10,color:'#213d54'}}>{data.proposal.title}</div>
            <div className="paper-line"/><div className="paper-line short"/><div className="paper-line"/>
            <span className="paper-tag">{statusLabel(data.proposal.status)}</span>
          </div>
          <div className="art-bottom">{t('universityResearchLabel')}</div>
        </div>
      </section>
      <section className="landing-section">
        <div className="eyebrow">{t('featureEyebrow')}</div><h2 className="section-headline">{t('featureTitle')}</h2>
        <p className="page-subtitle">{t('honest')}</p>
        <div className="feature-grid">
          {[['01',t('feature1'),t('feature1d'),FileText],['02',t('feature2'),t('feature2d'),ClipboardCheck],['03',t('feature3'),t('feature3d'),BookOpen]].map(([n,title,desc,Icon])=>{
            const Mark = Icon as typeof FileText;
            return <article className="feature-card" key={n as string}><span className="feature-index">{n as string} / 03</span><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h3>{title as string}</h3><Mark size={18} color="#438c7e"/></div><p>{desc as string}</p></article>;
          })}
        </div>
      </section>
      <footer className="landing-footer"><span>© Leeder · {t('footer')}</span><span>{t('sample')} · {t('location')}</span></footer>
      {accessMode && <div className="access-overlay" onClick={()=>setAccessMode(null)}>
        <section className="access-dialog" role="dialog" aria-modal="true" aria-labelledby="access-title" onClick={event=>event.stopPropagation()}>
          <div className="access-dialog-top"><span className="brand-mark">L</span><button type="button" className="access-close" aria-label={t('cancel')} onClick={()=>setAccessMode(null)}>×</button></div>
          <div className="eyebrow">{t('demo')}</div>
          <h2 id="access-title">{accessMode==='login'?t('signInTitle'):t('registerTitle')}</h2>
          <p className="access-note">{t('accessNote')}</p>
          <form className="access-form" onSubmit={submitDemoAccess}>
            {accessMode==='register' && <label className="field"><span>{t('fullName')}</span><input autoComplete="name" value={accessName} onChange={event=>setAccessName(event.target.value)} required /></label>}
            <label className="field"><span>{t('emailAddress')}</span><input type="email" autoComplete="email" value={accessEmail} onChange={event=>setAccessEmail(event.target.value)} required /></label>
            <div className="callout">{t('accessNote')}</div>
            <div className="access-actions"><button type="submit" className="btn btn-primary">{t('continueDemo')} <ArrowRight size={14}/></button><button type="button" className="btn btn-outline" onClick={()=>setAccessMode(null)}>{t('cancel')}</button></div>
          </form>
        </section>
      </div>}
    </div>;
  }

  function Dashboard() {
    const steps: {name:string;done:boolean;state:string}[] = [
      {name:t('stepProfile'),done:true,state:t('completed')},
      {name:t('stepProposal'),done:data.proposal.status!=='Draft',state:data.proposal.status==='Draft'?t('underway'):t('completed')},
      {name:t('stepReview'),done:data.proposal.status==='Approved'||data.proposal.status==='Rejected'||data.proposal.status==='Modifications Requested',state:data.proposal.status==='Pending Review'?t('awaiting'):data.proposal.status==='Draft'?t('awaiting'):t('completed')},
      {name:t('stepWriting'),done:data.proposal.status==='Approved',state:data.proposal.status==='Approved'?t('available'):t('awaiting')}
    ];
    const progress = data.proposal.status==='Approved'?100:data.proposal.status==='Pending Review'?61:data.proposal.status==='Modifications Requested'?61:data.proposal.status==='Rejected'?61:34;
    return <><Header/><main className="page-wrap fade-in"><Notice/>
      <div className="page-head" style={{marginTop:30}}>
        <div><div className="eyebrow">{t('welcome')} {studentDisplayName}</div><h1 className="page-title">{t('workspace')}</h1><p className="page-subtitle">{t('workspaceDesc')}</p></div>
        <button className="btn btn-primary" onClick={()=>navigate('/proposal')} data-testid="button-edit-proposal"><FilePenLine size={15}/>{t('editProposal')}</button>
      </div>
      <div className="grid-main">
        <div className="stack">
          <section className="panel panel-pad">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}><div><div className="meta-label">{t('currentStatus')}</div><div style={{marginTop:9}}><StatusBadge status={data.proposal.status} label={statusLabel(data.proposal.status)}/></div></div>
              <button className="btn btn-soft" onClick={()=>navigate('/proposal')} data-testid="button-proposal-details">{t('proposal')} <ChevronRight size={14}/></button></div>
            <h2 style={{fontSize:19,color:'#24435c',margin:'20px 0 7px'}}>{data.proposal.title || t('noProposal')}</h2>
            <div className="muted" style={{fontSize:12}}>{data.proposal.field || '—'} · {data.proposal.researchLanguage}</div>
            {data.proposal.feedback && <div className="callout" style={{marginTop:18}}><strong>{t('feedback')}:</strong> {data.proposal.feedback}</div>}
            <div className="stat-row">
              <div className="stat"><div className="stat-label">{t('progress')}</div><div className="stat-value">{progress}%</div><div className="progress-track"><div className="progress-fill" style={{width:`${progress}%`}}/></div></div>
              <div className="stat"><div className="stat-label">{t('nextStep')}</div><div className="stat-value" style={{fontSize:14}}>{data.proposal.status==='Approved'?t('stepWriting'):data.proposal.status==='Draft'?t('stepProposal'):t('stepReview')}</div></div>
              <div className="stat"><div className="stat-label">{t('language')}</div><div className="stat-value" style={{fontSize:14}}>{data.proposal.researchLanguage}</div></div>
            </div>
            <div className="meta-label">{t('progress')}</div>
            <div className="steps">{steps.map((step,i)=><div className={`step ${step.done?'done':i===1?'':'pending'}`} key={step.name}><span className="step-icon">{step.done?<Check size={12}/>:i+1}</span><div><strong>{step.name}</strong><small>{step.state}</small></div></div>)}</div>
          </section>
          <section className="panel panel-pad">
            <h2 className="section-title">{t('academic')}</h2><p className="section-caption">{t('sample')}</p>
            <div className="stat-row" style={{marginBottom:0}}>
              {[[t('university'),t('universityName')],[t('department'),t('departmentName')],[t('degree'),t('degreeName')]].map(([label,value])=><div className="stat" key={label}><div className="stat-label">{label}</div><div className="meta-value">{value}</div></div>)}
            </div>
          </section>
        </div>
        <aside className="stack">
          <section className="panel panel-pad">
            <h2 className="section-title">{t('profile')}</h2>
            <div className="profile-line" style={{marginTop:19}}><div className="avatar">{profileInitials}</div><div><strong style={{fontSize:14,color:'#25445d'}}>{studentDisplayName}</strong><div className="muted" style={{fontSize:11,marginTop:4}}>{t('degreeName')}</div></div></div>
            <div className="divider"/>
            <div className="meta-label">{t('supervisor')}</div><div className="profile-line" style={{marginTop:12}}><div className="avatar" style={{background:'#e8edf2',color:'#425d74'}}>MK</div><div><strong style={{fontSize:13,color:'#29445a'}}>Dr. Meriem Kaci</strong><div className="muted" style={{fontSize:11,marginTop:4}}>{t('supervisorRole')} · {t('academicField')}</div></div></div>
          </section>
          <section className="panel panel-pad"><div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}><Bell size={15} color="#398879"/><h2 className="section-title" style={{margin:0}}>{t('notifications')}</h2></div>
            {data.notifications.length===0?<p className="section-caption">{t('noNotifications')}</p>:data.notifications.map((n,i)=><div className="notification" key={`${n}-${i}`}><span className="notification-mark"/><div><p>{n==='proposal-ready'?t('defaultNotification'):n}</p><time>{i===0?t('justNow'):`${i+1} ${t('daysAgo')}`} · {t('localDemoTag')}</time></div></div>)}
          </section>
          <div className="callout"><strong>{t('demo')}:</strong> {t('honest')}</div>
        </aside>
      </div>
    </main></>;
  }

  function ProposalPage() {
    const [form,setForm] = useState<Proposal>(data.proposal);
    useEffect(()=>setForm(data.proposal),[data.proposal]);
    const setField = (key:keyof Proposal,value:string) => setForm(prev=>({...prev,[key]:value}));
    const save = (submit:boolean) => {
      if (submit && (!form.title.trim() || !form.problem.trim())) { setToast(t('required')); return; }
      const status:Status = submit?'Pending Review':(form.status==='Approved'||form.status==='Rejected'?'Draft':form.status==='Modifications Requested'?'Modifications Requested':'Draft');
      updateProposal({...form,status});
      if (submit) setData(prev=>({...prev,notifications:[t('submitted'),...prev.notifications].slice(0,5)}));
      setToast(submit?t('submitted'):t('saved'));
    };
    const textarea = (key:keyof Proposal,label:string,tall=false) => <div className="field full"><label htmlFor={`field-${key}`}>{label}</label><textarea id={`field-${key}`} className={tall?'tall':''} value={form[key] as string} onChange={e=>setField(key,e.target.value)} data-testid={`input-${key}`}/></div>;
    return <><Header/><main className="page-wrap fade-in"><Notice/>
      <div className="page-head" style={{marginTop:30}}><div><div className="eyebrow">01 / {t('stepProposal')}</div><h1 className="page-title">{t('proposalPageTitle')}</h1><p className="page-subtitle">{t('proposalPageDesc')}</p></div><StatusBadge status={data.proposal.status} label={statusLabel(data.proposal.status)}/></div>
      <div className="grid-main">
        <section className="panel panel-pad">
          <div className="form-grid">
            <div className="field full"><label htmlFor="field-title">{t('title')}</label><input id="field-title" value={form.title} onChange={e=>setField('title',e.target.value)} data-testid="input-title"/></div>
            <div className="field"><label htmlFor="field-field">{t('field')}</label><input id="field-field" value={form.field} onChange={e=>setField('field',e.target.value)} data-testid="input-field"/></div>
            <div className="field"><label htmlFor="field-language">{t('language')}</label><select id="field-language" value={form.researchLanguage} onChange={e=>setField('researchLanguage',e.target.value)} data-testid="select-research-language"><option value="English">English</option><option value="French">Français</option><option value="Arabic">العربية</option><option value="Other">{t('languageOther')}</option></select></div>
            {textarea('problem',t('problem'),true)}
            {textarea('objectives',t('objectives'))}
            {textarea('methodology',t('methodology'))}
            {textarea('outline',t('outline'))}
          </div>
          <div className="form-actions"><span className="muted" style={{fontSize:11}}>{t('local')}</span><div style={{display:'flex',gap:9,flexWrap:'wrap'}}><button className="btn btn-outline" onClick={()=>save(false)} data-testid="button-save-proposal">{t('saveDraft')}</button><button className="btn btn-teal" onClick={()=>save(true)} data-testid="button-submit-proposal">{t('submit')} <ArrowRight size={14}/></button></div></div>
        </section>
        <aside className="stack">
          <section className="panel panel-pad"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h2 className="section-title">{t('status')}</h2><StatusBadge status={data.proposal.status} label={statusLabel(data.proposal.status)}/></div><div className="divider"/><p className="section-caption">{data.proposal.status==='Draft'?t('draftNotice'):data.proposal.status==='Pending Review'?t('awaiting'):data.proposal.status==='Modifications Requested'?data.proposal.feedback:data.proposal.status==='Approved'?t('available'):data.proposal.feedback}</p></section>
          <section className="panel panel-pad"><h2 className="section-title">{t('supervisor')}</h2><div className="profile-line" style={{marginTop:16}}><div className="avatar">MK</div><div><strong style={{fontSize:13}}>Dr. Meriem Kaci</strong><div className="muted" style={{fontSize:11,marginTop:4}}>{t('academicField')}</div></div></div><p className="section-caption" style={{marginTop:16}}>{t('local')}</p></section>
          <div className="callout">{t('honest')}</div>
        </aside>
      </div>
    </main></>;
  }

  function ReviewPage() {
    const [notes,setNotes] = useState(data.notes);
    useEffect(()=>setNotes(data.notes),[data.notes]);
    const decide = (status:Status) => {
      if(status==='Rejected' && !window.confirm(t('rejectConfirm'))) return;
      const feedback = notes.trim() || (status==='Approved'?t('approvedFeedback'):status==='Rejected'?t('rejectedFeedback'):t('requestFeedback'));
      updateData({notes});
      setStatus(status,feedback);
    };
    return <><Header/><main className="page-wrap fade-in"><Notice/>
      <div className="page-head" style={{marginTop:30}}><div><div className="eyebrow">02 / {t('reviewerOnly')}</div><h1 className="page-title">{t('reviewTitle')}</h1><p className="page-subtitle">{t('reviewDesc')}</p></div><div className="status" style={{color:'#357e71',background:'#e4f0ed'}}><UserRound size={13}/>{t('roleReviewer')}</div></div>
      <div className="grid-main">
        <section className="panel panel-pad">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}><div><div className="meta-label">{t('queue')}</div><h2 className="section-title" style={{fontSize:19,marginTop:8}}>{t('reviewProposal')}</h2></div><StatusBadge status={data.proposal.status} label={statusLabel(data.proposal.status)}/></div>
          {!data.proposal.title ? <div className="callout" style={{marginTop:20}}>{t('noProposal')}</div> : <>
          <div className="divider"/>
          <div className="meta-label">{t('title')}</div><h3 style={{fontSize:18,color:'#233f58',lineHeight:1.4,margin:'8px 0 15px'}}>{data.proposal.title}</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:17}}>
            {[[t('field'),data.proposal.field],[t('language'),data.proposal.researchLanguage]].map(([a,b])=><div key={a}><div className="meta-label">{a}</div><div className="meta-value">{b}</div></div>)}
          </div>
          {[['problem',t('problem')],['objectives',t('objectives')],['methodology',t('methodology')],['outline',t('outline')]].map(([key,label])=><div key={key} style={{marginTop:18}}><div className="meta-label">{label}</div><p style={{fontSize:13,color:'#526a7b',lineHeight:1.7,whiteSpace:'pre-line',margin:'7px 0 0'}}>{data.proposal[key as keyof Proposal]}</p></div>)}
          </>}
        </section>
        <aside className="stack">
          <section className="panel panel-pad">
            <h2 className="section-title">{t('reviewerNotes')}</h2><p className="section-caption">{t('local')}</p>
            <div className="field" style={{marginTop:18}}><textarea className="tall" value={notes} onChange={e=>setNotes(e.target.value)} placeholder={t('notesHint')} data-testid="input-review-notes"/></div>
            <div className="review-actions">
              <button className="btn btn-teal" onClick={()=>decide('Approved')} data-testid="button-approve"><Check size={14}/>{t('approve')}</button>
              <button className="btn btn-soft" onClick={()=>decide('Modifications Requested')} data-testid="button-request-changes">{t('requestChanges')}</button>
              <button className="btn btn-danger" onClick={()=>decide('Rejected')} data-testid="button-reject">{t('reject')}</button>
            </div>
          </section>
          <section className="panel panel-pad"><h2 className="section-title">{t('feedback')}</h2><p className="section-caption" style={{marginTop:9}}>{data.proposal.feedback || t('noFeedback')}</p></section>
          <div className="callout"><strong>{t('demo')}.</strong> {t('honest')}</div>
        </aside>
      </div>
    </main></>;
  }

  function EditorPage() {
    const [draft,setDraft] = useState(data.draft || `Introduction\n\nThis research explores the role of digital learning practices in Algerian public universities. It begins by examining the context in which students access learning resources and participate in blended courses.\n\nResearch focus\n\nThe study considers access, study habits and student engagement as connected dimensions of the learning experience.`);
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const writingRTL = data.proposal.researchLanguage.toLowerCase().includes('arab') || data.proposal.researchLanguage.includes('العربية');
    const insert = (prefix:string) => {
      const el=editorRef.current;if(!el)return;
      const start=el.selectionStart,end=el.selectionEnd;
      const next=draft.slice(0,start)+prefix+draft.slice(start,end)+draft.slice(end);
      setDraft(next); window.setTimeout(()=>{el.focus();el.setSelectionRange(start+prefix.length,end+prefix.length);},0);
    };
    const save = () => { updateData({draft});setToast(t('draftSaved')); };
    const unlocked=data.proposal.status==='Approved';
    return <><Header/><main className="page-wrap fade-in"><Notice/>
      <div className="page-head" style={{marginTop:30}}><div><div className="eyebrow">03 / {t('stepWriting')}</div><h1 className="page-title">{t('editorTitle')}</h1><p className="page-subtitle">{t('editorDesc')}</p></div>{unlocked?<button className="btn btn-teal" onClick={save} data-testid="button-save-draft"><Save size={15}/>{t('save')}</button>:null}</div>
      {!unlocked ? <div className="panel panel-pad" style={{maxWidth:760,margin:'0 auto',padding:'38px'}}>
        <div className="locked"><LockKeyhole size={17}/><div><strong>{t('lockedTitle')}.</strong> {t('lockedDesc')}</div></div>
        <div style={{textAlign:'center',padding:'28px 12px 5px'}}><div className="avatar" style={{margin:'0 auto 16px',width:54,height:54,borderRadius:18}}><BookOpen size={22}/></div><h2 className="section-title" style={{fontSize:21}}>{t('editorTitle')}</h2><p className="section-caption" style={{maxWidth:450,margin:'8px auto 19px'}}>{t('lockedDesc')}</p><button className="btn btn-primary" onClick={()=>navigate('/review')} data-testid="button-open-review">{t('unlock')} <ArrowRight size={14}/></button></div>
      </div> : <div className="editor-layout">
        <section className="panel" style={{overflow:'hidden'}}>
          <div className="editor-toolbar">
            <button className="tool-btn" aria-label={t('markTitle')} title={t('markTitle')} onClick={()=>insert('# ')} data-testid="button-editor-title"><Heading1 size={17}/></button>
            <button className="tool-btn" aria-label={t('markHeading')} title={t('markHeading')} onClick={()=>insert('## ')} data-testid="button-editor-heading"><Heading2 size={16}/></button>
            <button className="tool-btn" aria-label={t('markParagraph')} title={t('markParagraph')} onClick={()=>insert('\n')} data-testid="button-editor-paragraph"><AlignLeft size={16}/></button>
            <span style={{marginLeft:'auto',fontSize:10,color:'#7c8e99',display:'inline-flex',alignItems:'center',gap:5}}><Languages size={13}/>{data.proposal.researchLanguage}</span>
          </div>
          <div style={{padding:'20px clamp(16px,5vw,66px) 36px'}}>
            <div className="meta-label" style={{marginBottom:14}}>{data.proposal.title}</div>
            <textarea ref={editorRef} className="editor-paper" dir={writingRTL?'rtl':'ltr'} value={draft} onChange={e=>setDraft(e.target.value)} placeholder={t('placeholder')} data-testid="input-editor-content" style={{width:'100%',border:0,resize:'vertical',background:'transparent',minHeight:500}}/>
            <div style={{fontSize:10,color:'#9aa5ad',textAlign:'end'}}>{t('languageDirection')}</div>
          </div>
        </section>
        <aside className="stack">
          <section className="panel panel-pad"><h2 className="section-title">{t('notes')}</h2><p className="section-caption" style={{marginTop:6}}>{t('sample')} · {data.proposal.researchLanguage}</p>
            {[t('noteOne'),t('noteTwo'),t('noteThree')].map((note,i)=><div className="notification" key={note}><span className="notification-mark"/><p>{note}</p></div>)}
          </section>
          <section className="panel panel-pad"><div className="meta-label">{t('currentStatus')}</div><div style={{marginTop:9}}><StatusBadge status={data.proposal.status} label={statusLabel(data.proposal.status)}/></div><p className="section-caption" style={{marginTop:12}}>{t('local')}</p></section>
        </aside>
      </div>}
    </main></>;
  }

  return <div className="app-shell">
    <Switch>
      <Route path="/" component={Landing}/>
      <Route path="/dashboard" component={Dashboard}/>
      <Route path="/proposal" component={ProposalPage}/>
      <Route path="/review" component={ReviewPage}/>
      <Route path="/editor" component={EditorPage}/>
      <Route><><Header/><main className="page-wrap"><div className="panel panel-pad"><h1 className="page-title">{t('notFound')}</h1><Link href="/">{t('back')}</Link></div></main></></Route>
    </Switch>
    {toast&&<div className="toast-message" role="status">{toast}</div>}
  </div>;
}

export default App;
