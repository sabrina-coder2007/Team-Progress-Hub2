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
          if (attr.name !== 'href' || el.tagName !== 'A' || !/^https?:\/\//i.test(attr.value)) el.removeAttribute(attr.name);
        });
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
  const [query, setQuery] = useState('');
  const [sourceForm, setSourceForm] = useState<Source | null>(null);
  const [citationSource, setCitationSource] = useState('');
  const [citationPage, setCitationPage] = useState('');
  const [citationStyle, setCitationStyle] = useState('author-date');
  const [footnote, setFootnote] = useState('');
  const [modal, setModal] = useState<'citation'|'footnote'|null>(null);
  const [saveState, setSaveState] = useState<'saved'|'saving'>('saved');
  const [direction, setDirection] = useState(rtl ? 'rtl' : 'ltr');

  const storageKey = 'leeder-sources-v1-' + studentId;
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
    insertAtCursor(citation);
    setModal(null);
    setCitationPage('');
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
        <div className="thesis-toolbar" aria-label={t.formatting}>
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
        {modal==='citation' ? <div className="thesis-source-form">
          <label>{t.chooseSource}<select value={citationSource} onChange={e=>setCitationSource(e.target.value)}><option value="">—</option>{sources.map(s=><option key={s.id} value={s.id}>{s.author} — {s.title}</option>)}</select></label>
          <label>{t.page}<input value={citationPage} onChange={e=>setCitationPage(e.target.value)} placeholder="25"/></label>
          <label>{t.citationStyle}<select value={citationStyle} onChange={e=>setCitationStyle(e.target.value)}><option value="author-date">Author — date</option><option value="footnote">Full footnote reference</option></select></label>
        </div> : <label className="thesis-footnote-label">{t.footnoteText}<textarea value={footnote} onChange={e=>setFootnote(e.target.value)} rows={4}/></label>}
        <div className="thesis-modal-actions"><button className="btn btn-outline" onClick={()=>setModal(null)}>{t.cancel}</button><button className="btn btn-teal" onClick={modal==='citation'?cite:addFootnote}>{t.insert}</button></div>
      </section>
    </div>}
  </div>;
}
