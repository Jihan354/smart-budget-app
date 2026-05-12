from flask import Blueprint, request, jsonify
from db import get_db

expenses_bp = Blueprint("expenses", __name__)

# =========================================================
# GET & ADD EXPENSE
# =========================================================
@expenses_bp.route("/expenses", methods=["GET", "POST"])
def expenses():

    conn = get_db()

    # =====================================================
    # ADD EXPENSE
    # =====================================================
    if request.method == "POST":

        data = request.json

        conn.execute(
            """
            INSERT INTO expenses (
                nama,
                kategori,
                jumlah,
                start_date,
                end_date,
                from_city,
                destination,
                type
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                data["nama"],
                data["kategori"],
                data["jumlah"],
                data["start_date"],
                data["end_date"],
                data["from_city"],
                data["destination"],
                data["type"]
            )
        )

        conn.commit()

        conn.close()

        return jsonify({
            "message": "Data ditambah"
        })

    # =====================================================
    # GET DATA
    # =====================================================
    else:

        data = conn.execute(
            "SELECT * FROM expenses"
        ).fetchall()

        conn.close()

        return jsonify([
            dict(row) for row in data
        ])


# =========================================================
# UPDATE EXPENSE
# =========================================================
@expenses_bp.route("/expenses/<int:id>", methods=["PUT"])
def update_expense(id):

    data = request.json

    conn = get_db()

    conn.execute(
        """
        UPDATE expenses
        SET
            nama=?,
            kategori=?,
            jumlah=?,
            start_date=?,
            end_date=?,
            from_city=?,
            destination=?,
            type=?
        WHERE id=?
        """,
        (
            data["nama"],
            data["kategori"],
            data["jumlah"],
            data["start_date"],
            data["end_date"],
            data["from_city"],
            data["destination"],
            data["type"],
            id
        )
    )

    conn.commit()

    conn.close()

    return jsonify({
        "message": "Data diupdate"
    })


# =========================================================
# DELETE EXPENSE
# =========================================================
@expenses_bp.route("/expenses/<int:id>", methods=["DELETE"])
def delete_expense(id):

    conn = get_db()

    conn.execute(
        "DELETE FROM expenses WHERE id=?",
        (id,)
    )

    conn.commit()

    conn.close()

    return jsonify({
        "message": "Data dihapus"
    })