'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/blog');
        router.refresh();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crt-screen min-h-screen w-full bg-terminal-bg flex items-center justify-center">
      <div className="scanline"></div>
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_90%,rgba(0,0,0,0.15)_100%)]"></div>
      </div>

      <div className="screen-curvature w-full max-w-md mx-auto p-4">
        <div className="font-mono text-sm">
          {/* Terminal header */}
          <div className="border border-terminal-border rounded overflow-hidden mb-6">
            <div className="bg-terminal-green bg-opacity-10 px-3 py-2 flex items-center gap-2">
              <span className="text-sm">🔐</span>
              <span className="text-sm text-dim">login.sh</span>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="p-6">
              <h1 className="glow-text-amber text-xl mb-2">Admin Login</h1>
              <p className="text-dim text-sm mb-6">Enter your credentials to continue</p>

              {error && (
                <div className="mb-4 p-3 border border-terminal-red bg-terminal-red bg-opacity-10 rounded text-terminal-red text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-blue text-sm mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black bg-opacity-30 border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green"
                    autoComplete="username"
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label className="block text-blue text-sm mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black bg-opacity-30 border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-terminal-green text-terminal-bg py-2 rounded hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Logging in...' : 'Login →'}
                </button>
              </div>
            </form>
          </div>

          {/* Back to home */}
          <div className="text-center text-dim text-sm">
            <Link href="/" className="hover:text-terminal-green transition-all">
              ← Back to home
            </Link>
          </div>

          {/* Info about default credentials */}
          <div className="mt-4 text-center text-dim text-xs">
            <p>Default: admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
