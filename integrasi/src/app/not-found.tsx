export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-4xl font-bold mb-4">404 - Halaman Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-8">Maaf, halaman yang kamu cari tidak tersedia.</p>
        <a
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Kembali ke Dashboard
        </a>
      </div>
    )
  }
  