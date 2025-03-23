import numpy as np

from embeddings import get_embedding
from index import index
from faiss import IndexIDMap, os
from faiss_utils import load_faiss, save_faiss
from flask import Flask, request, jsonify
from logging import INFO, getLogger
from waitress import serve
from pymongo import MongoClient

app = Flask(__name__)
logger = getLogger("waitress")

app.logger.handlers = logger.handlers
app.logger.setLevel(INFO)

index_: IndexIDMap = load_faiss(app.logger) or index
id_map = {}

def build_initial_index():
    app.logger.info("Building initial FAISS index...") 
    try:
        name = os.environ.get("DB_USER")
        passwd = os.environ.get("DB_PASSWORD")
        db_name = os.environ.get("DB_NAME", "ecom")
        uri = f"mongodb://{name}:{passwd}@database:27017"

        client = MongoClient(uri)
        db = client[db_name]
        products = db["products"]
        docs = products.find()

        for product in docs:
            str_id = str(product["_id"])
            app.logger.info(f"Processing product {str_id}")

            text = product.get("description", "")
            if not text:
                continue

            embedding = get_embedding(text).reshape(1, -1)
            int_id = int(str_id[-8:], 16)

            index_.add_with_ids(embedding, np.array([int_id], dtype=np.int64))
            id_map[int_id] = str_id

        app.logger.info("FAISS index built successfully.")

    except Exception as e:
        app.logger.error(f"Failed to build FAISS index: {e}")

@app.get("/")
def hello():
    return "Hello, FAISS!"

@app.post("/embed")
def embed():
    payload = request.json or {}

    mongo_id = payload.get("id")
    text = payload.get("text")

    if not mongo_id or not text:
        app.logger.error(f"Invalid payload: {payload}")
        return jsonify({"message": "Invalid payload"}), 400 

    try:
        app.logger.info(f"Generating embedding for {mongo_id}...")
        embedding = get_embedding(text).reshape(1, -1)
        int_id = int(mongo_id[-8:], 16)

        index_.add_with_ids(embedding, np.array([int_id], dtype=np.int64))
        id_map[int_id] = mongo_id

        return jsonify({"message": "Embedding stored", "id": mongo_id}), 200

    except Exception as e:
        app.logger.error(f"Embedding failed: {e}")
        return jsonify({"message": "Failed to store embedding"}), 500

@app.post("/search")
def search():
    payload = request.json or {}
    text = payload.get("text")
    k = int(payload.get("k", 5))

    if not text:
        return jsonify({"message": "Text query is required"}), 400 

    try:
        embedding = get_embedding(text).reshape(1, -1)
        distances, indices = index_.search(embedding, k)

        results = []
        for idx, dist in zip(indices[0], distances[0]):
            if idx == -1:
                continue
            results.append({"id": id_map.get(idx, "unknown"), "distance": float(dist)})

        return jsonify({"results": results}), 200

    except Exception as e:
        app.logger.error(f"Search failed: {e}")
        return jsonify({"message": "Search failed"}), 500

if __name__ == "__main__":
    try:
        build_initial_index()
        app.debug = True
        app.logger.info("Starting embedding service...")
        serve(app, host="0.0.0.0", port=3096)
    except Exception as e:
        app.logger.error(f"Fatal error: {e}")
    finally:
        save_faiss(index_, app.logger)
        app.logger.info("FAISS index saved.")
