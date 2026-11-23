# Cyclela

**Cyclela** ("Cycle Angela") adalah aplikasi web pribadi (PWA) untuk melacak siklus menstruasi dan mencatat kesehatan harian. Dirancang mobile-first dengan nuansa hangat, berjalan sepenuhnya di browser (data disimpan di `localStorage`, tanpa backend).

## Fitur

- **Dashboard (Ringkasan)** — hari siklus saat ini, perkiraan haid berikutnya, fase siklus (Menstruasi, Folikuler, Ovulasi, Luteal), dan indikator visual proporsi fase.
- **Kalender Siklus** — tandai hari haid, prediksi haid & ovulasi berikutnya, navigasi bulan/tahun, legenda warna.
- **Jurnal Harian** — catat mood (multi-pilihan), tingkat kram (1–5), gejala tubuh (20+ pilihan), dan catatan pribadi per tanggal.
- **Pengaturan** — nama panggilan profil, panjang siklus (15–60 hari atau otomatis dari pola catatan), efek suara, musik latar, dan volume.
- **Audio** — efek suara & musik latar dibuat langsung di perangkat via Web Audio API.
- **PWA** — service worker + manifest, bisa di-install dan bekerja offline.

## Tech Stack

- HTML5, CSS (Tailwind via CDN), vanilla JavaScript (ES6 IIFE)
- Web Audio API, Service Worker, `localStorage`
- Tanpa framework / tanpa build step / tanpa backend

## Menjalankan Lokal

Cukup buka `index.html` di browser, atau serve dengan server statis:

```bash
npx serve .
# atau
python -m http.server 8000
```

## Struktur File

```
.
├── index.html        # Markup & styling
├── app.js            # Logika aplikasi
├── sw.js             # Service worker (offline)
├── manifest.json     # PWA manifest
└── cyclela-*.png/.svg # Ikon
```

## Privasi

Semua data (catatan, hari haid, pengaturan) disimpan lokal di perangkat pengguna melalui `localStorage`. Tidak ada data yang dikirim ke server.

## Lisensi

Personal project. © Yoganatha Pranashakti.