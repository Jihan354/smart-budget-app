from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

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

@app.route("/")
def home():
    return "API jalan!"

# CRUD EXPENSES
@app.route("/expenses", methods=["GET", "POST"])
def expenses():
    conn = get_db()

    if request.method == "POST":
        data = request.json

        conn.execute(
            "INSERT INTO expenses (nama, jumlah) VALUES (?, ?)",
            (data["nama"], data["jumlah"])
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "Data ditambah"})

    elif request.method == "GET":
        data = conn.execute("SELECT * FROM expenses").fetchall()
        conn.close()

        return jsonify([dict(row) for row in data])


# UPDATE
@app.route("/expenses/<int:id>", methods=["PUT"])
def update_expense(id):
    data = request.json

    conn = get_db()
    conn.execute(
        "UPDATE expenses SET nama=?, jumlah=? WHERE id=?",
        (data["nama"], data["jumlah"], id)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Data diupdate"})


# DELETE
@app.route("/expenses/<int:id>", methods=["DELETE"])
def delete_expense(id):
    conn = get_db()
    conn.execute("DELETE FROM expenses WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Data dihapus"})


if __name__ == "__main__":
    app.run(debug=True)