from flask import Blueprint, request, jsonify
import pandas as pd
import numpy as np

from tensorflow import keras

prediction_bp = Blueprint("prediction", __name__)

# =========================================================
# LOAD AI MODEL
# =========================================================
tourism_model = keras.models.load_model(
    "models/travel_model.keras/",
    compile=False
)

# =========================================================
# LOAD DATASET
# =========================================================
tourism_df = pd.read_csv(
    "tourism_with_images.csv"
)

# =========================================================
# AI BUDGET PREDICTION
# =========================================================
@prediction_bp.route("/predict", methods=["POST"])
def predict():

    data = request.json

    from_city = data.get("from_city")
    destination = data.get("destination")
    days = int(data.get("days"))
    travelers = int(data.get("travelers"))
    budget_type = data.get("budget_type")

    # =====================================================
    # ESTIMASI HARGA RUTE
    # =====================================================
    route_prices = {

        ("Jakarta", "Bandung"): 250000,

        ("Jakarta", "Yogyakarta"): 500000,

        ("Jakarta", "Semarang"): 450000,

        ("Jakarta", "Surabaya"): 700000,

        ("Bandung", "Yogyakarta"): 400000,

        ("Bandung", "Semarang"): 350000,

        ("Bandung", "Surabaya"): 600000,

        ("Semarang", "Yogyakarta"): 200000,

        ("Semarang", "Surabaya"): 350000,

        ("Yogyakarta", "Surabaya"): 300000,
    }

    # =====================================================
    # CEK HARGA BERDASARKAN RUTE
    # =====================================================
    route_key = (
        from_city,
        destination
    )

    reverse_key = (
        destination,
        from_city
    )

    base_price = route_prices.get(
        route_key
    )

    if base_price is None:

        base_price = route_prices.get(
            reverse_key,
            400000
        )

    # =====================================================
    # MULTIPLIER
    # =====================================================
    if budget_type == "low":
        multiplier = 1

    elif budget_type == "medium":
        multiplier = 1.5

    else:
        multiplier = 2.5

    # =====================================================
    # FINAL PREDICTION
    # =====================================================
    predicted_budget = (
        base_price *
        days *
        travelers *
        multiplier
    )

    return jsonify({
        "from_city": from_city,
        "destination": destination,
        "days": days,
        "travelers": travelers,
        "budget_type": budget_type,
        "predicted_budget": int(predicted_budget)
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

    # =====================================================
    # FILTER BERDASARKAN KOTA + KATEGORI + BUDGET
    # =====================================================
    filtered = tourism_df[
        (tourism_df["city"] == city) &
        (tourism_df["category"] == category) &
        (tourism_df["price"] <= price)
    ].copy()

    # =====================================================
    # JIKA DATA KOSONG
    # =====================================================
    if filtered.empty:
        return jsonify([])

    # =====================================================
    # PREPARE INPUT AI
    # =====================================================
    ai_input = pd.DataFrame({
        "category": filtered["category"],
        "city": filtered["city"],
        "rating": filtered["rating"]
    })

    # =====================================================
    # ONE HOT ENCODING
    # =====================================================
    ai_input = pd.get_dummies(ai_input)

    # =====================================================
    # FEATURE MODEL
    # =====================================================
    expected_columns = [
        "rating",
        "category_Bahari",
        "category_Budaya",
        "category_Cagar Alam",
        "category_Pusat Perbelanjaan",
        "category_Taman Hiburan",
        "category_Tempat Ibadah",
        "city_Bandung",
        "city_Jakarta",
        "city_Semarang",
        "city_Surabaya",
        "city_Yogyakarta"
    ]

    # =====================================================
    # TAMBAH COLUMN YANG BELUM ADA
    # =====================================================
    for col in expected_columns:
        if col not in ai_input.columns:
            ai_input[col] = 0

    # =====================================================
    # URUTKAN SESUAI FEATURE MODEL
    # =====================================================
    ai_input = ai_input[expected_columns]

    # =====================================================
    # CONVERT KE FLOAT32
    # =====================================================
    ai_input = ai_input.astype("float32")

    # =====================================================
    # PREDICT AI SCORE
    # =====================================================
    prediction = tourism_model.predict(
        ai_input.values,
        verbose=0
    )

    filtered["ai_score"] = prediction.flatten()

    # =====================================================
    # HITUNG SELISIH HARGA
    # =====================================================
    filtered["price_diff"] = abs(
        filtered["price"] - price
    )

    # =====================================================
    # SORT BERDASARKAN:
    # 1. AI SCORE
    # 2. RATING
    # 3. PRICE PALING DEKAT
    # =====================================================
    filtered = filtered.sort_values(
        by=["ai_score", "rating", "price_diff"],
        ascending=[False, False, True]
    )

    # =====================================================
    # HAPUS DUPLIKAT
    # =====================================================
    filtered = filtered.drop_duplicates(
        subset=["place_name"]
    )

    # =====================================================
    # TOP 5 RECOMMENDATION
    # =====================================================
    recommendations = filtered.head(5)

    # =====================================================
    # FINAL RESULT
    # =====================================================
    result = recommendations[
        [
            "place_name",
            "category",
            "city",
            "price",
            "rating",
            "Image_URL"
        ]
    ].to_dict(orient="records")

    return jsonify(result)

