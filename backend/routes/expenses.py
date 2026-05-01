from flask import Blueprint, request, jsonify
from db import get_db

expenses_bp = Blueprint("expenses", __name__)

@expenses_bp.route("/expenses", methods=["GET", "POST"])
def expenses():
    conn = get_db()

    if request.method == "POST":
        data = request.json

        conn.execute(
            "INSERT INTO expenses (nama, kategori, jumlah, tanggal, trip, type) VALUES (?, ?, ?, ?, ?, ?)",
            (
                data["nama"],
                data["kategori"],
                data["jumlah"],
                data["tanggal"],
                data["trip"],
                data["type"]
            )
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "Data ditambah"})

    else:
        data = conn.execute("SELECT * FROM expenses").fetchall()
        conn.close()

        return jsonify([dict(row) for row in data])


@expenses_bp.route("/expenses/<int:id>", methods=["PUT"])
def update_expense(id):
    data = request.json

    conn = get_db()
    conn.execute(
        "UPDATE expenses SET nama=?, kategori=?, jumlah=?, tanggal=?, trip=?, type=? WHERE id=?",
        (
            data["nama"],
            data["kategori"],
            data["jumlah"],
            data["tanggal"],
            data["trip"],
            data["type"],
            id
        )
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Data diupdate"})


@expenses_bp.route("/expenses/<int:id>", methods=["DELETE"])
def delete_expense(id):
    conn = get_db()
    conn.execute("DELETE FROM expenses WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Data dihapus"})