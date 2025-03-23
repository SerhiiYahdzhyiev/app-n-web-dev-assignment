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

index_: IndexIDMap = load_faiss(app.logger) or index;

id_map = dict()

if not index_:
    index_ = index

def build_initial_index():
    name = os.environ.get("DB_USER")
    passwd = os.environ.get("DB_PASSWORD")
    db_name = os.environ.get("DB_NAME") or "ecom"
    uri = f"mongodb://{name}:{passwd}@database:27017"
    client = MongoClient(uri)
    db = client[db_name]
    products = db["products"]
    docs = products.find()

    for product in docs:
        str_id = str(product["_id"])
        app.logger.info(f"Ebedding {str_id}")
        text = product["description"]
        embedding = get_embedding(text)
        id = int(str(product["_id"])[-8:], 16)
        index_.add_with_ids(
            embedding,
            np.array([id], dtype=np.int64)
        )
        id_map[id] = str(product["_id"])

@app.get("/")
def hello():
    return "Hello"

@app.post("/embed")
def embed():
    payload: dict = request.json or dict()
    valid = payload.get("id", None) and payload.get("text", None)
    if not valid:
        app.logger.error(f"Got invalid payload: {payload}")
        return {"message":"Invalid payload!"}, 400 

    app.logger.info("Encoding embedding...")
    embedding = get_embedding(payload["text"])
    app.logger.info(embedding)

    id = int(payload["id"][-8:], 16)

    index_.add_with_ids(
        embedding,
        np.array([id], dtype=np.int64)
    )

    id_map[id] = payload["id"]

    return jsonify({"payload": payload}), 200

if __name__ == "__main__":
    try:
        build_initial_index()
        serve(app, host="0.0.0.0", port=3096)
    except:
        save_faiss(index_, app.logger)
