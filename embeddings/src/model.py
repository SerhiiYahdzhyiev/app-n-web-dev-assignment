import os
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

MODEL = os.environ.get("MODEL")

model = SentenceTransformer(MODEL)

def generate_embedding(text):
    embedding = model.encode(text).tolist()
    return embedding
