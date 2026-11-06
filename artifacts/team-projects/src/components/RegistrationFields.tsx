import type { Dispatch, FormEvent, SetStateAction } from 'react';

type RegistrationAccess = { name: string; email: string; institution: string; department: string; specialization: string; year: string; title: string; password: string };
type RegistrationFieldsProps = {
  registrationRole: 'student' | 'supervisor';
  setRegistrationRole: (role: 'student' | 'supervisor') => void;
  access: RegistrationAccess;
  setAccess: Dispatch<SetStateAction<RegistrationAccess>>;
  t: (key: string) => string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function RegistrationFields({ registrationRole, setRegistrationRole, access, setAccess, t, onSubmit, onCancel }: RegistrationFieldsProps) {
  const set = (key: keyof RegistrationAccess, value: string) => setAccess(old => ({ ...old, [key]: value }));
  return <form className="access-form" onSubmit={onSubmit}>
    <label className="field"><span>{t('registrationRole')}</span><select data-testid="select-registration-role" value={registrationRole} onChange={event => setRegistrationRole(event.target.value as 'student' | 'supervisor')}><option value="student">{t('studentRegistration')}</option><option value="supervisor">{t('supervisorRegistration')}</option></select></label>
    <label className="field"><span>{t('fullName')}</span><input data-testid="input-registration-name" autoComplete="name" value={access.name} onChange={event => set('name', event.target.value)} required /></label>
    <label className="field"><span>{t('email')}</span><input data-testid="input-registration-email" type="email" autoComplete="email" value={access.email} onChange={event => set('email', event.target.value)} required /></label>
    <small className="section-caption">{t('officialEmailNote')}</small>
    <label className="field"><span>{t('institution')}</span><input data-testid="input-registration-institution" value={access.institution} onChange={event => set('institution', event.target.value)} required /></label>
    <label className="field"><span>{t('departmentField')}</span><input data-testid="input-registration-department" value={access.department} onChange={event => set('department', event.target.value)} required /></label>
    <label className="field"><span>{t('specialization')}</span><input data-testid="input-registration-specialization" value={access.specialization} onChange={event => set('specialization', event.target.value)} required /></label>
    <label className="field"><span>{t('academicYear')}</span><input data-testid="input-registration-year" value={access.year} onChange={event => set('year', event.target.value)} required /></label>
    {registrationRole === 'student' && <label className="field"><span>{t('password')}</span><input data-testid="input-registration-password" type="password" autoComplete="new-password" value={access.password} onChange={event => set('password', event.target.value)} required /></label>}
    {registrationRole === 'supervisor' && <label className="field"><span>{t('academicTitle')}</span><input data-testid="input-registration-title" value={access.title} onChange={event => set('title', event.target.value)} required /></label>}
    <div className="callout">{registrationRole === 'student' ? t('verificationPending') : t('supervisorPending')} {t('notSecurity')}</div>
    <div className="access-actions"><button type="submit" className="btn btn-primary" data-testid="button-complete-registration">{t('continue')}</button><button type="button" className="btn btn-outline" onClick={onCancel} data-testid="button-cancel-registration">{t('cancel')}</button></div>
  </form>;
}
