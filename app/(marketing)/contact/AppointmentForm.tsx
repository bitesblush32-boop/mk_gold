'use client';

import { useState, useEffect } from 'react';
import { BRANCHES } from '@/lib/branch-router';
import type { Branch } from '@/lib/branch-router';

type City = Branch['city'];
const CITIES: City[] = ['Bangalore', 'Mysore', 'Mangalore', 'Davangere'];

const GOLD_TYPES = [
  'Jewellery',
  'Coins',
  'Bars',
  'Mixed / Not sure',
];

const TIME_SLOTS = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
];

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

interface FormState {
  name: string;
  phone: string;
  city: City | '';
  branch_slug: string;
  gold_type: string;
  slot_date: string;
  slot_time: string;
}

interface Errors {
  name?: string;
  phone?: string;
  city?: string;
  branch_slug?: string;
  slot_date?: string;
  slot_time?: string;
}

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Name is required';
  if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\s/g, '')))
    e.phone = 'Enter a valid 10-digit Indian mobile number';
  if (!f.city) e.city = 'Select a city';
  if (!f.branch_slug) e.branch_slug = 'Select a branch';
  if (!f.slot_date) {
    e.slot_date = 'Select a date';
  } else if (f.slot_date < todayISO()) {
    e.slot_date = 'Date cannot be in the past';
  }
  if (!f.slot_time) e.slot_time = 'Select a time slot';
  return e;
}

export function AppointmentForm() {
  const [form, setForm]       = useState<FormState>({
    name: '', phone: '', city: '', branch_slug: '',
    gold_type: '', slot_date: '', slot_time: '',
  });
  const [errors, setErrors]   = useState<Errors>({});
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading]  = useState(false);
  const [success, setSuccess]  = useState(false);
  const [serverErr, setServerErr] = useState('');

  // Recompute branch list whenever city changes
  useEffect(() => {
    if (form.city) {
      setBranches(BRANCHES.filter(b => b.city === form.city));
    } else {
      setBranches([]);
    }
    // Reset branch selection when city changes
    setForm(prev => ({ ...prev, branch_slug: '' }));
  }, [form.city]);

  function set(key: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key as keyof Errors]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setServerErr('');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:       form.name.trim(),
          phone:      form.phone.replace(/\s/g, ''),
          branch_slug: form.branch_slug,
          slot_date:  form.slot_date,
          slot_time:  form.slot_time,
          notes:      form.gold_type ? `Gold type: ${form.gold_type}` : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }
      setSuccess(true);
    } catch (err) {
      setServerErr(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    const branch = BRANCHES.find(b => b.slug === form.branch_slug);
    return (
      <div className="mk-appt-success reveal in">
        <div className="mk-appt-success__check" aria-hidden="true">✓</div>
        <h3 className="mk-appt-success__title">Appointment Requested</h3>
        <p className="mk-appt-success__body">
          Thank you, <strong>{form.name}</strong>. We&apos;ve received your slot request for{' '}
          <strong>{form.slot_date}</strong> at <strong>{form.slot_time}</strong>
          {branch ? ` at our ${branch.area} branch` : ''}.
          Our team will confirm via WhatsApp or call within a few hours.
        </p>
        <p className="mk-appt-success__note">
          Walk-ins are always welcome — no appointment needed.
        </p>
      </div>
    );
  }

  return (
    <form className="mk-appt-form" onSubmit={handleSubmit} noValidate>
      {/* Row 1: Name + Phone */}
      <div className="mk-appt-form__row">
        <div className="mk-appt-form__field">
          <label className="mk-appt-form__label" htmlFor="appt-name">
            Full Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="appt-name"
            type="text"
            className={`mk-input${errors.name ? ' mk-input--error' : ''}`}
            placeholder="Your name"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            autoComplete="name"
          />
          {errors.name && <p className="mk-appt-form__error">{errors.name}</p>}
        </div>

        <div className="mk-appt-form__field">
          <label className="mk-appt-form__label" htmlFor="appt-phone">
            Mobile Number <span aria-hidden="true">*</span>
          </label>
          <input
            id="appt-phone"
            type="tel"
            className={`mk-input${errors.phone ? ' mk-input--error' : ''}`}
            placeholder="10-digit Indian number"
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel"
          />
          {errors.phone && <p className="mk-appt-form__error">{errors.phone}</p>}
        </div>
      </div>

      {/* Row 2: City + Branch */}
      <div className="mk-appt-form__row">
        <div className="mk-appt-form__field">
          <label className="mk-appt-form__label" htmlFor="appt-city">
            City <span aria-hidden="true">*</span>
          </label>
          <select
            id="appt-city"
            className={`mk-select${errors.city ? ' mk-select--error' : ''}`}
            value={form.city}
            onChange={e => set('city', e.target.value as City)}
          >
            <option value="">Select city</option>
            {CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.city && <p className="mk-appt-form__error">{errors.city}</p>}
        </div>

        <div className="mk-appt-form__field">
          <label className="mk-appt-form__label" htmlFor="appt-branch">
            Branch <span aria-hidden="true">*</span>
          </label>
          <select
            id="appt-branch"
            className={`mk-select${errors.branch_slug ? ' mk-select--error' : ''}`}
            value={form.branch_slug}
            onChange={e => set('branch_slug', e.target.value)}
            disabled={!form.city}
          >
            <option value="">{form.city ? 'Select branch' : 'Select city first'}</option>
            {branches.map(b => (
              <option key={b.slug} value={b.slug}>{b.area}</option>
            ))}
          </select>
          {errors.branch_slug && <p className="mk-appt-form__error">{errors.branch_slug}</p>}
        </div>
      </div>

      {/* Row 3: Gold type (optional) */}
      <div className="mk-appt-form__field">
        <label className="mk-appt-form__label" htmlFor="appt-gold">
          Gold Type <span className="mk-appt-form__optional">(optional)</span>
        </label>
        <select
          id="appt-gold"
          className="mk-select"
          value={form.gold_type}
          onChange={e => set('gold_type', e.target.value)}
        >
          <option value="">Select gold type</option>
          {GOLD_TYPES.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Row 4: Date + Time */}
      <div className="mk-appt-form__row">
        <div className="mk-appt-form__field">
          <label className="mk-appt-form__label" htmlFor="appt-date">
            Preferred Date <span aria-hidden="true">*</span>
          </label>
          <input
            id="appt-date"
            type="date"
            className={`mk-input${errors.slot_date ? ' mk-input--error' : ''}`}
            value={form.slot_date}
            min={todayISO()}
            onChange={e => set('slot_date', e.target.value)}
          />
          {errors.slot_date && <p className="mk-appt-form__error">{errors.slot_date}</p>}
        </div>

        <div className="mk-appt-form__field">
          <label className="mk-appt-form__label" htmlFor="appt-time">
            Preferred Time <span aria-hidden="true">*</span>
          </label>
          <select
            id="appt-time"
            className={`mk-select${errors.slot_time ? ' mk-select--error' : ''}`}
            value={form.slot_time}
            onChange={e => set('slot_time', e.target.value)}
          >
            <option value="">Select time slot</option>
            {TIME_SLOTS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.slot_time && <p className="mk-appt-form__error">{errors.slot_time}</p>}
        </div>
      </div>

      {serverErr && (
        <p className="mk-appt-form__server-error">{serverErr}</p>
      )}

      <button
        type="submit"
        className="btn btn-gold mk-appt-form__submit"
        disabled={loading}
      >
        {loading ? 'Requesting Slot…' : 'Request Appointment'}
      </button>

      <p className="mk-appt-form__footnote">
        Walk-ins always welcome · No appointment required
      </p>
    </form>
  );
}
