from flask import Blueprint, request, jsonify

prediction_bp = Blueprint("prediction", __name__)

@prediction_bp.route("/predict", methods=["POST"])
def predict():
    data = request.json

    days = int(data.get("days", 1))
    destination = data.get("destination", "bali")
    budget_type = data.get("budget_type", "medium")

    # ================= VALIDASI =================
    if days < 1 or days > 30:
        return jsonify({"error": "Days harus 1-30"}), 400

    # ================= BASE BIAYA =================
    # update: breakdown travel (lebih realistis)
    if destination == "bali":
        transport = 400000
        hotel_per_day = 300000
        food_per_day = 100000
        activity_per_day = 50000
    elif destination == "jakarta":
        transport = 200000
        hotel_per_day = 250000
        food_per_day = 80000
        activity_per_day = 40000
    else:  # luar negeri
        transport = 1500000
        hotel_per_day = 700000
        food_per_day = 200000
        activity_per_day = 150000

    # ================= MULTIPLIER =================
    if budget_type == "low":
        multiplier = 0.8
    elif budget_type == "high":
        multiplier = 1.5
    else:
        multiplier = 1.0

    # ================= HITUNG =================
    transport_total = int(transport * multiplier)
    hotel_total = int(hotel_per_day * days * multiplier)
    food_total = int(food_per_day * days * multiplier)
    activity_total = int(activity_per_day * days * multiplier)

    total = transport_total + hotel_total + food_total + activity_total

    return jsonify({
        "transport": transport_total,
        "hotel": hotel_total,
        "food": food_total,
        "activity": activity_total,
        "total": total
    })