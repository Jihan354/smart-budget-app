
from flask import Flask
from flask_cors import CORS
from db import init_db
from routes.expenses import expenses_bp
from routes.auth import auth_bp
from routes.summary import summary_bp
from routes.prediction import prediction_bp
from routes.destination import destination_bp

app = Flask(__name__)
CORS(app)


# ================= REGISTER BLUEPRINT =================
# expenses_bp → CRUD transaksi
# auth_bp → login & register user
# summary_bp → total income/expense
# prediction_bp → estimasi biaya travelling
app.register_blueprint(expenses_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(summary_bp)
app.register_blueprint(prediction_bp)
app.register_blueprint(destination_bp)
# ================= ROUTES =================
@app.route("/")
def home():
    return "API jalan!"

# ================= RUN =================
if __name__ == "__main__":
    init_db()
    app.run(debug=True)