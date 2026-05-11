from flask import Blueprint, request, jsonify
import pandas as pd
import joblib

prediction_bp = Blueprint("prediction", __name__)

# ================= LOAD MODEL =================
tourism_model = joblib.load("models/tourism_model.joblib")
budget_model = joblib.load("models/budget_model.joblib")

# ================= LOAD DATASET TOURISM =================
tourism_df = pd.read_csv("indonesia_tourism_clean_for_ai (1).csv")


# =========================================================
# AI BUDGET PREDICTION
# =========================================================
@prediction_bp.route("/predict", methods=["POST"])
def predict():

    data = request.json

    destination = data.get("destination")
    days = int(data.get("days"))
    travelers = int(data.get("travelers"))
    budget_type = data.get("budget_type")

    # ================= DATAFRAME =================
    input_data = pd.DataFrame([{
        "destination": destination,
        "days": days,
        "travelers": travelers,
        "budget_type": budget_type
    }])

    # ================= PREDICT AI =================
    prediction = budget_model.predict(input_data)[0]

    return jsonify({
        "destination": destination,
        "days": days,
        "travelers": travelers,
        "budget_type": budget_type,
        "predicted_budget": int(prediction)
    })


# =========================================================
# AI WISATA RECOMMENDATION
# =========================================================
@prediction_bp.route("/predict-wisata", methods=["POST"])
def predict_wisata():

    data = request.json

    city = data.get("city")
    category = data.get("category")
    price = int(data.get("price"))

    # ================= FILTER DATA =================
    filtered = tourism_df[
        (tourism_df["city"] == city) &
        (tourism_df["category"] == category) &
        (tourism_df["price"] <= price)
    ]

      # ================= HAPUS DUPLIKAT =================
    filtered = filtered.drop_duplicates(subset=["place_name"])

    # ================= SORT RATING =================
    filtered = filtered.sort_values(by="rating", ascending=False)

    # ================= AMBIL TOP 5 =================
    recommendations = filtered.head(5)

    result = recommendations[[
        "place_name",
        "category",
        "city",
        "price",
        "rating"
    ]].to_dict(orient="records")

    return jsonify(result)