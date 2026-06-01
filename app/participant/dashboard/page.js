'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function ParticipantDashboard() {
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      if (session.user.participantId) fetchAssignments(session.user.participantId);
      return;
    }

    // If no NextAuth session, redirect to participant login
    router.push('/participant-login');
  }, [router, session]);

  const fetchAssignments = async (participantId) => {
    try {
      // Use cookie-based session (NextAuth). API routes accept cookie auth via credentials: 'include'.
      const res = await fetch(`/api/participants/${participantId}/assignments`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
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

  const getStatusBadge = (status) => {
    const statusMap = {
      not_started: { bg: 'badge-info', text: 'Belum Dimulai' },
      in_progress: { bg: 'badge-warning', text: 'Sedang Berlangsung' },
      completed: { bg: 'badge-success', text: 'Selesai' },
      expired: { bg: 'badge-danger', text: 'Kadaluarsa' },
    };
    const s = statusMap[status] || statusMap.not_started;
    return <span className={`badge-status ${s.bg}`}>{s.text}</span>;
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-xl font-bold text-gray-900">Dashboard Peserta</span>
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang, {user.name}!
          </h1>
          <p className="text-gray-600">
            Berikut adalah daftar tes yang telah ditetapkan untuk Anda.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Memuat data...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">
              Tidak ada tes yang ditetapkan untuk Anda saat ini.
            </p>
            <p className="text-sm text-gray-500">
              Hubungi recruiter untuk mendapatkan penugasan tes.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {assignment.category_name}
                    </h3>
                    <p className="text-gray-600">
                      Waktu: {assignment.time_limit_minutes} menit
                    </p>
                  </div>
                  <div>{getStatusBadge(assignment.status)}</div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-6 py-4 border-t border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Status</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {assignment.status === 'not_started' && 'Belum Dimulai'}
                      {assignment.status === 'in_progress' && 'Sedang Berlangsung'}
                      {assignment.status === 'completed' && 'Selesai'}
                      {assignment.status === 'expired' && 'Kadaluarsa'}
                    </p>
                  </div>
                  {assignment.completion_time && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">Skor</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {assignment.total_score || '-'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {assignment.status === 'not_started' && (
                    <Link
                      href={`/participant/test/${assignment.id}`}
                      className="btn-primary"
                    >
                      Mulai Tes
                    </Link>
                  )}
                  {assignment.status === 'completed' && (
                    <Link
                      href={`/participant/result/${assignment.id}`}
                      className="btn-secondary"
                    >
                      Lihat Hasil
                    </Link>
                  )}
                  {assignment.status !== 'not_started' && assignment.status !== 'completed' && (
                    <button className="px-4 py-2 text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed">
                      {assignment.status === 'in_progress' ? 'Sedang Berlangsung' : 'Kadaluarsa'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
