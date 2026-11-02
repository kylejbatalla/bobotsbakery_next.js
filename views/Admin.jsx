'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ORDER_ENDPOINT } from '@/lib/config';
import { ITEM_BY_KEY, fmt } from '@/lib/menu';

const TOKEN_KEY = 'bobots-admin-token';
const PAGE_SIZE = 10;   // orders per page in History

// "Ube Pandesal" + "per dozen" -> "Ube Pandesal (dozen)"; names that already say the size stay as-is.
function itemLabel(key) {
  const item = ITEM_BY_KEY[key];
  if (!item) return key;
  if (item.name.includes('(')) return item.name;
  return `${item.name} (${item.unit.replace(/^(per|\/)\s*/, '')})`;
}

const byPickupDate = (a, b) =>
  String(a.pickupDate).localeCompare(String(b.pickupDate)) || String(a.createdAt).localeCompare(String(b.createdAt));
// History: most recently placed order first.
const time = (v) => (v ? new Date(v).getTime() || 0 : 0);
const byPlacedNewest = (a, b) => time(b.createdAt) - time(a.createdAt);

export default function Admin() {
  const [ready, setReady] = useState(false);     // true once we've checked sessionStorage
  const [token, setToken] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('open');        // 'open' | 'completed'
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);           // History page number
  const listTop = useRef(null);

  // sessionStorage only exists in the browser, so read the saved login after the page loads.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(sessionStorage.getItem(TOKEN_KEY));
    setReady(true);
  }, []);

  const forgetLogin = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setOrders([]);
  }, []);

  // Calls an admin endpoint on the Worker with the login token attached.
  const api = useCallback(async (path, method = 'GET') => {
    const res = await fetch(ORDER_ENDPOINT + path, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      forgetLogin();
      throw new Error('Your session expired. Please log in again.');
    }
    if (!data.ok) throw new Error(data.error || 'Something went wrong.');
    return data;
  }, [token, forgetLogin]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api('/admin/orders');
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Load the orders whenever we have a login (on page load or right after logging in).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (token) load();
  }, [token, load]);

  async function login(e) {
    e.preventDefault();
    const password = e.currentTarget.password.value;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(ORDER_ENDPOINT + '/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.token) throw new Error(data.error || 'Login failed.');
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try { await api('/admin/logout', 'POST'); } catch { /* logging out anyway */ }
    forgetLogin();
  }

  async function changeStatus(id, action) {   // action: 'complete' | 'reopen'
    setBusyId(id);
    setError('');
    try {
      await api(`/admin/orders/${encodeURIComponent(id)}/${action}`, 'POST');
      const done = action === 'complete';
      setOrders(list => list.map(o => (o.id === id
        ? { ...o, status: done ? 'completed' : 'open', completedAt: done ? new Date().toISOString() : null }
        : o)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  function switchTab(next) {
    setTab(next);
    setPage(1);
  }

  function goToPage(n) {
    setPage(n);
    listTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (!ready) return null;

  const hero = (title, tagline) => (
    <>
      <section className="hero" style={{ padding: '3.5rem 1.5rem 3rem' }}>
        <div className="hero-inner">
          <h1>{title}</h1>
          <p className="tagline">{tagline}</p>
        </div>
      </section>
      <div className="bamboo-divider"></div>
    </>
  );

  const errorBox = error && (
    <div role="alert" style={{ background: '#fde2e2', border: '2px solid #ce1126', color: '#5c3a1e',
                               padding: '1rem 1.2rem', borderRadius: 8, margin: '1rem 0' }}>
      {error}
    </div>
  );

  // ---------- Logged out ----------
  if (!token) {
    return (
      <>
        {hero('Admin', 'staff only')}
        <section>
          <div className="container order-wrapper">
            <form className="order-form" onSubmit={login} style={{ maxWidth: 420, margin: '0 auto' }}>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required autoFocus autoComplete="current-password" />
              </div>
              {errorBox}
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Logging in…' : 'Log in'}
              </button>
            </form>
          </div>
        </section>
      </>
    );
  }

  // ---------- Logged in ----------
  const open = orders.filter(o => o.status !== 'completed').sort(byPickupDate);
  const done = orders.filter(o => o.status === 'completed').sort(byPlacedNewest);

  // History is split into pages of PAGE_SIZE; Open shows everything.
  const totalPages = Math.max(1, Math.ceil(done.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);   // e.g. after an Undo empties the last page
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const shown = tab === 'open' ? open : done.slice(firstIndex, firstIndex + PAGE_SIZE);

  const pager = tab === 'completed' && totalPages > 1 && (
    <nav aria-label="History pages"
         style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
      <button type="button" className="btn btn-secondary" disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}>&larr; Newer</button>
      <span style={{ color: 'var(--wood)' }}>
        Page {currentPage} of {totalPages}
        <span style={{ display: 'block', fontSize: '0.85rem', textAlign: 'center' }}>
          orders {firstIndex + 1}–{Math.min(firstIndex + PAGE_SIZE, done.length)} of {done.length}
        </span>
      </span>
      <button type="button" className="btn btn-secondary" disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}>Older &rarr;</button>
    </nav>
  );

  return (
    <>
      {hero('Orders', 'open orders and order history')}
      <section>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div className="btn-row" style={{ margin: 0 }}>
              <button type="button" className={`btn ${tab === 'open' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => switchTab('open')}>Open ({open.length})</button>
              <button type="button" className={`btn ${tab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => switchTab('completed')}>History ({done.length})</button>
            </div>
            <div className="btn-row" style={{ margin: 0 }}>
              <button type="button" className="btn btn-secondary" onClick={load} disabled={loading}>
                {loading ? 'Loading…' : 'Refresh'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={logout}>Log out</button>
            </div>
          </div>

          {errorBox}

          <div ref={listTop} style={{ scrollMarginTop: '6rem' }} />
          {pager}

          {!loading && shown.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--wood)' }}>
              {tab === 'open' ? 'No open orders.' : 'No completed orders yet.'}
            </p>
          )}

          {shown.map(o => (
            <article key={o.id} className="order-form" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>{o.name || '(no name)'}</h3>
                <strong>Pickup: {o.pickupDate || '—'}</strong>
              </div>
              <p style={{ color: 'var(--wood)', margin: '0.4rem 0 0.8rem' }}>
                #{o.id} · placed {o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}
                {o.completedAt && <> · completed {new Date(o.completedAt).toLocaleString()}</>}
              </p>
              <p>
                {o.phone && <a href={`tel:${o.phone}`}>{o.phone}</a>}
                {o.phone && o.email && ' · '}
                {o.email && <a href={`mailto:${o.email}`}>{o.email}</a>}
                {o.payment && <> · {o.payment}</>}
              </p>
              <ul style={{ margin: '0.6rem 0 0.6rem 1.2rem' }}>
                {Object.entries(o.items || {}).map(([key, qty]) => (
                  <li key={key}>{qty} × {itemLabel(key)}</li>
                ))}
              </ul>
              {o.notes && <p><em>Notes: {o.notes}</em></p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginTop: '0.8rem' }}>
                <strong style={{ fontSize: '1.2rem', color: 'var(--flag-red)' }}>{fmt(o.total || 0)}</strong>
                {o.status === 'completed' ? (
                  <button type="button" className="btn btn-secondary" disabled={busyId === o.id}
                          onClick={() => changeStatus(o.id, 'reopen')}>
                    {busyId === o.id ? 'Saving…' : 'Undo (move back to open)'}
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary" disabled={busyId === o.id}
                          onClick={() => changeStatus(o.id, 'complete')}>
                    {busyId === o.id ? 'Saving…' : 'Mark completed'}
                  </button>
                )}
              </div>
            </article>
          ))}

          {pager}
        </div>
      </section>
    </>
  );
}