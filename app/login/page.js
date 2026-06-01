"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Use NextAuth credentials provider
      const res = await signIn('credentials', { redirect: false, email, password });
      if (res?.error) {
        setError('Login gagal');
        setLoading(false);
        return;
      }

      // Get session info
      const session = await getSession();
      const user = session?.user;

      // If NextAuth session not available, show error (legacy login removed)
      if (!user) {
        setError('Login gagal');
        setLoading(false);
        return;
      }

      // Redirect based on NextAuth session user role
      if (user.role === 'admin') router.push('/admin/dashboard');
      else if (user.role === 'recruiter') router.push('/recruiter/dashboard');
    } catch (err) {
      setError('Terjadi kesalahan server');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
              P
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Psikotes Online
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Admin dan Recruiter Login
          </p>

          {error && (
            <div className="alert alert-danger mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-4">Peserta tes?</p>
            <Link
              href="/participant-login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Masuk sebagai Peserta →
            </Link>
          </div>

          <hr className="my-6" />

          <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-2">Demo Credentials:</p>
            <p>Admin: admin@psikotes.id / admin123</p>
            <p>Recruiter: recruiter1@company.id / recruiter123</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
