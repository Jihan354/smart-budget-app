from flask import Blueprint, request, jsonify
from db import get_db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    conn = get_db()
    conn.execute(
        "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)",
        (data["nama"], data["email"], data["password"])
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Register berhasil"})


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    conn = get_db()
    user = conn.execute(
        "SELECT * FROM users WHERE email=? AND password=?",
        (data["email"], data["password"])
    ).fetchone()
    conn.close()

    if user:
        return jsonify({"message": "Login sukses"})
    else:
        return jsonify({"message": "Login gagal"}), 401