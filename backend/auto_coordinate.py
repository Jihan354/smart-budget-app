
import pandas as pd
import time

from geopy.geocoders import Nominatim

# ======================================================
# LOAD DATASET
# ======================================================

df = pd.read_csv("tourism_with_images.csv")

# ======================================================
# GEOCODER
# ======================================================

geolocator = Nominatim(
    user_agent="smart_budget_app"
)

# ======================================================
# SAVE LATITUDE LONGITUDE
# ======================================================

latitudes = []
longitudes = []

# ======================================================
# LOOP DATA
# ======================================================

for index, row in df.iterrows():

    try:

        # ==================================================
        # PLACE NAME
        # ==================================================

        place = f"{row['place_name']}, {row['city']} Indonesia"

        print(f"Searching : {place}")

        # ==================================================
        # SEARCH LOCATION
        # ==================================================

        location = geolocator.geocode(place)

        # ==================================================
        # IF FOUND
        # ==================================================

        if location:

            latitudes.append(location.latitude)

            longitudes.append(location.longitude)

            print("FOUND")

        # ==================================================
        # IF NOT FOUND
        # ==================================================

        else:

            latitudes.append(None)

            longitudes.append(None)

            print("NOT FOUND")

    # ======================================================
    # ERROR
    # ======================================================

    except Exception as e:

        print(e)

        latitudes.append(None)

        longitudes.append(None)

        print("ERROR")

    # ======================================================
    # DELAY
    # ======================================================

    time.sleep(2)

# ======================================================
# ADD COLUMN
# ======================================================

df["Latitude"] = latitudes

df["Longitude"] = longitudes

# ======================================================
# SAVE NEW CSV
# ======================================================

df.to_csv("tourism_full.csv", index=False)

print("DONE")