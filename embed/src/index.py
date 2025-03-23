import faiss

vector_dim = 384
index = faiss.IndexIDMap(faiss.IndexFlatL2(vector_dim))
