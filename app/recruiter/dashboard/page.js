'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function RecruiterDashboard() {
  const [user, setUser] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      if (session.user.role !== 'recruiter') {
        router.push('/login');
        return;
      }
      setUser(session.user);
      loadParticipants();
      return;
    }

    // No NextAuth session — redirect to login
    router.push('/login');
  }, [router, session]);

  const loadParticipants = async () => {
    try {
      const res = await fetch('/api/participants', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setParticipants(data);
      }
    } catch (error) {
      console.error('Error loading participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      signOut({ callbackUrl: '/' });
    } catch (e) {
      router.push('/');
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-xl font-bold text-gray-900">Recruiter Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar + Main */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="sidebar w-64 min-h-screen py-8 px-4">
          <nav className="space-y-2">
            <Link
              href="/recruiter/dashboard"
              className="block px-4 py-2 text-gray-900 font-medium bg-blue-50 rounded-lg"
            >
              Dashboard
            </Link>
            <Link
              href="/recruiter/participants"
              className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              Peserta
            </Link>
            <Link
              href="/recruiter/register-participant"
              className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              Daftar Peserta Baru
            </Link>
            <Link
              href="/recruiter/assign-tests"
              className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              Tetapkan Tes
            </Link>
            <Link
              href="/recruiter/results"
              className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              Hasil Tes
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Selamat Datang, {user.name}!
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Stats */}
            <div className="card">
              <p className="text-sm text-gray-600 uppercase font-medium mb-2">Total Peserta</p>
              <p className="text-4xl font-bold text-blue-600">{participants.length}</p>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h2>
              <Link
                href="/recruiter/register-participant"
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center mb-2"
              >
                Daftar Peserta Baru
              </Link>
              <Link
                href="/recruiter/assign-tests"
                className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-center"
              >
                Tetapkan Tes
              </Link>
            </div>
          </div>

          {/* Participants List */}
          <div className="card mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Daftar Peserta Terbaru</h2>
            
            {loading ? (
              <p className="text-gray-600">Memuat...</p>
            ) : participants.length === 0 ? (
              <p className="text-gray-600">Belum ada peserta yang terdaftar</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Nama</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Telepon</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.slice(0, 5).map((participant) => (
                      <tr key={participant.id} className="table-row">
                        <td className="py-3 px-4">{participant.full_name}</td>
                        <td className="py-3 px-4">{participant.email}</td>
                        <td className="py-3 px-4">{participant.phone || '-'}</td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/recruiter/participants/${participant.id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            Lihat
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
