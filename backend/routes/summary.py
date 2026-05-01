from flask import Blueprint, jsonify
from db import get_db

summary_bp = Blueprint("summary", __name__)

@summary_bp.route("/summary", methods=["GET"])
def summary():
    conn = get_db()

    total_expense = conn.execute(
        "SELECT SUM(jumlah) FROM expenses WHERE type='expense'"
    ).fetchone()[0] or 0

    total_income = conn.execute(
        "SELECT SUM(jumlah) FROM expenses WHERE type='income'"
    ).fetchone()[0] or 0

    conn.close()

    return jsonify({
        "total_expense": total_expense,
        "total_income": total_income,
        "saldo": total_income - total_expense
    })