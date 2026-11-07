import type { Dispatch, FormEvent, SetStateAction } from 'react';

type RegistrationAccess = { name: string; email: string; institution: string; faculty: string; department: string; specialization: string; year: string; title: string; password: string };
type RegistrationFieldsProps = {
  registrationRole: 'student' | 'supervisor';
  setRegistrationRole: (role: 'student' | 'supervisor') => void;
  institutions: { id: string; name: string; departments: string[] }[];
  access: RegistrationAccess;
  setAccess: Dispatch<SetStateAction<RegistrationAccess>>;
  t: (key: string) => string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function RegistrationFields({ registrationRole, setRegistrationRole, institutions, access, setAccess, t, onSubmit, onCancel }: RegistrationFieldsProps) {
  const set = (key: keyof RegistrationAccess, value: string) => setAccess(old => ({ ...old, [key]: value }));
  const selectedInstitution = institutions.find(institution => institution.name === access.institution);
  return <form className="access-form" onSubmit={onSubmit}>
    <label className="field"><span>{t('registrationRole')}</span><select data-testid="select-registration-role" value={registrationRole} onChange={event => {const next=event.target.value as 'student'|'supervisor';setRegistrationRole(next);if(next==='supervisor')set('password','');}}><option value="student">{t('studentRegistration')}</option><option value="supervisor">{t('supervisorRegistration')}</option></select></label>
    <label className="field"><span>{t('fullName')}</span><input data-testid="input-registration-name" autoComplete="name" value={access.name} onChange={event => set('name', event.target.value)} required /></label>
    <label className="field"><span>{t('email')}</span><input data-testid="input-registration-email" type="email" dir="ltr" autoComplete="email" value={access.email} onChange={event => set('email', event.target.value)} required /></label>
    <small className="section-caption">{t('officialEmailNote')}</small>
    <label className="field"><span>{t('institution')}</span><select data-testid="input-registration-institution" value={access.institution} onChange={event => {
      const name=event.target.value;
      const institution=institutions.find(item=>item.name===name);
      setAccess(old=>({...old,institution:name,department:institution?.departments[0]||''}));
    }} required>{institutions.map(institution=><option key={institution.id} value={institution.name}>{institution.name}</option>)}</select></label>
    {registrationRole === 'student' && <label className="field"><span>{t('faculty')}</span><input data-testid="input-registration-faculty" value={access.faculty} onChange={event => set('faculty', event.target.value)} required /></label>}
    <label className="field"><span>{t('departmentField')}</span><select data-testid="input-registration-department" value={access.department} onChange={event => set('department', event.target.value)} required>
      <option value="">{t('chooseDepartment')}</option>
      {(selectedInstitution?.departments||[]).map(department=><option key={department} value={department}>{department}</option>)}
    </select>{!selectedInstitution?.departments.length&&<small className="section-caption">{t('noDepartments')}</small>}</label>
    <label className="field"><span>{t('specialization')}</span><input data-testid="input-registration-specialization" value={access.specialization} onChange={event => set('specialization', event.target.value)} required /></label>
    {registrationRole === 'student' && <label className="field"><span>{t('academicYear')}</span><input data-testid="input-registration-year" value={access.year} onChange={event => set('year', event.target.value)} required /></label>}
    {registrationRole === 'student' && <label className="field"><span>{t('password')}</span><input data-testid="input-registration-password" type="password" dir="ltr" autoComplete="new-password" value={access.password} onChange={event => set('password', event.target.value)} required /><small className="section-caption">{t('passwordNote')}</small></label>}
    {registrationRole === 'supervisor' && <label className="field"><span>{t('academicTitle')}</span><input data-testid="input-registration-title" value={access.title} onChange={event => set('title', event.target.value)} required /></label>}
    <div className="callout">{registrationRole === 'student' ? t('verificationPending') : t('supervisorPending')} {t('notSecurity')}</div>
    <div className="access-actions"><button type="submit" className="btn btn-primary" data-testid="button-complete-registration">{t('continue')}</button><button type="button" className="btn btn-outline" onClick={onCancel} data-testid="button-cancel-registration">{t('cancel')}</button></div>
  </form>;
}
