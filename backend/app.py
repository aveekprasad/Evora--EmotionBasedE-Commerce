from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client
from dotenv import load_dotenv
import os

# =========================
# LOAD ENV VARIABLES
# =========================
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("❌ Missing Supabase environment variables")

# =========================
# INIT APP
# =========================
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# =========================
# INIT SUPABASE
# =========================
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# =========================
# HOME ROUTE
# =========================
@app.route("/")
def home():
    return "Evora Backend (Supabase) 🚀"

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
        return jsonify({"error": str(e)}), 500

# =========================
# ADD PRODUCT (OPTIONAL CRUD)
# =========================
@app.route("/products", methods=["POST"])
def add_product():
    try:
        data = request.json

        response = supabase.table("products").insert({
            "name": data.get("name"),
            "image": data.get("image"),
            "price": data.get("price"),
            "rating": data.get("rating"),
            "emotion": data.get("emotion")
        }).execute()

        return jsonify(response.data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# UPDATE PRODUCT
# =========================
@app.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    try:
        data = request.json

        response = supabase.table("products") \
            .update(data) \
            .eq("id", product_id) \
            .execute()

        return jsonify(response.data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# DELETE PRODUCT
# =========================
@app.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    try:
        response = supabase.table("products") \
            .delete() \
            .eq("id", product_id) \
            .execute()

        return jsonify(response.data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(debug=True)