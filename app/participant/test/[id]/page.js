'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function TestInstructions() {
  const { data: session } = useSession();
  const [assignment, setAssignment] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // if no session, redirect to participant login
    if (!session) {
      return;
    }
    fetchAssignment();
  }, [params.id, session]);

    const fetchAssignment = async () => {
      try {
        const res = await fetch(`/api/tests/assignments/${params.id}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

      if (res.ok) {
        const data = await res.json();
        setAssignment(data);
          await fetchCategory(data.category_id);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

    const fetchCategory = async (categoryId) => {
      try {
        const res = await fetch(`/api/tests/categories/${categoryId}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setCategory(data);
        }
      } finally {
        setLoading(false);
      }
    };

  const handleStartTest = async () => {
    setStarting(true);
    try {
      const res = await fetch(`/api/tests/assignments/${params.id}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ipAddress: '0.0.0.0' }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(\`/participant/test-page/\${data.session.id}\`);
      }
    } catch (error) {
      console.error('Error starting test:', error);
      setStarting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!assignment || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Data tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/participant/dashboard" className="text-blue-600 hover:text-blue-700">
            ← Kembali
          </Link>
        </div>
      </nav>

      {/* Instructions */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category.name}
          </h1>
          <p className="text-gray-700">{category.description}</p>
        </div>

        {/* Instructions */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Panduan Tes</h2>
          <div className="prose prose-sm max-w-none text-gray-700">
            {category.instructions}
          </div>
        </div>

        {/* Test Details */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600 uppercase font-medium mb-2">Waktu Tersedia</p>
            <p className="text-3xl font-bold text-blue-600">
              {category.time_limit_minutes} <span className="text-lg">menit</span>
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 uppercase font-medium mb-2">Tipe Tes</p>
            <p className="text-lg font-semibold text-gray-900">
              {category.question_type || 'Pilihan Ganda'}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 uppercase font-medium mb-2">Format</p>
            <p className="text-lg font-semibold text-gray-900">
              Satu halaman (scrollable)
            </p>
          </div>
        </div>

        {/* Example Question */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contoh Soal</h2>
          <div className="bg-gray-50 p-4 rounded mb-4">
            <p className="font-medium text-gray-900 mb-2">{category.example_question}</p>
            <p className="text-gray-700">
              <strong>Jawaban Contoh:</strong> {category.example_answer}
            </p>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded mb-8">
          <h3 className="font-bold text-gray-900 mb-3">⚠️ Catatan Penting</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>✓ Timer akan mulai ketika Anda mengklik tombol "Mulai Tes"</li>
            <li>✓ Anda dapat menjawab semua soal di halaman yang dapat di-scroll</li>
            <li>✓ Jawaban disimpan otomatis saat Anda mengetik</li>
            <li>✓ Jangan tutup atau refresh halaman saat tes berlangsung</li>
            <li>✓ Tes akan otomatis selesai ketika waktu habis</li>
            <li>✓ Anda hanya dapat mengikuti tes ini satu kali</li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="flex gap-4">
          <button
            onClick={handleStartTest}
            disabled={starting}
            className="btn-secondary text-lg px-8 py-3"
          >
            {starting ? 'Memulai...' : '🚀 Saya Mengerti dan Mulai Tes'}
          </button>
          <Link
            href="/participant/dashboard"
            className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
          >
            Batal
          </Link>
        </div>
      </main>
    </div>
  );
}
