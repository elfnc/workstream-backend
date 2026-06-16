# Plan Penyelesaian Phase 1, 2, 3, 4 (Backend Setup)

## Deskripsi
Menyelesaikan tahap awal setup backend sesuai dengan `backend/TODO.md`. Fokus pada konfigurasi project, struktur folder, pengaturan environment, dan pembuatan utilitas dasar. (Phase 2 terkait package dependencies sudah diselesaikan).

## Langkah-langkah Pengerjaan

1. **Buat Branch Baru**
   - Pastikan berada di repository backend, lalu buat branch baru:
     ```bash
     git checkout -b feature/backend-setup-phase-1-4
     ```

2. **Eksekusi Phase 1 (Backend Project Setup)**
   - Buat konfigurasi `tsconfig.json` untuk TypeScript.
   - Tambahkan scripts (seperti `dev`, `build`, dsb) pada `package.json`.
   - Setup global error handler, response helper, dan konfigurasi Winston logger.
   - Setup CORS untuk ElysiaJS.

3. **Eksekusi Phase 3 (Folder Structure)**
   - Buat direktori yang dibutuhkan di dalam folder `src/` (misalnya: `config`, `db`, `plugins`, `middleware`, `modules`, `shared`).
   - Buat file-file awal seperti `src/app.ts`, `src/server.ts`, beserta file `drizzle.config.ts` di root project.

4. **Eksekusi Phase 4 (Environment Variables)**
   - Buat file `.env.example` yang mencantumkan seluruh konfigurasi env yang dibutuhkan (PORT, DATABASE_URL, JWT_SECRET, dll).
   - Salin isi dari file tersebut ke file lokal `.env` untuk digunakan saat development.

5. **Update TODO.md**
   - Perbarui status pengerjaan di `backend/TODO.md` dengan memberikan tanda `[x]` pada list yang terdapat pada bagian Phase 1, Phase 3, dan Phase 4.

6. **Commit dan Buat Pull Request**
   - Simpan seluruh perubahan yang telah dibuat:
     ```bash
     git add .
     git commit -m "feat(backend): complete setup phase 1 to 4"
     git push -u origin feature/backend-setup-phase-1-4
     ```
   - Lakukan Pull Request ke branch utama (misal: `main` atau `master`).
