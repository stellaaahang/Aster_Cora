import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { moduleReturn } from '../config/technology';
import Icon from '../components/Icon';
import ContactVisual from '../components/contact/ContactVisual';
import '../styles/aster-detail.css';
import '../styles/contact.css';

const recipient = import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'aster.cora@outlook.com';
const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim() || `https://formsubmit.co/ajax/${recipient}`;
const usesFormSubmit = endpoint.startsWith('https://formsubmit.co/ajax/');
const fields = ['name', 'email', 'organization', 'type', 'message'] as const;
const inquiryTypes = ['general', 'modules', 'research', 'education', 'other'] as const;
type Field = typeof fields[number];
type ErrorCode = 'required' | 'invalidEmail';
type Feedback = 'sending' | 'success' | 'failed' | 'activation';

export default function Contact() {
  const { t } = useI18n();
  const c = t.contact;
  const [params] = useSearchParams();
  const fromModules = params.get('from') === 'modules';
  const [form, setForm] = useState<Record<Field, string>>(() => ({ name: '', email: '', organization: '', type: fromModules ? 'modules' : 'general', message: '' }));
  const [errors, setErrors] = useState<Partial<Record<Field, ErrorCode>>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const submitting = useRef(false);
  const hint = form.type === 'modules' ? c.modulesHint : c.generalHint;

  function update(field: Field, value: string) {
    setForm(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
    if (feedback !== 'sending') setFeedback(null);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const invalid: Partial<Record<Field, ErrorCode>> = {};
    for (const field of fields) {
      if (field !== 'organization' && !form[field].trim()) invalid[field] = 'required';
    }
    const email = form.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid.email = 'invalidEmail';
    setErrors(invalid);
    const first = fields.find(field => invalid[field]);
    if (first) {
      setFeedback(null);
      (event.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    submitting.current = true;
    setFeedback('sending');
    try {
      const message = { ...form, name: form.name.trim(), email, organization: form.organization.trim(), message: form.message.trim() };
      const type = c.types[form.type as keyof typeof c.types];
      const payload = usesFormSubmit ? {
        ...message, type, _subject: `Aster / Cora — ${type}`,
        _replyto: email, _template: 'table', _url: window.location.href,
      } : message;
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(20000),
      });
      if (response.status === 204 && response.ok) {
        setFeedback('success');
        return;
      }
      const receipt = await response.json();
      if (usesFormSubmit && typeof receipt.message === 'string'
        && /activat|confirm.*(?:email|form)/i.test(receipt.message)) {
        setFeedback('activation');
        return;
      }
      const accepted = receipt.ok === true || receipt.success === true || (usesFormSubmit && receipt.success === 'true');
      if (!response.ok || !accepted) throw new Error('Delivery was not confirmed');
      setFeedback('success');
    } catch { setFeedback('failed'); }
    finally { submitting.current = false; }
  }
  return (
    <section className="aster-detail aster-contact" aria-labelledby="contact-title">
      <div className="container">
        <Link className="aster-back" to={fromModules ? moduleReturn : '/about'}><Icon name="arrow" size={17}/>{fromModules ? c.backModules : c.backAbout}</Link>
        <div className="aster-contact-grid">
          <ContactVisual/>
          <div className="aster-contact-panel">
            <header className="aster-detail-heading">
              <h1 id="contact-title">{c.title}</h1><p>{hint}</p>
              <a className="aster-contact-email" href={`mailto:${recipient}`}>{recipient}</a>
            </header>
            <form className="aster-contact-form" noValidate onSubmit={submit} aria-label={c.title} aria-busy={feedback === 'sending'}>
              {fields.map(field => {
                const inputProps = {
                  id: `contact-${field}`, name: field, value: form[field], required: field !== 'organization',
                  'aria-invalid': !!errors[field], 'aria-describedby': errors[field] ? `contact-error-${field}` : undefined,
                  disabled: feedback === 'sending',
                };
                return <div className={`aster-contact-field contact-${field}`} key={field}>
                  <label htmlFor={inputProps.id}>{c[field]}{field === 'organization' && <small> · {c.optional}</small>}</label>
                  {field === 'type' ? <select {...inputProps} onChange={event => update(field, event.target.value)}>
                    {inquiryTypes.map(type => <option key={type} value={type}>{c.types[type]}</option>)}
                  </select> : field === 'message' ? <textarea {...inputProps} rows={5} placeholder={hint} onChange={event => update(field, event.target.value)}/>
                    : <input {...inputProps} type={field === 'email' ? 'email' : 'text'} autoComplete={field === 'organization' ? 'organization' : field} onChange={event => update(field, event.target.value)}/>}
                  {errors[field] && <small id={`contact-error-${field}`} className="aster-contact-error" role="alert">{c[errors[field]]}</small>}
                </div>;
              })}
              {feedback && <p className="aster-contact-notice" role="status">{c[feedback]}</p>}
              <button type="submit" className="button primary" disabled={feedback === 'sending' || feedback === 'success'}>
                {feedback === 'sending' ? c.sending : c.send}<Icon name="arrow" size={17}/>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
