'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-xl font-bold text-gray-900">Psikotes Online</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Masuk
              </Link>
              <Link
                href="/participant-login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Peserta
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Platform Tes Psikologi Online Terpercaya
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Solusi komprehensif untuk rekrutmen dan assessment psikologi dengan teknologi terkini
            </p>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Masuk Admin / Recruiter
              </Link>
              <Link
                href="/participant-login"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Masuk Peserta
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xl">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Tes Komprehensif</h3>
                  <p className="text-gray-600">7+ jenis tes psikologi teruji</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-xl">⚙️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mudah Dikelola</h3>
                  <p className="text-gray-600">Dashboard intuitif untuk admin dan recruiter</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xl">📄</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Laporan Otomatis</h3>
                  <p className="text-gray-600">Hasil dan PDF terintegrasi</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-xl">🔒</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Aman & Terpercaya</h3>
                  <p className="text-gray-600">Enkripsi & autentikasi berlapis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Fitur Unggulan
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Untuk Admin
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ Kelola pengguna dan recruiter</li>
                <li>✓ Buat kategori tes</li>
                <li>✓ Kelola bank soal</li>
                <li>✓ Atur scoring & interpretasi</li>
                <li>✓ Lihat laporan komprehensif</li>
              </ul>
            </div>
            <div className="p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Untuk Recruiter
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ Daftar peserta tes</li>
                <li>✓ Tetapkan tes ke peserta</li>
                <li>✓ Monitor progress peserta</li>
                <li>✓ Lihat hasil dan laporan</li>
                <li>✓ Reset akses tes</li>
              </ul>
            </div>
            <div className="p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Untuk Peserta
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ Login mudah dengan OTP</li>
                <li>✓ Akses tes yang ditugaskan</li>
                <li>✓ Lihat instruksi & contoh soal</li>
                <li>✓ Tes online dengan timer</li>
                <li>✓ Hasil otomatis</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2024 Psikotes Online Indonesia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
