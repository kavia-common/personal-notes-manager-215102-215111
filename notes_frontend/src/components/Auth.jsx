import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Minimal Auth component supporting email/password sign up, sign in, and sign out.
 * Styled to match Ocean Professional theme via existing CSS utility classes.
 */
export default function Auth() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <div className="empty-state">
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="topbar-actions" style={{ gap: 12 }}>
        <span className="env-pill">Signed in</span>
        <button className="btn subtle" onClick={async () => { await signOut(); }}>
          Sign out
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) setError(error.message);
      } else {
        const { error } = await signUp(email, password);
        if (error) setError(error.message);
        else setInfo('Check your email to confirm your account.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      aria-label="Authentication"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        padding: 16,
        maxWidth: 420,
        margin: '16px auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div className="brand" style={{ fontSize: 18 }}>
          <span className="brand-dot" />
          <span className="brand-name">Sign {mode === 'signin' ? 'in' : 'up'}</span>
        </div>
        <div>
          <button
            className="btn subtle"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            aria-label="Toggle auth mode"
          >
            {mode === 'signin' ? 'Create account' : 'Have an account? Sign in'}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239,68,68,0.35)',
            color: '#991b1b',
            borderRadius: 10,
            padding: '8px 10px',
            marginBottom: 8,
          }}
        >
          {error}
        </div>
      )}
      {info && (
        <div
          role="status"
          style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245,158,11,0.35)',
            color: '#a16207',
            borderRadius: 10,
            padding: '8px 10px',
            marginBottom: 8,
          }}
        >
          {info}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12, color: 'var(--muted)' }}>Email</label>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: 'var(--muted)' }}>Password</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn primary" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </form>
    </section>
  );
}
