import { useEffect, useMemo, useRef, useState } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Bold, BookMarked, BookOpen, Heading1, Heading2, Italic, List, ListOrdered, Plus, Quote, Save, Search, Trash2, Underline, X } from 'lucide-react';

type Source = {
  id: string;
  type: string;
  author: string;
  title: string;
  year: string;
  publisher: string;
  place: string;
  edition: string;
  editor: string;
  url: string;
  accessed: string;
  note: string;
};

type SuggestedSource = {
  id: string;
  type: 'book' | 'article' | 'thesis' | 'other';
  title: string;
  author: string;
  year: string;
  publisher: string;
  url: string;
  doi: string;
  provider: string;
};

type ReviewIssue = {
  id: string;
  category: 'إملاء وترقيم' | 'تركيب' | 'تنسيق';
  message: string;
  excerpt: string;
  replacement: string;
  reason: string;
  reference: string;
  confidence: 'مرتفعة' | 'متوسطة';
};

type Props = {
  draft: string;
  onDraftChange: (value: string) => void;
  title: string;
  researchLanguage: string;
  studentId: string;
  onSave: (content: string) => void;
};

const emptySource = (): Source => ({
  id: '', type: 'book', author: '', title: '', year: '', publisher: '',
  place: '', edition: '', editor: '', url: '', accessed: '', note: '',
});

const labels = {
  ar: {
    outline:'هيكل المذكرة', document:'مستند البحث', sources:'المصادر والمراجع',
    addSource:'إضافة مصدر', search:'ابحث في مكتبتك...', sourceType:'نوع المصدر',
    book:'كتاب', article:'مقال علمي', thesis:'رسالة جامعية', website:'موقع إلكتروني',
    manuscript:'مخطوط', report:'تقرير أو وثيقة', other:'مصدر آخر',
    author:'المؤلف / المؤلفون', title:'عنوان المصدر', year:'سنة النشر',
    publisher:'دار النشر / المجلة', place:'مكان النشر', edition:'الطبعة / الجزء',
    editor:'المحقق أو المترجم', url:'الرابط الإلكتروني', accessed:'تاريخ الاطلاع',
    note:'ملاحظات', saveSource:'حفظ المصدر', cancel:'إلغاء', noSources:'لم تضف مصادر بعد.',
    insertCitation:'إدراج إحالة', insertFootnote:'إدراج حاشية', chooseSource:'اختر مصدرًا',
    page:'رقم الصفحة', citationStyle:'نمط الإحالة', footnoteText:'نص الحاشية',
    insert:'إدراج', close:'إغلاق', saved:'حُفظت المسودة محليًا', saving:'جارٍ الحفظ...',
    words:'كلمة', characters:'حرف', paragraph:'فقرة', chapter:'عنوان فصل',
    section:'عنوان مبحث', subheading:'عنوان فرعي', sourceMissing:'أكمل المؤلف والعنوان على الأقل.',
    citationHelp:'تُدرج الإحالة في موضع المؤشر، وتُربط بالمصدر المحفوظ.',
    sourcesCount:'مصدر محفوظ', delete:'حذف', edit:'تعديل', formatting:'تنسيق النص',
    textDirection:'اتجاه النص', rtl:'من اليمين إلى اليسار', ltr:'من اليسار إلى اليمين',
    autosave:'حفظ تلقائي', demoStorage:'تخزين تجريبي على هذا الجهاز فقط',
    referenceList:'قائمة المراجع', generate:'إدراج قائمة المراجع',
    emptyTitle:'ابدأ كتابة مذكرتك', emptyHint:'اكتب هنا أو اختر عنوانًا من شريط الأدوات.',
    editorTip:'حدد النص لتنسيقه. استخدم قائمة المصادر لإضافة إحالات موثقة.',
  },
  en: {
    outline:'Document outline', document:'Research document', sources:'Sources & references',
    addSource:'Add source', search:'Search your library...', sourceType:'Source type',
    book:'Book', article:'Journal article', thesis:'Thesis / dissertation', website:'Website',
    manuscript:'Manuscript', report:'Report / document', other:'Other source',
    author:'Author(s)', title:'Source title', year:'Publication year',
    publisher:'Publisher / journal', place:'Place of publication', edition:'Edition / volume',
    editor:'Editor or translator', url:'URL', accessed:'Access date', note:'Notes',
    saveSource:'Save source', cancel:'Cancel', noSources:'No sources added yet.',
    insertCitation:'Insert citation', insertFootnote:'Insert footnote', chooseSource:'Choose a source',
    page:'Page number', citationStyle:'Citation style', footnoteText:'Footnote text',
    insert:'Insert', close:'Close', saved:'Draft saved locally', saving:'Saving...',
    words:'words', characters:'characters', paragraph:'Paragraph', chapter:'Chapter heading',
    section:'Section heading', subheading:'Subheading', sourceMissing:'Add at least an author and title.',
    citationHelp:'The citation is inserted at the cursor and linked to the saved source.',
    sourcesCount:'saved sources', delete:'Delete', edit:'Edit', formatting:'Text formatting',
    textDirection:'Text direction', rtl:'Right to left', ltr:'Left to right',
    autosave:'Auto-save', demoStorage:'Demo storage on this device only',
    referenceList:'References', generate:'Insert references list',
    emptyTitle:'Start writing your thesis', emptyHint:'Write here or choose a heading from the toolbar.',
    editorTip:'Select text to format it. Use Sources to insert documented citations.',
  },
  fr: {
    outline:'Plan du mémoire', document:'Document de recherche', sources:'Sources et références',
    addSource:'Ajouter une source', search:'Rechercher...', sourceType:'Type de source',
    book:'Livre', article:'Article scientifique', thesis:'Mémoire / thèse', website:'Site web',
    manuscript:'Manuscrit', report:'Rapport / document', other:'Autre source',
    author:'Auteur(s)', title:'Titre de la source', year:'Année de publication',
    publisher:'Éditeur / revue', place:'Lieu de publication', edition:'Édition / volume',
    editor:'Éditeur scientifique ou traducteur', url:'URL', accessed:'Date de consultation',
    note:'Notes', saveSource:'Enregistrer', cancel:'Annuler', noSources:'Aucune source ajoutée.',
    insertCitation:'Insérer une citation', insertFootnote:'Insérer une note', chooseSource:'Choisir une source',
    page:'Numéro de page', citationStyle:'Style de citation', footnoteText:'Texte de la note',
    insert:'Insérer', close:'Fermer', saved:'Brouillon enregistré localement', saving:'Enregistrement...',
    words:'mots', characters:'caractères', paragraph:'Paragraphe', chapter:'Titre de chapitre',
    section:'Titre de section', subheading:'Sous-titre', sourceMissing:'Ajoutez au moins un auteur et un titre.',
    citationHelp:'La citation est insérée au curseur et liée à la source enregistrée.',
    sourcesCount:'sources enregistrées', delete:'Supprimer', edit:'Modifier', formatting:'Mise en forme',
    textDirection:'Sens du texte', rtl:'De droite à gauche', ltr:'De gauche à droite',
    autosave:'Enregistrement auto', demoStorage:'Stockage démo sur cet appareil uniquement',
    referenceList:'Références', generate:'Insérer la bibliographie',
    emptyTitle:'Commencez à rédiger', emptyHint:'Écrivez ici ou choisissez un titre dans la barre.',
    editorTip:'Sélectionnez le texte pour le mettre en forme. Utilisez Sources pour citer.',
  },
};

const blockTags = new Set(['P','DIV','H1','H2','H3','H4','BLOCKQUOTE','LI','TH','TD']);

const cleanHtml = (html: string) => {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const allowed = new Set(['P','DIV','H1','H2','H3','H4','UL','OL','LI','BLOCKQUOTE','STRONG','B','EM','I','U','BR','A','SPAN','SUB','SUP','TABLE','THEAD','TBODY','TR','TH','TD']);
  const walk = (node: Node) => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        if (!allowed.has(el.tagName)) {
          el.replaceWith(...Array.from(el.childNodes));
          return;
        }
        [...el.attributes].forEach(attr => {
          if (attr.name === 'href' && el.tagName === 'A' && /^https?:\/\//i.test(attr.value)) return;
          if (attr.name === 'dir' && ['auto','rtl','ltr'].includes(attr.value.toLowerCase())) return;
          if (attr.name === 'lang' && /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(attr.value)) return;
          el.removeAttribute(attr.name);
        });
        if (blockTags.has(el.tagName) && !el.hasAttribute('dir')) el.setAttribute('dir', 'auto');
        walk(el);
      } else if (child.nodeType !== Node.TEXT_NODE) child.remove();
    });
  };
  walk(parsed.body);
  return parsed.body.innerHTML;
};

export function ThesisEditor({ draft, onDraftChange, title, researchLanguage, studentId, onSave }: Props) {
  const rtl = researchLanguage.toLowerCase().includes('arab');
  const lang = rtl ? 'ar' : researchLanguage.toLowerCase().includes('french') ? 'fr' : 'en';
  const t = labels[lang];
  const editor = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<'outline'|'sources'>('outline');
  const [sources, setSources] = useState<Source[]>([]);
  const [topicSearch, setTopicSearch] = useState(title);
  const [suggestions, setSuggestions] = useState<SuggestedSource[]>([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState('');
  const [query, setQuery] = useState('');
  const [sourceForm, setSourceForm] = useState<Source | null>(null);
  const [citationSource, setCitationSource] = useState('');
  const [citationPage, setCitationPage] = useState('');
  const [citationStyle, setCitationStyle] = useState('author-date');
  const [sentenceToCite, setSentenceToCite] = useState('');
  const [sentenceReferenceMode, setSentenceReferenceMode] = useState(false);
  const [reviewIssues, setReviewIssues] = useState<ReviewIssue[]>([]);
  const [reviewRan, setReviewRan] = useState(false);
  const [footnote, setFootnote] = useState('');
  const [modal, setModal] = useState<'citation'|'footnote'|null>(null);
  const [saveState, setSaveState] = useState<'saved'|'saving'>('saved');
  const [direction, setDirection] = useState(rtl ? 'rtl' : 'ltr');

  useEffect(() => {
    const nextDirection = rtl ? 'rtl' : 'ltr';
    setDirection(nextDirection);
    if (editor.current) editor.current.dir = nextDirection;
  }, [rtl, studentId]);


  const storageKey = 'leeder-sources-v1-' + studentId;

  const searchAcademicSources = async (term: string) => {
    const searchTerm = term.trim();
    if (!searchTerm) return;
    setSuggestionLoading(true);
    setSuggestionError('');
    try {
      const [openAlexResponse, crossrefResponse] = await Promise.allSettled([
        fetch('https://api.openalex.org/works?search=' + encodeURIComponent(searchTerm) + '&per-page=12&select=id,doi,display_name,publication_year,type,authorships,primary_location,biblio'),
        fetch('https://api.crossref.org/works?query.bibliographic=' + encodeURIComponent(searchTerm) + '&rows=8'),
      ]);
      const found: SuggestedSource[] = [];
      if (openAlexResponse.status === 'fulfilled' && openAlexResponse.value.ok) {
        const data = await openAlexResponse.value.json();
        (data.results || []).forEach((work: any) => {
          const kind = String(work.type || '').toLowerCase();
          if (!['article','book','dissertation','book-chapter','monograph'].includes(kind)) return;
          const sourceName = work.primary_location?.source?.display_name || '';
          const authors = (work.authorships || []).slice(0, 3).map((item: any) => item.author?.display_name).filter(Boolean).join('، ');
          found.push({
            id: String(work.id || work.doi || work.display_name),
            type: kind === 'book' || kind === 'monograph' || kind === 'book-chapter' ? 'book' : kind === 'dissertation' ? 'thesis' : 'article',
            title: String(work.display_name || ''),
            author: authors || 'بيانات المؤلف غير متاحة',
            year: work.publication_year ? String(work.publication_year) : '',
            publisher: sourceName || 'OpenAlex',
            url: String(work.primary_location?.landing_page_url || work.doi || work.id || ''),
            doi: String(work.doi || ''),
            provider: 'OpenAlex',
          });
        });
      }
      if (crossrefResponse.status === 'fulfilled' && crossrefResponse.value.ok) {
        const data = await crossrefResponse.value.json();
        (data.message?.items || []).forEach((work: any) => {
          const kind = String(work.type || '').toLowerCase();
          if (!['journal-article','book','book-chapter','monograph','dissertation'].includes(kind)) return;
          const titleText = work.title?.[0];
          if (!titleText) return;
          const doi = String(work.DOI || '');
          const authors = (work.author || []).slice(0, 3).map((item: any) => [item.given,item.family].filter(Boolean).join(' ')).filter(Boolean).join('، ');
          found.push({
            id: doi || titleText,
            type: kind.includes('book') || kind === 'monograph' ? 'book' : kind === 'dissertation' ? 'thesis' : 'article',
            title: String(titleText),
            author: authors || 'بيانات المؤلف غير متاحة',
            year: String(work.published?.['date-parts']?.[0]?.[0] || work.created?.['date-parts']?.[0]?.[0] || ''),
            publisher: String(work['container-title']?.[0] || work.publisher || 'Crossref'),
            url: doi ? 'https://doi.org/' + doi : String(work.URL || ''),
            doi,
            provider: 'Crossref',
          });
        });
      }
      const unique = new Map<string, SuggestedSource>();
      found.forEach(item => {
        const key = (item.doi || item.title).toLowerCase();
        if (!unique.has(key)) unique.set(key, item);
      });
      setSuggestions([...unique.values()].slice(0, 14));
      if (!unique.size) setSuggestionError('لم نعثر على سجلات مناسبة في قواعد البيانات المتصلة. جرّب صياغة أخرى أو البحث في Google.');
    } catch {
      setSuggestionError('تعذر الاتصال بقواعد البيانات الأكاديمية الآن. يمكنك إعادة المحاولة أو استخدام البحث في Google.');
    } finally {
      setSuggestionLoading(false);
    }
  };

  useEffect(() => {
    setTopicSearch(title);
    if (title.trim().length > 4) {
      const timer = window.setTimeout(() => { void searchAcademicSources(title); }, 700);
      return () => window.clearTimeout(timer);
    }
  }, [title, studentId]);

  const addSuggestedSource = (item: SuggestedSource) => {
    const nextSource: Source = {
      id: crypto.randomUUID(),
      type: item.type,
      author: item.author,
      title: item.title,
      year: item.year,
      publisher: item.publisher,
      place: '',
      edition: '',
      editor: '',
      url: item.url,
      accessed: '',
      note: 'سجل مقترح من ' + item.provider + '. تحقّق من بيانات النشر والتحكيم ومدى صلته قبل الاستشهاد به.',
    };
    const next = [...sources, nextSource];
    setSources(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };
  useEffect(() => {
    try { setSources(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch { setSources([]); }
  }, [storageKey]);

  useEffect(() => {
    if (!editor.current) return;
    const current = editor.current.innerHTML;
    const incoming = draft && /<\/?(p|h1|h2|h3|strong|em|ul|ol|li|blockquote|br)\b/i.test(draft)
      ? cleanHtml(draft)
      : draft ? draft.split(/\n{2,}/).map(part => '<p>' + escapeHtml(part).replace(/\n/g,'<br>') + '</p>').join('') : '';
    if (current !== incoming) editor.current.innerHTML = incoming;
  }, [draft, studentId]);

  useEffect(() => {
    const node = editor.current;
    if (!node) return;
    const save = () => {
      node.querySelectorAll<HTMLElement>('p, div, h1, h2, h3, h4, blockquote, li, th, td').forEach(element => {
        if (!element.hasAttribute('dir')) element.setAttribute('dir', 'auto');
      });
      const html = cleanHtml(node.innerHTML);
      onDraftChange(html);
      setSaveState('saving');
      const timer = window.setTimeout(() => setSaveState('saved'), 650);
      return timer;
    };
    let timer: number | undefined;
    const handle = () => { if (timer) window.clearTimeout(timer); timer = save(); };
    node.addEventListener('input', handle);
    return () => { node.removeEventListener('input', handle); if (timer) window.clearTimeout(timer); };
  }, [onDraftChange]);

  const wordCount = useMemo(() => {
    const text = editor.current?.innerText || '';
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [draft]);
  const filtered = sources.filter(s => [s.author,s.title,s.publisher].join(' ').toLowerCase().includes(query.toLowerCase()));
  const plainDraft = draft
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/(p|div|h1|h2|h3|h4|li|blockquote)>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
  const sentenceRows = plainDraft.split(/(?<=[.!?؟؛])\s+|\n+/).map(value => value.trim()).filter(value => value.length > 8);

  const runProofread = () => {
    const issues: ReviewIssue[] = [];
    const addIssue = (category: ReviewIssue['category'], message: string, excerpt: string, replacement: string, reason: string, reference: string, confidence: ReviewIssue['confidence'] = 'مرتفعة') => {
      if (!excerpt || excerpt === replacement) return;
      issues.push({ id: category + '-' + issues.length + '-' + excerpt, category, message, excerpt, replacement, reason, reference, confidence });
    };
    let match: RegExpExecArray | null;
    const repeatedSpaces = / {2,}/g;
    while ((match = repeatedSpaces.exec(plainDraft))) addIssue('تنسيق', 'مسافات متكررة', match[0], ' ', 'تكرار المسافات داخل النص لا يضيف معنى وقد يخلّ بتنسيق الفقرة.', 'قاعدة تحريرية عامة للمسافات.');
    const spacesBeforePunctuation = /\s+([،؛.!؟:])/g;
    while ((match = spacesBeforePunctuation.exec(plainDraft))) addIssue('إملاء وترقيم', 'مسافة قبل علامة الترقيم', match[0], match[1], 'توضع علامة الترقيم ملاصقة للكلمة السابقة، لا تسبقها مسافة.', 'قواعد الترقيم العربية العامة.');
    const duplicatePunctuation = /([،؛.!؟:])\1+/g;
    while ((match = duplicatePunctuation.exec(plainDraft))) addIssue('إملاء وترقيم', 'تكرار علامة الترقيم', match[0], match[1], 'تكرار علامة الترقيم نفسها متتابعة غالبًا غير لازم في الكتابة الأكاديمية.', 'قواعد الترقيم والكتابة الأكاديمية.');
    const missingSpace = /([،؛.!؟:])(?=[\p{L}\p{N}])/gu;
    while ((match = missingSpace.exec(plainDraft))) addIssue('تنسيق', 'احتمال غياب مسافة بعد علامة الترقيم', plainDraft.slice(match.index, match.index + 2), match[1] + ' ', 'تُفصل العبارة التالية بمسافة بعد علامة الترقيم.', 'قواعد تحرير النصوص.');
    const repeatedWord = /\b([\p{L}\p{M}]{2,})\s+\1\b/giu;
    while ((match = repeatedWord.exec(plainDraft))) addIssue('تركيب', 'احتمال تكرار كلمة متتاليتين', match[0], match[1], 'قد يكون التكرار غير مقصود؛ راجع السياق قبل اعتماد التصحيح.', 'مراجعة تحريرية للسياق.', 'متوسطة');
    setReviewIssues(issues);
    setReviewRan(true);
  };

  const applyReviewIssue = (issue: ReviewIssue) => {
    if (!editor.current) return;
    const walker = document.createTreeWalker(editor.current, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    let applied = false;
    while ((node = walker.nextNode())) {
      const value = node.textContent || '';
      const index = value.indexOf(issue.excerpt);
      if (index < 0) continue;
      const before = node.splitText(index);
      before.splitText(issue.excerpt.length);
      const replacementNode = document.createTextNode(issue.replacement);
      before.parentNode?.replaceChild(replacementNode, before);
      applied = true;
      break;
    }
    if (applied) {
      onDraftChange(cleanHtml(editor.current.innerHTML));
      setReviewIssues(current => current.filter(item => item.id !== issue.id));
    }
  };

  function escapeHtml(value: string) {
    return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  const command = (name: string, value?: string) => {
    editor.current?.focus();
    document.execCommand(name, false, value);
    if (editor.current) onDraftChange(cleanHtml(editor.current.innerHTML));
  };

  const insertAtCursor = (value: string) => {
    editor.current?.focus();
    document.execCommand('insertText', false, value);
    if (editor.current) onDraftChange(cleanHtml(editor.current.innerHTML));
  };

  const saveSource = () => {
    if (!sourceForm || !sourceForm.author.trim() || !sourceForm.title.trim()) return;
    const saved = { ...sourceForm, id: sourceForm.id || crypto.randomUUID() };
    const next = sourceForm.id ? sources.map(s => s.id === saved.id ? saved : s) : [...sources, saved];
    setSources(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    setSourceForm(null);
  };

  const cite = () => {
    const source = sources.find(s => s.id === citationSource);
    if (!source) return;
    const citation = citationStyle === 'footnote'
      ? `( ${source.author}، ${source.title}${citationPage ? '، ص. ' + citationPage : ''} )`
      : `(${source.author}، ${source.year || 'د.ت.'}${citationPage ? '، ص. ' + citationPage : ''})`;
    if (sentenceReferenceMode && sentenceToCite && editor.current) {
      const walker = document.createTreeWalker(editor.current, NodeFilter.SHOW_TEXT);
      let textNode: Node | null;
      let inserted = false;
      while ((textNode = walker.nextNode())) {
        const value = textNode.textContent || '';
        const at = value.indexOf(sentenceToCite);
        if (at >= 0) {
          const range = document.createRange();
          range.setStart(textNode, at + sentenceToCite.length);
          range.collapse(true);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
          document.execCommand('insertText', false, ' ' + citation);
          inserted = true;
          break;
        }
      }
      if (!inserted) insertAtCursor(citation);
    } else insertAtCursor(citation);
    setModal(null);
    setCitationPage('');
    setSentenceToCite('');
    setSentenceReferenceMode(false);
  };

  const addFootnote = () => {
    if (!footnote.trim()) return;
    insertAtCursor(' [' + footnote.trim() + '] ');
    setFootnote('');
    setModal(null);
  };

  const insertReferences = () => {
    if (!sources.length) return;
    editor.current?.focus();
    document.execCommand('insertHTML', false, '<h2>قائمة المراجع</h2>' + sources.map(s => '<p>' + escapeHtml([s.author,s.year && '('+s.year+')',s.title,s.edition,s.place,s.publisher].filter(Boolean).join('. ')) + '.</p>').join(''));
    if (editor.current) onDraftChange(cleanHtml(editor.current.innerHTML));
  };

  const sectionHeading = (text: string) => {
    editor.current?.focus();
    document.execCommand('insertHTML', false, '<h2>' + text + '</h2><p><br></p>');
    if (editor.current) onDraftChange(cleanHtml(editor.current.innerHTML));
  };

  const typeLabel = (type: string) => t[type as keyof typeof t] || type;

  return <div className="thesis-workspace" dir="ltr">
    <div className="thesis-main">
      <div className="thesis-editor-card">
        <div className="thesis-docbar">
          <div className="thesis-docidentity"><span className="thesis-docicon"><BookOpen size={17}/></span><div><strong>{t.document}</strong><small dir="auto">{title || t.emptyTitle}</small></div></div>
          <div className="thesis-docstatus"><span className={saveState==='saved'?'save-dot':'save-dot saving-dot'}/>{saveState==='saved'?t.saved:t.saving}</div>
        </div>
        <div className="thesis-toolbar" aria-label={t.formatting} onMouseDown={event => { if ((event.target as HTMLElement).closest("button")) event.preventDefault(); }}>
          <div className="thesis-toolgroup">
            <button type="button" title={t.paragraph} onClick={()=>command('formatBlock','<p>')}>¶</button>
            <button type="button" title={t.chapter} onClick={()=>command('formatBlock','<h1>')}><Heading1 size={17}/></button>
            <button type="button" title={t.section} onClick={()=>command('formatBlock','<h2>')}><Heading2 size={17}/></button>
          </div>
          <span className="thesis-tool-divider"/>
          <div className="thesis-toolgroup">
            <button type="button" title="Bold" onClick={()=>command('bold')}><Bold size={16}/></button>
            <button type="button" title="Italic" onClick={()=>command('italic')}><Italic size={16}/></button>
            <button type="button" title="Underline" onClick={()=>command('underline')}><Underline size={16}/></button>
          </div>
          <span className="thesis-tool-divider"/>
          <div className="thesis-toolgroup">
            <button type="button" title="Bulleted list" onClick={()=>command('insertUnorderedList')}><List size={16}/></button>
            <button type="button" title="Numbered list" onClick={()=>command('insertOrderedList')}><ListOrdered size={16}/></button>
            <button type="button" title="Quote" onClick={()=>command('formatBlock','<blockquote>')}><Quote size={16}/></button>
          </div>
          <span className="thesis-tool-divider"/>
          <div className="thesis-toolgroup">
            <button type="button" title="Align right" onClick={()=>command('justifyRight')}><AlignRight size={16}/></button>
            <button type="button" title="Align center" onClick={()=>command('justifyCenter')}><AlignCenter size={16}/></button>
            <button type="button" title="Align left" onClick={()=>command('justifyLeft')}><AlignLeft size={16}/></button>
          </div>
          <select aria-label={t.textDirection} value={direction} onChange={e=>{setDirection(e.target.value);if(editor.current)editor.current.dir=e.target.value;}} className="thesis-direction">
            <option value="rtl">{t.rtl}</option><option value="ltr">{t.ltr}</option>
          </select>
        </div>
        <div className="thesis-paper-wrap">
          <div className="thesis-paper-meta"><span>{t.autosave}</span><span>{wordCount} {t.words}</span></div>
          <div
            ref={editor}
            className="thesis-paper"
            contentEditable
            spellCheck={false}
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label={t.document}
            dir={direction}
            lang={lang}
            data-placeholder={t.emptyHint}
            onBlur={()=>{if(editor.current)onDraftChange(cleanHtml(editor.current.innerHTML));}}
          />
          <div className="thesis-paper-tip">{t.editorTip}</div>
          <section className="thesis-sentence-references" aria-label="إضافة مراجع للجمل">
            <div className="thesis-sentence-head"><strong>توثيق الجمل</strong><span>أضف مرجعًا عند الحاجة</span></div>
            {sentenceRows.length===0 ? <p>ستظهر هنا الجمل المكتوبة لتتمكن من إرفاق مرجع بكل جملة.</p> : sentenceRows.map((sentence,index)=><div className="thesis-sentence-row" key={index}>
              <span dir="auto">{sentence}</span>
              <button type="button" title="إضافة مرجع لهذه الجملة" aria-label={'إضافة مرجع للجملة '+(index+1)} onClick={()=>{setSentenceToCite(sentence);setSentenceReferenceMode(true);setCitationSource('');setModal('citation');}}>+</button>
            </div>)}
          </section>
          <section className="thesis-proofread-panel">
            <div className="thesis-proofread-head">
              <div><strong>المراجعة الأولية للمسودة</strong><small>افحص المسافات والترقيم والتكرارات التحريرية</small></div>
              <button type="button" onClick={runProofread}>فحص المسودة</button>
            </div>
            {!reviewRan ? <p className="thesis-proofread-empty">اضغط «فحص المسودة» لعرض الملاحظات الأولية. لا يُعد هذا فحصًا نحويًا أو دلاليًا شاملًا.</p> :
              reviewIssues.length===0 ? <p className="thesis-proofread-empty">لم تُكتشف مخالفات في قواعد التنسيق الأولية التي يفحصها هذا الإصدار.</p> :
              <div className="thesis-proofread-list">{reviewIssues.map(issue=><article className="thesis-proofread-issue" key={issue.id}>
                <div className="thesis-proofread-issue-top"><span>{issue.category}</span><small>ثقة {issue.confidence}</small></div>
                <strong>{issue.message}</strong>
                <p dir="auto">الموضع: «{issue.excerpt}»</p>
                <p>{issue.reason}</p>
                <small>مرجع القاعدة: {issue.reference}</small>
                <div><button type="button" onClick={()=>applyReviewIssue(issue)}>قبول التصحيح: «{issue.replacement}»</button><button type="button" onClick={()=>setReviewIssues(current=>current.filter(item=>item.id!==issue.id))}>تجاهل</button></div>
              </article>)}</div>}
            <p className="thesis-proofread-note">المراجعة النحوية والتركيبية والدلالية المتقدمة، مع إحالة كل حكم إلى مرجع لغوي محدد، تحتاج إلى محرك متخصص وقاعدة مراجع موثقة؛ لن نصنّف اقتراحًا آليًا على أنه خطأ مؤكد قبل توفير ذلك.</p>
          </section>
        </div>
        <div className="thesis-editor-footer"><span>{t.demoStorage}</span><button type="button" className="btn btn-teal" onClick={()=>{if(editor.current)onDraftChange(cleanHtml(editor.current.innerHTML));onSave(editor.current ? cleanHtml(editor.current.innerHTML) : draft);}}><Save size={15}/>{t.saved}</button></div>
      </div>
    </div>
    <aside className="thesis-sidebar" dir={rtl?'rtl':'ltr'}>
      <div className="thesis-side-tabs">
        <button className={tab==='outline'?'active':''} onClick={()=>setTab('outline')}><List size={15}/>{t.outline}</button>
        <button className={tab==='sources'?'active':''} onClick={()=>setTab('sources')}><BookMarked size={15}/>{t.sources}</button>
      </div>
      {tab==='outline' ? <div className="thesis-side-content">
        <div className="thesis-side-heading"><strong>{t.outline}</strong><span>01</span></div>
        <button className="thesis-outline-item" onClick={()=>sectionHeading(lang==='ar'?'مقدمة':lang==='fr'?'Introduction':'Introduction')}>01 · {lang==='ar'?'مقدمة':'Introduction'}</button>
        <button className="thesis-outline-item" onClick={()=>sectionHeading(lang==='ar'?'الفصل الأول':lang==='fr'?'Chapitre I':'Chapter I')}>02 · {lang==='ar'?'الفصل الأول':'Chapter I'}</button>
        <button className="thesis-outline-item" onClick={()=>sectionHeading(lang==='ar'?'المبحث الأول':lang==='fr'?'Section I':'Section I')}>03 · {lang==='ar'?'المبحث الأول':'Section I'}</button>
        <button className="thesis-outline-item" onClick={()=>sectionHeading(lang==='ar'?'خاتمة':lang==='fr'?'Conclusion':'Conclusion')}>04 · {lang==='ar'?'خاتمة':'Conclusion'}</button>
        <div className="thesis-side-note">{t.editorTip}</div>
      </div> : <div className="thesis-side-content">
        <div className="thesis-source-heading"><div><strong>{t.sources}</strong><small>{sources.length} {t.sourcesCount}</small></div><button className="thesis-add-source" onClick={()=>setSourceForm(emptySource())}><Plus size={15}/>{t.addSource}</button></div>

        <div className="thesis-discovery">
          <div className="thesis-discovery-title"><strong>اقتراح مصادر أكاديمية للموضوع</strong><span>OpenAlex · Crossref</span></div>
          <input aria-label="موضوع البحث عن المراجع" value={topicSearch} onChange={e=>setTopicSearch(e.target.value)} placeholder="اكتب عنوان المذكرة أو كلمات مفتاحية..."/>
          <div className="thesis-discovery-actions">
            <button type="button" onClick={()=>void searchAcademicSources(topicSearch)} disabled={suggestionLoading}><Search size={13}/>{suggestionLoading?'جارٍ البحث...':'اقتراح مصادر'}</button>
            <button type="button" onClick={()=>window.open('https://www.google.com/search?q='+encodeURIComponent(topicSearch.trim()),'_blank','noopener,noreferrer')} disabled={!topicSearch.trim()}>البحث في Google <span>↗</span></button>
          </div>
          <p className="thesis-source-disclaimer">هذه سجلات ببليوغرافية مفهرسة وليست ضمانًا للتحكيم العلمي. تحقّق من المجلة أو الجامعة والنص الأصلي قبل اعتماد المرجع. لا تُدرج النتائج في مراجعك إلا باختيارك.</p>
          {suggestionError && <p className="thesis-discovery-message">{suggestionError}</p>}
          {suggestions.length>0 && <div className="thesis-suggestion-list">
            {suggestions.map(item=><article className="thesis-suggestion-card" key={item.id}>
              <span>{item.type==='book'?'كتاب':item.type==='thesis'?'رسالة جامعية':'مقال / بحث'} · {item.provider}</span>
              <strong>{item.title}</strong>
              <small>{item.author}{item.year?' · '+item.year:''}{item.publisher?' · '+item.publisher:''}</small>
              <div><button type="button" onClick={()=>addSuggestedSource(item)}>+ إضافة إلى مكتبتي</button>{item.url && <a href={item.url} target="_blank" rel="noreferrer">فتح المصدر ↗</a>}</div>
            </article>)}
          </div>}
        </div>
        <label className="thesis-search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/></label>
        <div className="thesis-source-list">
          {filtered.length===0?<p className="thesis-empty">{t.noSources}</p>:filtered.map(source=><article className="thesis-source-card" key={source.id}>
            <div className="thesis-source-type">{typeLabel(source.type)}</div><strong>{source.title}</strong><p>{source.author}{source.year?' · '+source.year:''}</p>
            <div className="thesis-source-actions"><button onClick={()=>{setCitationSource(source.id);setModal('citation');}}>{t.insertCitation}</button><button aria-label={t.edit} onClick={()=>setSourceForm(source)}>{t.edit}</button><button aria-label={t.delete} onClick={()=>{const next=sources.filter(s=>s.id!==source.id);setSources(next);localStorage.setItem(storageKey,JSON.stringify(next));}}><Trash2 size={13}/></button></div>
          </article>)}
        </div>
        <button className="thesis-bibliography" onClick={insertReferences}><BookMarked size={15}/>{t.generate}</button>
      </div>}
    </aside>

    {sourceForm && <div className="thesis-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSourceForm(null);}}>
      <section className="thesis-modal" dir={rtl?'rtl':'ltr'}>
        <div className="thesis-modal-head"><div><strong>{sourceForm.id?t.edit:t.addSource}</strong><small>{t.sources}</small></div><button onClick={()=>setSourceForm(null)}><X size={18}/></button></div>
        <div className="thesis-source-form">
          <label>{t.sourceType}<select value={sourceForm.type} onChange={e=>setSourceForm({...sourceForm,type:e.target.value})}>{['book','article','thesis','website','manuscript','report','other'].map(type=><option key={type} value={type}>{typeLabel(type)}</option>)}</select></label>
          {(['author','title','year','publisher','place','edition','editor','url','accessed','note'] as const).map(key=><label key={key}>{t[key]}<input value={sourceForm[key]} onChange={e=>setSourceForm({...sourceForm,[key]:e.target.value})}/></label>)}
        </div>
        <div className="thesis-modal-actions"><button className="btn btn-outline" onClick={()=>setSourceForm(null)}>{t.cancel}</button><button className="btn btn-teal" onClick={saveSource}>{t.saveSource}</button></div>
      </section>
    </div>}
    {modal && <div className="thesis-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(null);}}>
      <section className="thesis-modal thesis-citation-modal" dir={rtl?'rtl':'ltr'}>
        <div className="thesis-modal-head"><div><strong>{modal==='citation'?t.insertCitation:t.insertFootnote}</strong><small>{modal==='citation'?t.citationHelp:t.footnoteText}</small></div><button onClick={()=>setModal(null)}><X size={18}/></button></div>
        {modal==='citation' ? <>
          {sentenceReferenceMode && <p className="thesis-citation-target" dir="auto">الجملة المحددة: {sentenceToCite}</p>}
          <div className="thesis-source-form">
          <label>{t.chooseSource}<select value={citationSource} onChange={e=>setCitationSource(e.target.value)}><option value="">—</option>{sources.map(s=><option key={s.id} value={s.id}>{s.author} — {s.title}</option>)}</select></label>
          <label>{t.page}<input value={citationPage} onChange={e=>setCitationPage(e.target.value)} placeholder="25"/></label>
          <label>{t.citationStyle}<select value={citationStyle} onChange={e=>setCitationStyle(e.target.value)}><option value="author-date">Author — date</option><option value="footnote">Full footnote reference</option></select></label>
          </div>
        </> : <label className="thesis-footnote-label">{t.footnoteText}<textarea value={footnote} onChange={e=>setFootnote(e.target.value)} rows={4}/></label>}
        <div className="thesis-modal-actions"><button className="btn btn-outline" onClick={()=>setModal(null)}>{t.cancel}</button><button className="btn btn-teal" onClick={modal==='citation'?cite:addFootnote}>{t.insert}</button></div>
      </section>
    </div>}
  </div>;
}
