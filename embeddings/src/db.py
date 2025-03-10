import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient

load_dotenv()

QD_HOST = os.environ.get("QD_HOST")
QD_PORT = os.environ.get("QD_PORT")

client = QdrantClient(QD_HOST, port=QD_PORT)

client.recreate_collection(
    collection_name="products",
    vectors_config={"size": 384, "distance": "Cosine"},
)
