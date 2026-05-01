export default function Insight({ data }) {

  // ================= SAFETY CHECK =================
  //  kalau data kosong → jangan lanjut (biar gak error reduce)
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3>Insight</h3>
        <p>Belum ada data</p>
      </div>
    );
  }

  // ================= HITUNG TOTAL =================
  const total = data.reduce((acc, item) => acc + item.jumlah, 0);

  // ================= KATEGORI TERBESAR =================
  const categoryMap = {};

  data.forEach(item => {
    if (!categoryMap[item.kategori]) {
      categoryMap[item.kategori] = 0;
    }
    categoryMap[item.kategori] += item.jumlah;
  });

  const biggestCategory = Object.keys(categoryMap).reduce((a, b) =>
    categoryMap[a] > categoryMap[b] ? a : b
  );

  // ================= TRIP TERMAHAL =================
  const tripMap = {};

  data.forEach(item => {
    if (!tripMap[item.trip]) {
      tripMap[item.trip] = 0;
    }
    tripMap[item.trip] += item.jumlah;
  });

  const expensiveTrip = Object.keys(tripMap).reduce((a, b) =>
    tripMap[a] > tripMap[b] ? a : b
  );

  return (
    <div className="card">
      <h3>Insight</h3>

      <p>💡 Pengeluaran terbesar: <b>{biggestCategory}</b></p>
      <p>📍 Trip termahal: <b>{expensiveTrip}</b></p>
      <p>💰 Total: Rp {new Intl.NumberFormat("id-ID").format(total)}</p>

      {total > 3000000 && (
        <p style={{ color: "red" }}>
          ⚠️ Pengeluaran cukup tinggi, pertimbangkan mengurangi biaya
        </p>
      )}

      <p>💡 Coba cari transport lebih hemat untuk trip berikutnya</p>
    </div>
  );
}