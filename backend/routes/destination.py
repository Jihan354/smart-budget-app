
from flask import Blueprint, request, jsonify
import pandas as pd
import math

destination_bp = Blueprint("destination", __name__)

# ======================================================
# LOAD CSV
# ======================================================

df = pd.read_csv("tourism_full.csv")

# ======================================================
# REMOVE DUPLICATE WISATA
# ======================================================

df = df.drop_duplicates(subset=["place_name"])

# ======================================================
# HAVERSINE FORMULA
# ======================================================

def calculate_distance(lat1, lon1, lat2, lon2):

    R = 6371

    dlat = math.radians(lat2 - lat1)

    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


# ======================================================
# NEARBY TOURISM
# ======================================================

@destination_bp.route("/nearby-tourism", methods=["POST"])
def nearby_tourism():

    data = request.json

    user_lat = data["latitude"]

    user_lon = data["longitude"]

    wisata_list = []

    # ==================================================
    # LOOP DATASET
    # ==================================================

    for _, row in df.iterrows():

        # ==============================================
        # SKIP EMPTY COORDINATE
        # ==============================================

        if pd.isna(row["Latitude"]) or pd.isna(row["Longitude"]):
            continue

        try:

            # ==========================================
            # IMAGE URL
            # ==========================================

            image_url = str(row["Image_URL"])

            # ==========================================
            # SKIP BAD IMAGE
            # ==========================================

            if (
                "svg" in image_url.lower()
                or "logo" in image_url.lower()
                or pd.isna(image_url)
            ):
                continue

            # ==========================================
            # CALCULATE DISTANCE
            # ==========================================

            distance = calculate_distance(
                user_lat,
                user_lon,
                row["Latitude"],
                row["Longitude"]
            )

            # ==========================================
            # SAVE RESULT
            # ==========================================

            wisata_list.append({
                "name": row["place_name"],
                "city": row["city"],
                "category": row["category"],
                "price": row["price"],
                "rating": row["rating"],
                "image": image_url,
                "latitude": row["Latitude"],
                "longitude": row["Longitude"],
                "distance": round(distance, 1)
            })

        except Exception as e:

            print(e)

            continue

    # ==================================================
    # SORT NEAREST
    # ==================================================

    wisata_list = sorted(
        wisata_list,
        key=lambda x: x["distance"]
    )

    # ==================================================
    # TAKE 12 NEAREST
    # ==================================================

    nearest = wisata_list[:20]

    return jsonify(nearest)