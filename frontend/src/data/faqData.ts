export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const faqData: FAQ[] = [
  {
    id: "1",
    question: "Apa itu SatuTangan?",
    answer:
      "SatuTangan adalah platform donasi online yang menghubungkan para donatur dengan berbagai kampanye penggalangan dana untuk membantu mereka yang membutuhkan. Kami berkomitmen untuk memberikan transparansi dan kemudahan dalam berdonasi.",
  },
  {
    id: "2",
    question: "Bagaimana cara berdonasi?",
    answer:
      "Anda dapat berdonasi dengan langkah mudah:\n1. Pilih kampanye yang ingin didukung\n2. Klik tombol 'Donasi Sekarang'\n3. Isi jumlah donasi yang diinginkan\n4. Pilih metode pembayaran\n5. Selesaikan proses pembayaran\n\nDonasi Anda akan langsung tercatat dan diteruskan ke penerima manfaat.",
  },
  {
    id: "3",
    question: "Apakah donasi saya aman?",
    answer:
      "Ya, keamanan donasi Anda adalah prioritas kami. Semua transaksi dilindungi dengan:\n• Sistem pembayaran terenkripsi SSL\n• Integrasi dengan payment gateway terpercaya (Midtrans)\n• Verifikasi identitas creator kampanye\n• Transparansi penggunaan dana\n\nData pribadi dan finansial Anda dijaga kerahasiaannya sesuai standar keamanan internasional.",
  },
  {
    id: "4",
    question: "Bagaimana cara membuat kampanye?",
    answer:
      "Untuk membuat kampanye penggalangan dana:\n1. Daftar sebagai Creator di platform kami\n2. Lengkapi proses verifikasi identitas (KTP, rekening bank)\n3. Tunggu persetujuan dari admin (1-3 hari kerja)\n4. Setelah disetujui, buat kampanye dengan mengisi:\n   • Judul dan deskripsi kampanye\n   • Target dana yang dibutuhkan\n   • Durasi kampanye\n   • Foto/dokumen pendukung\n5. Kampanye akan di-review admin sebelum dipublikasikan",
  },
  {
    id: "5",
    question: "Berapa lama proses pencairan dana?",
    answer:
      "Proses pencairan dana memakan waktu:\n• Pengajuan pencairan: Kapan saja setelah kampanye selesai\n• Review admin: 2-3 hari kerja\n• Proses transfer: 3-5 hari kerja setelah disetujui\n\nTotal waktu pencairan: 5-7 hari kerja sejak pengajuan disetujui.\n\nAnda dapat memantau status pencairan dana melalui dashboard creator.",
  },
];
