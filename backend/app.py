from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ✅ VERY IMPORTANT (explicit origin)
CORS(app)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# =========================
# GET PRODUCTS
# =========================
@app.route("/products", methods=["GET"])
def get_products():
    try:
        emotion = request.args.get("emotion")

        query = supabase.table("products").select("*")

        if emotion:
            query = query.eq("emotion", emotion)

        response = query.execute()

        return jsonify(response.data)

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


# =========================
# ADD PRODUCT
# =========================
@app.route("/add-product", methods=["POST"])
def add_product():
    try:
        data = request.get_json()

        response = supabase.table("products").insert(data).execute()

        return jsonify({
            "message": "Product added successfully ✅",
            "data": response.data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)