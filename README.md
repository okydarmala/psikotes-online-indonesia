# Psikotes Online Indonesia

Platform tes psikologi online terintegrasi untuk rekrutmen dan assessment di Indonesia.

## 📋 Fitur Utama

### Untuk Admin
- ✓ Kelola pengguna dan recruiter
- ✓ Buat dan kelola kategori tes (IST, DISC, MBTI, EPPS, PAPI, Wartegg, Kraepelin, dll)
- ✓ Kelola bank soal per kategori
- ✓ Atur aturan scoring dan interpretasi hasil
- ✓ Kelola template laporan
- ✓ Lihat laporan komprehensif semua peserta
- ✓ Audit log untuk semua aktivitas

### Untuk Recruiter
- ✓ Daftar peserta baru (email, telepon, data personal)
- ✓ Tetapkan tes ke peserta
- ✓ Monitor progress peserta
- ✓ Lihat hasil dan laporan peserta
- ✓ Reset akses tes jika diperlukan

### Untuk Peserta
- ✓ Login menggunakan OTP (email/WhatsApp)
- ✓ Lihat daftar tes yang ditugaskan
- ✓ Baca instruksi dan contoh soal sebelum tes
- ✓ Tes online dengan timer otomatis
- ✓ Jawab semua soal di satu halaman (scrollable)
- ✓ Auto-save jawaban saat mengisi
- ✓ Auto-submit ketika waktu habis
- ✓ Lihat hasil tes

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL 8.0+
- **Authentication**: JWT, OTP via Email/WhatsApp
- **PDF Export**: jsPDF, HTML2Canvas
- **Node.js**: 18+

## 📦 Instalasi

### Prasyarat
- Node.js 18 atau lebih tinggi
- MySQL 8.0 atau lebih tinggi
- npm atau yarn

### Langkah Instalasi

1. **Clone atau ekstrak project**
```bash
cd psychology_test
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup database**
```bash
# Copy .env.example ke .env dan sesuaikan konfigurasi
cp .env.example .env

# Edit .env dengan detail database Anda
nano .env
```

File `.env` harus berisi:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=psikotes_indonesia
JWT_SECRET=your_jwt_secret_key_here_change_in_production
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=5
OTP_COOLDOWN_MINUTES=2
API_URL=http://localhost:3000
```

4. **Inisialisasi database**
```bash
node database/schema.js
```

5. **Seeding data contoh**
```bash
node database/seed.js
```

6. **Jalankan development server**
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## 🔐 Kredensial Demo

### Admin
- **Email**: admin@psikotes.id
- **Password**: admin123

### Recruiter
- **Email**: recruiter1@company.id
- **Password**: recruiter123

## 📁 Struktur Project

```
psychology_test/
├── app/
│   ├── api/
│   │   ├── auth/               # Authentication endpoints
│   │   ├── tests/              # Test management
│   │   ├── participants/       # Participant management
│   │   ├── admin/              # Admin endpoints
│   │   └── recruiter/          # Recruiter endpoints
│   ├── components/             # Reusable components
│   ├── admin/                  # Admin pages
│   ├── recruiter/              # Recruiter pages
│   ├── participant/            # Participant pages
│   ├── login/                  # Auth pages
│   ├── styles/                 # Global styles
│   ├── lib/                    # Utility functions
│   │   ├── db.js               # Database connection
│   │   ├── auth.js             # Auth utilities
│   │   └── utils.js            # Helper functions
│   ├── globals.css             # Tailwind styles
│   ├── layout.js               # Root layout
│   └── page.js                 # Landing page
├── database/
│   ├── schema.js               # Database schema
│   └── seed.js                 # Seed data
├── public/                     # Static files
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🗄️ Database Schema

Aplikasi menggunakan 13 tabel utama:

- **users**: Pengguna sistem (admin, recruiter, peserta)
- **participants**: Data peserta tes
- **participant_otps**: OTP untuk login peserta
- **test_categories**: Kategori tes (IST, DISC, MBTI, dll)
- **test_subcategories**: Subkategori tes
- **questions**: Bank soal
- **question_options**: Pilihan jawaban
- **test_assignments**: Penugasan tes ke peserta
- **test_sessions**: Sesi pengerjaan tes
- **participant_answers**: Jawaban peserta
- **test_results**: Hasil tes
- **scoring_rules**: Aturan penilaian
- **score_interpretations**: Interpretasi skor
- **audit_logs**: Log aktivitas

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin/recruiter
- `POST /api/auth/otp/request` - Minta OTP peserta
- `POST /api/auth/otp/verify` - Verifikasi OTP
- `POST /api/auth/logout` - Logout

### Test Categories
- `GET /api/tests/categories` - Daftar kategori
- `POST /api/tests/categories` - Buat kategori
- `GET /api/tests/categories/[id]` - Detail kategori
- `GET /api/tests/categories/[id]/questions` - Soal kategori
- `POST /api/tests/categories/[id]/questions` - Tambah soal

### Participants
- `GET /api/participants` - Daftar peserta
- `POST /api/participants` - Daftar peserta baru
- `GET /api/participants/[id]` - Detail peserta
- `GET /api/participants/[id]/assignments` - Tes peserta
- `POST /api/participants/[id]/assignments` - Tetapkan tes

### Test Sessions
- `POST /api/tests/assignments/[id]/session` - Mulai tes
- `GET /api/tests/sessions/[id]/questions` - Ambil soal
- `POST /api/tests/sessions/[id]/answers` - Simpan jawaban
- `POST /api/tests/sessions/[id]/submit` - Selesaikan tes

## 🧪 Workflow Penggunaan

### 1. Admin Setup
1. Login ke admin dashboard
2. Buat kategori tes dan soal
3. Atur scoring rules dan interpretasi
4. Buat recruiter account

### 2. Recruiter Flow
1. Login ke recruiter dashboard
2. Daftar peserta baru
3. Tetapkan tes ke peserta
4. Monitor progress dan hasil

### 3. Participant Flow
1. Buka `/participant-login`
2. Masukkan email atau nomor telepon
3. Masukkan OTP yang diterima
4. Pilih tes dari daftar yang ditugaskan
5. Baca instruksi dan contoh soal
6. Klik "Saya Mengerti dan Mulai Tes"
7. Jawab semua soal dalam waktu yang ditentukan
8. Sistem auto-submit ketika waktu habis
9. Lihat hasil tes

## 🔒 Keamanan

Aplikasi menerapkan beberapa lapisan keamanan:

- ✓ Password hashing dengan bcryptjs
- ✓ OTP hashing dengan SHA-256
- ✓ JWT token untuk autentikasi
- ✓ Rate limiting untuk OTP request dan verifikasi
- ✓ SQL injection prevention dengan prepared statements
- ✓ CORS dan security headers
- ✓ Input validation di semua endpoint
- ✓ Role-based access control

## 🚀 Development Tips

### Debugging
- Cek database logs di `console.log`
- OTP ditampilkan di console untuk development (lihat `app/api/auth/otp/request/route.js`)
- Gunakan browser DevTools untuk debug frontend

### Customization

#### Mengubah Test Categories
Edit `database/seed.js` untuk menambah/mengubah kategori tes

#### Mengubah Scoring Rules
Modifikasi query di `app/api/tests/sessions/[sessionId]/submit/route.js`

#### Styling
Semua style menggunakan Tailwind CSS. Edit `tailwind.config.js` untuk custom theme

## 📈 Deployment

### Production Checklist
- [ ] Ubah `JWT_SECRET` dengan string acak yang panjang
- [ ] Setup email/WhatsApp integration untuk OTP
- [ ] Gunakan database production (bukan localhost)
- [ ] Setup HTTPS
- [ ] Konfigurasi CORS dengan domain yang benar
- [ ] Setup backup database
- [ ] Monitor error logs
- [ ] Setup CDN untuk assets static

### Deploy ke Vercel
```bash
npm install -g vercel
vercel --prod
```

## 📝 TODO Features

- [ ] Email/WhatsApp OTP sender integration
- [ ] PDF report export
- [ ] Advanced analytics dashboard
- [ ] Test scheduling
- [ ] Bulk participant import
- [ ] Integration dengan HRIS/ATS
- [ ] Mobile app native
- [ ] Multi-language support
- [ ] Custom branding per client
- [ ] Advanced reporting dan visualization

## 🤝 Contributing

Untuk kontribusi:
1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

Untuk pertanyaan atau issues:
- Email: support@psikotes.id
- Issue tracker: GitHub Issues

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💼 Author

**Psikotes Online Indonesia**
- Website: https://psikotes.id
- Email: support@psikotes.id

---

**Terakhir diupdate**: Mei 2024
**Versi**: 1.0.0
