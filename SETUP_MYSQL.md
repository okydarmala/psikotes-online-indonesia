# MySQL Setup Guide untuk Psikotes Online Indonesia

## Status Saat Ini
- MySQL sedang diinstall via Homebrew
- Aplikasi sudah berjalan di http://localhost:3000 (Frontend OK)
- API belum bisa koneksi ke database

## Langkah Konfigurasi MySQL

### 1. Tunggu Instalasi Selesai
```bash
# Cek apakah MySQL sudah installed
which mysql
```

### 2. Verifikasi Instalasi
```bash
# Cek status MySQL service
brew services list | grep mysql

# Atau lihat semua services
brew services list
```

### 3. Mulai MySQL Service
```bash
# Start MySQL
brew services start mysql

# Cek status
brew services info mysql
```

### 4. Setup Root User (PENTING)
MySQL Homebrew biasanya tidak ada password default untuk root user:

```bash
# Login ke MySQL tanpa password
mysql -u root

# Di dalam MySQL console, set password:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Update .env File
Edit `.env` file di root project dengan credentials yang benar:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=psikotes_indonesia
```

### 6. Inisialisasi Database
Setelah MySQL running dan .env configured:

```bash
cd /Users/mentalkucom/Desktop/psychology_test
source ~/.nvm/nvm.sh && nvm use 20 --silent

# Create database tables
node database/schema.js

# Load sample data
node database/seed.js
```

### 7. Verifikasi Database
```bash
# Login ke MySQL
mysql -u root -p

# Ganti ke database
USE psikotes_indonesia;

# Lihat tables
SHOW TABLES;

# Lihat sample users
SELECT * FROM users LIMIT 5;
```

### 8. Test Login
Setelah database ready, silakan test di browser:
- http://localhost:3000/login
- Email: admin@psikotes.id
- Password: admin123

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- MySQL tidak running: `brew services start mysql`
- Password salah: Periksa kembali .env file
- User tidak punya akses: Login dengan mysql CLI dan reset password

### "Can't connect to MySQL server"
- MySQL service tidak running
- Run: `brew services start mysql`
- Tunggu 5-10 detik sebelum restart app

### "Database psikotes_indonesia tidak ada"
- Jalankan: `node database/schema.js`
- Ini akan membuat database dan semua tables

### Port 3306 sudah digunakan
- Cek process: `lsof -i :3306`
- Kill process: `kill -9 <PID>`

## Quick Start Checklist

- [ ] MySQL installed (`which mysql`)
- [ ] MySQL service running (`brew services info mysql`)
- [ ] .env file dikonfigurasi dengan password yang benar
- [ ] Database created (`node database/schema.js`)
- [ ] Sample data loaded (`node database/seed.js`)
- [ ] Login berhasil dengan admin@psikotes.id / admin123

## Demo Credentials (setelah seed)

**Admin:**
- Email: admin@psikotes.id
- Password: admin123

**Recruiter:**
- Email: recruiter1@company.id
- Password: recruiter123

**Participant:**
- Gunakan OTP Login (OTP akan ditampilkan di console saat development)

## Next Steps

1. MySQL harus running untuk API dapat bekerja
2. Refresh browser http://localhost:3000 setelah MySQL ready
3. Coba login dengan credentials di atas
4. Explore dashboards untuk each role (Admin/Recruiter/Participant)

Butuh bantuan? Lihat error message di terminal Next.js server untuk detail lebih.
