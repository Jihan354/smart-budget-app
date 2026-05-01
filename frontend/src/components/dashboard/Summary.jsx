export default function Summary({ summary, data }) {

  // ================= FORMAT RUPIAH =================
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  // ================= HITUNG PER KATEGORI =================
  const kategoriMap = {};

  data.forEach((item) => {
    if (item.type === "expense") {
      if (!kategoriMap[item.kategori]) {
        kategoriMap[item.kategori] = 0;
      }
      kategoriMap[item.kategori] += item.jumlah;
    }
  });

  return (
    <div>

      {/* ================= SUMMARY UTAMA ================= */}
      <div className="summary">
        <div className="card">
          <h4>Expense</h4>
          <p>Rp {formatRupiah(summary.total_expense || 0)}</p>
        </div>

        <div className="card">
          <h4>Income</h4>
          <p>Rp {formatRupiah(summary.total_income || 0)}</p>
        </div>

        <div className="card">
          <h4>Saldo</h4>
          <p>Rp {formatRupiah(summary.saldo || 0)}</p>
        </div>
      </div>

      {/* ================= SUMMARY PER KATEGORI ================= */}
      <div className="card">
        <h4>Pengeluaran per Kategori</h4>

        {Object.keys(kategoriMap).length === 0 ? (
          <p>Belum ada data</p>
        ) : (
          Object.entries(kategoriMap).map(([kategori, total]) => (
            <p key={kategori}>
              {kategori}: Rp {formatRupiah(total)}
            </p>
          ))
        )}
      </div>
    </div>
  );
}