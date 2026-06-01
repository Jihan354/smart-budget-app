
import pandas as pd
import requests
import time
import urllib.parse

# =========================================================
# CSV
# =========================================================
input_csv = "indonesia_tourism_clean_for_ai (1).csv"

output_csv = "tourism_with_images.csv"

print(f"Membaca {input_csv}...")

df = pd.read_csv(input_csv)

# =========================================================
# STORAGE IMAGE
# =========================================================
image_urls = []

print("Memulai pencarian gambar wisata...\n")

# =========================================================
# USER AGENT
# =========================================================
HEADERS = {
    "User-Agent": "SmartBudgetTravelApp/1.0 (student_project@example.com)"
}

# =========================================================
# GET IMAGE WIKIPEDIA
# =========================================================
def get_wiki_image(place_name):

    try:

        # =====================================================
        # STEP 1 SEARCH ARTICLE
        # =====================================================
        search_query = urllib.parse.quote(place_name)

        search_url = (
            "https://id.wikipedia.org/w/api.php"
            f"?action=query"
            f"&list=search"
            f"&srsearch={search_query}"
            f"&utf8="
            f"&format=json"
        )

        search_res = requests.get(
            search_url,
            headers=HEADERS,
            timeout=10
        ).json()

        # =====================================================
        # NO RESULT
        # =====================================================
        if not search_res.get("query", {}).get("search"):

            return None

        # =====================================================
        # BEST TITLE
        # =====================================================
        best_title = (
            search_res["query"]["search"][0]["title"]
        )

        # =====================================================
        # STEP 2 GET IMAGE
        # =====================================================
        summary_url = (
            "https://id.wikipedia.org/api/rest_v1/page/summary/"
            f"{urllib.parse.quote(best_title)}"
        )

        summary_res = requests.get(
            summary_url,
            headers=HEADERS,
            timeout=10
        ).json()

        # =====================================================
        # ORIGINAL IMAGE
        # =====================================================
        if "originalimage" in summary_res:

            return summary_res["originalimage"]["source"]

        # =====================================================
        # THUMBNAIL
        # =====================================================
        elif "thumbnail" in summary_res:

            return summary_res["thumbnail"]["source"]

    except Exception:

        return None

    return None

# =========================================================
# LOOP DATASET
# =========================================================
for index, row in df.iterrows():

    place_name = row["place_name"]

    print(f"Mencari gambar: {place_name}")

    img_url = get_wiki_image(place_name)

    # =====================================================
    # FOUND
    # =====================================================
    if img_url:

        image_urls.append(img_url)

        print(f"[✅ Ditemukan] {place_name}")

    # =====================================================
    # FALLBACK
    # =====================================================
    else:

        fallback_url = (
            f"https://picsum.photos/seed/"
            f"{place_name.replace(' ', '')}/400/250"
        )

        image_urls.append(fallback_url)

        print(
            f"[⚠️ Tidak ada gambar] "
            f"{place_name} -> Pakai Fallback"
        )

    # =====================================================
    # DELAY
    # =====================================================
    time.sleep(0.5)

# =========================================================
# SAVE CSV
# =========================================================
df["Image_URL"] = image_urls

df.to_csv(output_csv, index=False)

print(
    f"\n🎉 SELESAI!"
    f"\nFile baru tersimpan:"
    f" {output_csv}"
)

