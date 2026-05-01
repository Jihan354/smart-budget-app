import { useState } from "react";
import { deleteExpense, updateExpense } from "../../services/api";

export default function ExpenseList({ data, refresh }) {

  // ================= STATE EDIT =================
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // ================= FORMAT RUPIAH =================
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  // ================= FORMAT TANGGAL =================
  const formatTanggal = (tgl) => {
    if (!tgl) return "-";

    const date = new Date(tgl);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await deleteExpense(id);
    refresh();
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setEditId(item.id);
    setEditData(item);
  };

  const handleSave = async () => {
    await updateExpense(editId, editData);
    setEditId(null);
    refresh();
  };

  return (
    <div>
      {data.map((item) => (
        <div key={item.id} className="card expense-card">

          {/* HEADER */}
          <div className="expense-header">
            {editId === item.id ? (
              <input
                value={editData.nama}
                onChange={(e) =>
                  setEditData({ ...editData, nama: e.target.value })
                }
              />
            ) : (
              <h4>{item.nama}</h4>
            )}

            <span className={item.type === "expense" ? "badge red" : "badge green"}>
              {item.type}
            </span>
          </div>

          {/* BODY */}
          <div className="expense-body">

            {editId === item.id ? (
              <>
                <input
                  value={editData.trip}
                  onChange={(e) =>
                    setEditData({ ...editData, trip: e.target.value })
                  }
                />

                <input
                  value={editData.kategori}
                  onChange={(e) =>
                    setEditData({ ...editData, kategori: e.target.value })
                  }
                />

                <input
                  type="date"
                  value={editData.tanggal}
                  onChange={(e) =>
                    setEditData({ ...editData, tanggal: e.target.value })
                  }
                />

                <input
                  type="number"
                  value={editData.jumlah}
                  onChange={(e) =>
                    setEditData({ ...editData, jumlah: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <p>📍 {item.trip}</p>
                <p>💼 {item.kategori}</p>
                <p>📅 {formatTanggal(item.tanggal)}</p>
                <p className="amount">💰 Rp {formatRupiah(item.jumlah)}</p>
              </>
            )}

          </div>

          {/* BUTTON */}
          <div className="action-btns">

            {editId === item.id ? (
              <button className="save-btn" onClick={handleSave}>
                Simpan
              </button>
            ) : (
              <button className="edit-btn" onClick={() => handleEdit(item)}>
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
    </div>
  );
}