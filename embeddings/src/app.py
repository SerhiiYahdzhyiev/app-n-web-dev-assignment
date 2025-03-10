import os
import json
import logging

from flask import Flask, request, jsonify
from model import generate_embedding
from waitress import serve
from dotenv import load_dotenv
from redis import Redis

from qdrant_client.models import PointStruct

from db import client


logger = logging.getLogger("waitress")
logger.setLevel(logging.INFO)

load_dotenv()

HOST = os.environ.get("HOST")
PORT = int(os.environ.get("PORT"))

CACHE_HOST = os.environ.get("CACHE_HOST")
CACHE_PORT = int(os.environ.get("CACHE_PORT"))
CACHE_EXP = int(os.environ.get("CACHE_EXP"))

QD_HOST = os.environ.get("QD_HOST")
QD_PORT = int(os.environ.get("QD_PORT"))

app = Flask(__name__)

cache = Redis(
    host=CACHE_HOST,
    port=CACHE_PORT,
    db=0,
    decode_responses=True
)

@app.route("/embed", methods=["POST"])
def embed_text():
    data = request.json
    id = data.get("id", "")
    text = data.get("text", "")

    _uuid = int(id, 16) % (2**63) # to int64
    logger.info(f"uuid: {_uuid}")

    candidates = client.retrieve(
        collection_name="products",
        with_vectors=True,
        ids=[_uuid]
    )

    if len(candidates):
        return jsonify({"embedding": candidates[0].vector})

    if not id:
        return jsonify({"error": "Id is required!"}), 400

    if not text:
        return jsonify({"error": "Text is required!"}), 400

    cached = cache.get(id)
    if cached:
        logger.info("Returning cached embedding...")
        return json.loads(cached)

    embedding = generate_embedding(text)
    logger.info("Saving embedding to Qdrant...")
    o_info = client.upsert(
        collection_name="products",
        wait=True,
        points=[PointStruct(id=_uuid, vector=embedding)]
    )
    logger.info(o_info)
    logger.info("Caching the embedding...")
    cache.setex(id, CACHE_EXP, json.dumps(embedding))

    return jsonify({"embedding": embedding})

if __name__ == "__main__":
    serve(app, host=HOST, port=PORT)
