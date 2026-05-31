'use client';

export default function ParticipantTestResult() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a href="/participant/dashboard" className="text-blue-600 hover:text-blue-700">
            ← Kembali ke Dashboard
          </a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded mb-8">
          <h1 className="text-3xl font-bold text-gray-900">✅ Tes Selesai!</h1>
          <p className="text-gray-700 mt-2">
            Terima kasih telah menyelesaikan tes. Hasil dan laporan akan segera tersedia.
          </p>
        </div>

        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">
            Hasil tes Anda telah disimpan dan sedang diproses.
          </p>
          <a
            href="/participant/dashboard"
            className="inline-block btn-primary"
          >
            Kembali ke Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}
