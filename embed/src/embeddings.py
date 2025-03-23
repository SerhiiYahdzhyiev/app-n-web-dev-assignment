from sentence_transformers import SentenceTransformer
from torch import Tensor

model = SentenceTransformer("all-MiniLM-L6-v2")

def get_embedding(text: str) -> Tensor:
  return model.encode(text).reshape(1,-1)
