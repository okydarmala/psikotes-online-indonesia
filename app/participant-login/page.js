'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ParticipantLogin() {
  const [step, setStep] = useState('identify'); // identify, otp, verify
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [expiryMinutes, setExpiryMinutes] = useState(0);
  const [identifier, setIdentifier] = useState('');
  const router = useRouter();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || undefined,
          phone: phone || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal mengirim OTP');
        setLoading(false);
        return;
      }

      setSuccess(data.message);
      setIdentifier(data.identifier);
      setExpiryMinutes(data.expiryMinutes);
      
      // Show debug OTP in development
      if (data.debug_otp) {
        setSuccess(`${data.message} (Debug: ${data.debug_otp})`);
      }

      setStep('verify');
      setLoading(false);
    } catch (err) {
      setError('Terjadi kesalahan server');
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || undefined,
          phone: phone || undefined,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verifikasi OTP gagal');
        setLoading(false);
        return;
      }

      // NextAuth sets session cookies on OTP verify; redirect to dashboard and NextAuth will provide session
      router.push('/participant/dashboard');
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
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
              P
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Psikotes Online
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Login Peserta Tes
          </p>

          {error && (
            <div className="alert alert-danger mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4">
              {success}
            </div>
          )}

          {step === 'identify' && (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label className="form-label">Email atau Nomor Telepon</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Masukkan email atau nomor telepon"
                  value={email || phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.includes('@')) {
                      setEmail(val);
                      setPhone('');
                    } else {
                      setPhone(val);
                      setEmail('');
                    }
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-secondary w-full"
              >
                {loading ? 'Memproses...' : 'Minta OTP'}
              </button>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600">
                  OTP telah dikirim ke <strong>{identifier}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  OTP berlaku selama {expiryMinutes} menit
                </p>
              </div>

              <div>
                <label className="form-label">Kode OTP (6 digit)</label>
                <input
                  type="text"
                  className="form-input text-center text-2xl tracking-widest"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="btn-secondary w-full"
              >
                {loading ? 'Memverifikasi...' : 'Verifikasi OTP'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('identify');
                  setOtp('');
                  setEmail('');
                  setPhone('');
                }}
                className="w-full px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Ubah Email/Telepon
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">Admin atau Recruiter?</p>
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Masuk di sini →
            </Link>
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
