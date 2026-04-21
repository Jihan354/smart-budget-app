from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# koneksi database
def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

# buat table kalau belum ada
def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT,
            jumlah INTEGER
        )
    """)
    conn.close()

init_db()

# route home (biar gak 404)
@app.route("/")
def home():
    return "API Smart Budget jalan!"

# GET semua data
@app.route("/expenses", methods=["GET"])
def get_expenses():
    conn = get_db()
    data = conn.execute("SELECT * FROM expenses").fetchall()
    conn.close()

    return jsonify([dict(row) for row in data])

# POST tambah data
@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.json

    conn = get_db()
    conn.execute(
        "INSERT INTO expenses (nama, jumlah) VALUES (?, ?)",
        (data["nama"], data["jumlah"])
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Data masuk DB!"})

if __name__ == "__main__":
    app.run(debug=True)