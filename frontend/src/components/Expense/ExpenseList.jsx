import { useState } from "react";
import { deleteExpense, updateExpense } from "../../services/api";

export default function ExpenseList({ data, refresh }) {
  // =========================================================
  // STATE EDIT
  // =========================================================
  const [editId, setEditId] = useState(null);

  const [editData, setEditData] = useState({});

  // =========================================================
  // FORMAT RUPIAH
  // =========================================================
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================
  const formatTanggal = (tgl) => {
    if (!tgl) return "-";

    const date = new Date(tgl);

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // =========================================================
  // DELETE
  // =========================================================
  const handleDelete = async (id) => {
    await deleteExpense(id);

    refresh();
  };

  // =========================================================
  // EDIT
  // =========================================================
  const handleEdit = (item) => {
    setEditId(item.id);

    setEditData(item);
  };

  // =========================================================
  // SAVE
  // =========================================================
  const handleSave = async () => {
    await updateExpense(editId, editData);

    setEditId(null);

    refresh();
  };

  // =========================================================
  // GROUP TRIP
  // =========================================================
  const groupedTrip = {};

  data.forEach((item) => {
    const routeKey = `${item.from_city} → ${item.destination}`;

    if (!groupedTrip[routeKey]) {
      groupedTrip[routeKey] = [];
    }

    groupedTrip[routeKey].push(item);
  });

  // =========================================================
  // CATEGORY ICON
  // =========================================================
  const getCategoryIcon = (kategori) => {
    switch (kategori) {
      case "Transport":
        return "🚆";

      case "Hotel":
        return "🏨";

      case "Food":
        return "🍜";

      case "Activity":
        return "🎫";

      default:
        return "📌";
    }
  };

  return (
    <div>
      {/* ===================================================== */}
      {/* EMPTY */}
      {/* ===================================================== */}
      {!Array.isArray(data) || data.length === 0 ? (
        <div className="card expense-card">
          <p>Belum ada data travel expense</p>
        </div>
      ) : (
        Object.keys(groupedTrip).map((tripName, index) => {
          const tripItems = groupedTrip[tripName];

          // =================================================
          // TOTAL TRIP
          // =================================================
          const totalTrip = tripItems.reduce(
            (acc, item) => acc + Number(item.jumlah),

            0,
          );

          return (
            <div key={index} className="card expense-card">
              {/* ============================================= */}
              {/* HEADER */}
              {/* ============================================= */}
              <div className="expense-header">
                <h3>📍 {tripName}</h3>

                <span className="badge red">Travel Expense</span>
              </div>

              <br />

              {/* ============================================= */}
              {/* LIST EXPENSE */}
              {/* ============================================= */}
              {tripItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    marginBottom: "15px",
                  }}
                >
                  {editId === item.id ? (
                    <>
                      {/* NAMA */}
                      <input
                        value={editData.nama || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            nama: e.target.value,
                          })
                        }
                        placeholder="Nama Expense"
                      />

                      {/* KATEGORI */}
                      <input
                        value={editData.kategori || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            kategori: e.target.value,
                          })
                        }
                        placeholder="Kategori"
                      />

                      {/* FROM CITY */}
                      <input
                        value={editData.from_city || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            from_city: e.target.value,
                          })
                        }
                        placeholder="From City"
                      />

                      {/* DESTINATION */}
                      <input
                        value={editData.destination || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            destination: e.target.value,
                          })
                        }
                        placeholder="Destination"
                      />

                      {/* START DATE */}
                      <input
                        type="date"
                        value={editData.start_date || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            start_date: e.target.value,
                          })
                        }
                      />

                      {/* END DATE */}
                      <input
                        type="date"
                        value={editData.end_date || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            end_date: e.target.value,
                          })
                        }
                      />

                      {/* JUMLAH */}
                      <input
                        type="number"
                        value={editData.jumlah || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            jumlah: e.target.value,
                          })
                        }
                        placeholder="Jumlah"
                      />
                    </>
                  ) : (
                    <>
                      <p>
                        {getCategoryIcon(item.kategori)} {item.kategori}
                        {" - "}
                        Rp {formatRupiah(item.jumlah)}
                      </p>

                      <small>
                        📅 {formatTanggal(item.start_date)}
                        {" → "}
                        {formatTanggal(item.end_date)}
                      </small>
                    </>
                  )}

                  {/* ========================================= */}
                  {/* BUTTON */}
                  {/* ========================================= */}
                  <div className="action-btns">
                    {editId === item.id ? (
                      <button className="save-btn" onClick={handleSave}>
                        Simpan
                      </button>
                    ) : (
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}

              <hr />

              {/* ============================================= */}
              {/* TOTAL */}
              {/* ============================================= */}
              <h4>💰 Total Trip : Rp {formatRupiah(totalTrip)}</h4>
            </div>
          );
        })
      )}
    </div>
  );
}
