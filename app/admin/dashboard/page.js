'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalParticipants: 0,
    totalTests: 0,
    completedTests: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    if (userData.role !== 'admin') {
      router.push('/login');
      return;
    }

    setUser(userData);
    // Load stats
    loadStats();
  }, [router]);

  const loadStats = async () => {
    // In production, fetch from API
    setStats({
      totalUsers: 0,
      totalParticipants: 0,
      totalTests: 0,
      completedTests: 0,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
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
              href="/admin/dashboard"
              className="block px-4 py-2 text-gray-900 font-medium bg-blue-50 rounded-lg"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              Kelola Pengguna
            </Link>
            <Link
              href="/admin/test-categories"
              className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              Kategori Tes
            </Link>
            <Link
              href="/admin/questions"
              className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              Bank Soal
            </Link>
            <Link
              href="/admin/scoring-rules"
              className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              Aturan Scoring
            </Link>
            <Link
              href="/admin/reports"
              className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              Laporan
            </Link>
            <Link
              href="/admin/audit-logs"
              className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              Audit Log
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Selamat Datang, {user.name}!
          </h1>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <p className="text-sm text-gray-600 uppercase font-medium mb-2">Total Pengguna</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 uppercase font-medium mb-2">Total Peserta</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalParticipants}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 uppercase font-medium mb-2">Total Tes</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalTests}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 uppercase font-medium mb-2">Tes Selesai</p>
              <p className="text-3xl font-bold text-orange-600">{stats.completedTests}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Aksi Cepat</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/admin/test-categories"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <p className="text-lg font-semibold text-gray-900">Buat Kategori Tes</p>
                <p className="text-sm text-gray-600 mt-2">Tambahkan jenis tes baru</p>
              </Link>
              <Link
                href="/admin/users"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <p className="text-lg font-semibold text-gray-900">Kelola Recruiter</p>
                <p className="text-sm text-gray-600 mt-2">Tambah/edit recruiter</p>
              </Link>
              <Link
                href="/admin/reports"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <p className="text-lg font-semibold text-gray-900">Lihat Laporan</p>
                <p className="text-sm text-gray-600 mt-2">Semua hasil tes peserta</p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
