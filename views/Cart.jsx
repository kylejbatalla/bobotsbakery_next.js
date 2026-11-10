'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ORDER_ENDPOINT, ORDERING_CLOSED, CLOSED_MESSAGE } from '@/lib/config';
import { fmt } from '@/lib/menu';
import { useCart } from '@/components/CartContext';
import QtyStepper from '@/components/QtyStepper';

const NOTES_MAX = 100;

const DISABLED_DATES = ['2026-05-09','2026-05-10','2026-05-25','2026-05-26','2026-05-27','2026-05-28',
  '2026-05-29','2026-05-30','2026-05-31','2026-08-03','2026-08-04','2026-08-05','2026-08-06',
  '2026-08-07','2026-08-08','2026-08-09'];

const EMPTY_FORM = { name: '', phone: '', email: '', pickupDate: '', payment: '', notes: '' };

const STATUS_STYLES = {
  success: { background: '#e6f4ea', border: '2px solid #2e7d32', color: '#1b4d1f' },
  error:   { background: '#fde2e2', border: '2px solid #ce1126', color: '#5c3a1e' },
  info:    { background: '#fff3cd', border: '2px solid #fcd116', color: '#5c3a1e' },
  loading: { background: '#fff8db', border: '2px solid #fcd116', color: '#5c3a1e' },
};

const linkStyle = { color: 'var(--flag-red)', fontWeight: 600 };

// Same logic as your script.js: after 12 PM Pacific, earliest pickup is +2 days, else +1
function getMinPickupDate() {
  const now = new Date();
  const hour = parseInt(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', hour: 'numeric', hour12: false,
  }).format(now), 10);
  const d = new Date(now);
  d.setDate(d.getDate() + (hour >= 12 ? 2 : 1));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function todayPacific() {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    let y = '', m = '', d = '';
    parts.forEach(p => { if (p.type === 'year') y = p.value; if (p.type === 'month') m = p.value; if (p.type === 'day') d = p.value; });
    if (y && m && d) return `${y}-${m}-${d}`;
  } catch { /* fall through */ }
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}

function StatusBox({ status, statusRef }) {
  if (!status) return null;
  return (
    <div ref={statusRef} style={{ display: 'block', padding: '1rem 1.2rem', borderRadius: 8,
                                  marginBottom: '1rem', ...STATUS_STYLES[status.kind] }}>
      {status.content}
    </div>
  );
}

export default function Cart() {
  const { cart, lines, total, setQty, remove, clear } = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState(null);           // { kind, content }
  const [paymentError, setPaymentError] = useState(false);
  const [sending, setSending] = useState(false);

  const minDate = useMemo(() => getMinPickupDate(), []);
  const statusRef = useRef(null);
  const paymentRef = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    if (status) statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [status]);

  const setField = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const fail = (content, focusField) => {
    setStatus({ kind: 'error', content });
    const refs = { name: nameRef, phone: phoneRef, email: emailRef };
    if (focusField) refs[focusField].current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ORDERING_CLOSED) return fail(<><strong>Ordering is closed.</strong> {CLOSED_MESSAGE}</>);

    const items = Object.fromEntries(Object.entries(cart).filter(([, n]) => n > 0));
    if (Object.keys(items).length === 0)
      return fail(<><strong>Hold on —</strong> your cart is empty. <Link href="/order" style={linkStyle}>Add some items</Link> first.</>);

    const name = form.name.trim(), phone = form.phone.trim(), email = form.email.trim();
    if (!name)  return fail(<><strong>Name is required.</strong> Please enter your name so we know who the order is for.</>, 'name');
    if (!phone) return fail(<><strong>Phone number is required.</strong> Please enter a phone number we can reach you at.</>, 'phone');
    if (!email || !/\S+@\S+\.\S+/.test(email))
      return fail(<><strong>A valid email is required.</strong> Please double-check the email address — we'll send your receipt there.</>, 'email');

    if (!form.payment) {
      setPaymentError(true);
      const el = paymentRef.current;
      if (el) {           // replay the shake animation every time
        el.classList.remove('shake');
        void el.offsetWidth;
        el.classList.add('shake');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const date = form.pickupDate;
    if (!date) return fail(<><strong>Pickup date missing.</strong> Please choose a pickup date before submitting.</>);
    const today = todayPacific();
    if (date < today)
      return fail(<><strong>Pickup date not available.</strong> {date} is in the past. Please choose a date on or after {minDate || today}.</>);
    if (date < minDate)
      return fail(<><strong>Pickup date too soon.</strong> We need at least one day's notice. Please choose {minDate} or later.</>);
    if (DISABLED_DATES.includes(date))
      return fail(<>Pickup date {date}<br />is not available. Please choose another pickup date, or{' '}
        <Link href="/contact" style={linkStyle}>message us directly.</Link>  Next available pickup date starts August 10, 2026.</>);

    const payload = {
      name, phone: phone.replace(/\D/g, ''), email,
      pickupDate: date, payment: form.payment, notes: form.notes.trim(),
      items, total,
    };

    setSending(true);
    setStatus({ kind: 'loading', content: <>
      <strong>Sending your order…</strong> Please hold on a moment — this can take a few seconds.
      <div className="bobots-progress" role="progressbar" aria-label="Sending order"></div>
    </> });

    try {
      const res = await fetch(ORDER_ENDPOINT, {
        method: 'POST', mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      console.log('[Bobot order response]', data);
      if (!data?.ok) throw new Error(data?.error || 'Unknown error');

      if (data.emailStatus === 'failed') console.warn('[Bobot] Receipt email FAILED on server:', data.emailError);

      setStatus({ kind: 'success', content: <>
        <strong>Salamat, {name}!</strong> Your order request was received. Check your email inbox for a receipt and pickup address. We may contact you via email or phone if needed if we need more details.
      </> });
      clear();
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus({ kind: 'error', content: <>
        <strong>Hmm, that didn't go through.</strong> Please try again, or{' '}
        <Link href="/contact" style={linkStyle}>message us directly</Link>.<br />
        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>(Details: {String(err.message || err)})</span>
      </> });
    } finally {
      setSending(false);
    }
  };

  const hero = (
    <>
      <section className="hero" style={{ padding: '3.5rem 1.5rem 3rem' }}>
        <div className="hero-inner">
          <h1>Your Cart</h1>
          <p className="tagline">review your order and send it our way</p>
        </div>
      </section>
      <div className="bamboo-divider"></div>
    </>
  );

  // Empty cart — either nothing added yet, or an order was just sent.
  if (lines.length === 0) {
    return (
      <>
        {hero}
        <section>
          <div className="container order-wrapper">
            <div className="order-form cart-empty">
              <StatusBox status={status?.kind === 'success' ? status : null} statusRef={statusRef} />
              {status?.kind !== 'success' && <p className="cart-empty-msg">Your cart is empty.</p>}
              <Link href="/order" className="btn btn-primary">
                {status?.kind === 'success' ? 'Back to the Menu' : 'Browse the Menu'}
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {hero}

      <section>
        <div className="container order-wrapper">
          <form className="order-form" onSubmit={handleSubmit} noValidate>
            {ORDERING_CLOSED && (
              <div role="alert" style={{ ...STATUS_STYLES.error, padding: '1rem 1.2rem', borderRadius: 8, marginBottom: '1.5rem', textAlign: 'center', fontWeight: 600 }}>
                &#9888;&#65039; {CLOSED_MESSAGE}
              </div>
            )}
            <h2 style={{ marginBottom: '0.4rem' }}>Order Summary</h2>
            <p style={{ color: 'var(--wood)', marginBottom: '1.5rem' }}>
              Adjust quantities here, or <Link href="/order" style={linkStyle}>keep shopping</Link>.
            </p>

            <table className="order-items-table cart-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="col-price">Price</th>
                  <th>Qty</th>
                  <th style={{ textAlign: 'right' }}>Subtotal</th>
                  <th><span className="visually-hidden" style={{ position: 'absolute', left: '-9999px' }}>Remove</span></th>
                </tr>
              </thead>
              <tbody>
                {lines.map(line => (
                  <tr key={line.key}>
                    <td>
                      {line.name}
                      <span className="cart-item-unit">{line.label}</span>
                    </td>
                    <td className="col-price">{line.label}</td>
                    <td><QtyStepper value={line.qty} onChange={(n) => setQty(line.key, n)} label={line.name} /></td>
                    <td className="subtotal" style={{ textAlign: 'right' }}>{fmt(line.subtotal)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button type="button" className="cart-remove" onClick={() => remove(line.key)}
                              aria-label={`Remove ${line.name} from cart`} title="Remove">&times;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="cart-total-label" style={{ textAlign: 'right', paddingTop: '1rem', fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Total</td>
                  <td style={{ textAlign: 'right', paddingTop: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--flag-red)' }}>{fmt(total)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>

            <h2 style={{ marginTop: '2rem', marginBottom: '0.4rem' }}>Your Information</h2>
            <p style={{ color: 'var(--wood)', marginBottom: '1.5rem' }}><strong>Note:</strong> Delivery not available. Local pickup only in Salinas, Ca.<br />
              All pickup times begin at 12PM PST until end of day. Please see FAQ for more info.</p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input ref={nameRef} type="text" id="name" name="name" maxLength={35}
                       value={form.name} onChange={setField} />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input ref={phoneRef} type="tel" id="phone" name="phone" placeholder="(831) 555-1234"
                       maxLength={20} inputMode="numeric" value={form.phone} onChange={setField} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input ref={emailRef} type="email" id="email" name="email" placeholder="you@example.com"
                       maxLength={40} value={form.email} onChange={setField} />
                <small style={{ color: 'var(--wood)', fontStyle: 'italic', display: 'block', marginTop: '0.4rem' }}>
                  Please make sure your email is correct. Your receipt will be sent here.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="pickupDate">Pickup Date *</label>
                <input type="date" id="pickupDate" name="pickupDate" min={minDate}
                       value={form.pickupDate} onChange={setField} />
              </div>
            </div>

            <h2 style={{ marginTop: '2rem', marginBottom: '0.4rem' }}>Payment</h2>
            <p style={{ color: 'var(--wood)', marginBottom: '1rem' }}>
              Payment is only required upon pickup. Large orders may require prepayment &mdash; we'll let you know.
            </p>

            <fieldset ref={paymentRef} className={`payment-options${paymentError ? ' error' : ''}`}
                      style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend className="visually-hidden" style={{ position: 'absolute', left: '-9999px' }}>Payment method</legend>
              {[['Cash', '\u{1F4B5}'], ['Zelle', '\u{1F4F1}'], ['Venmo', '\u{1F4B2}']].map(([value, icon]) => (
                <label className="payment-option" key={value}>
                  <input type="radio" name="payment" value={value} checked={form.payment === value}
                         onChange={(e) => { setField(e); setPaymentError(false); }} />
                  <span className="payment-label">
                    <span className="payment-icon">{icon}</span>
                    <span className="payment-name">{value}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <p className={`payment-error-msg${paymentError ? ' show' : ''}`} role="alert" aria-live="polite">
              &#9888;&#65039; Please choose a payment method.
            </p>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label htmlFor="notes">Special Requests / Notes</label>
              <textarea id="notes" name="notes" rows={4} maxLength={NOTES_MAX} value={form.notes} onChange={setField}
                        placeholder="Allergies, special occasion, anything we should know..." />
              <small style={{ color: form.notes.length >= NOTES_MAX ? 'var(--flag-red)' : 'var(--wood)',
                              fontStyle: 'italic', display: 'block', marginTop: '0.3rem' }}>
                {form.notes.length} / {NOTES_MAX}
              </small>
            </div>

            <StatusBox status={status} statusRef={statusRef} />

            <button type="submit" className="btn btn-primary" disabled={sending || ORDERING_CLOSED} style={{ width: '100%', padding: '1rem', ...(ORDERING_CLOSED ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}>
              {ORDERING_CLOSED ? 'Ordering Closed' : sending ? 'Sending order…' : `Submit Order Request · ${fmt(total)}`}
            </button>
            {!ORDER_ENDPOINT && (
              <p style={{ textAlign: 'center', marginTop: '1rem', fontStyle: 'italic', color: 'var(--wood)', fontSize: '0.9rem' }}>
                (Submission is currently a preview — coming soon!)
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
