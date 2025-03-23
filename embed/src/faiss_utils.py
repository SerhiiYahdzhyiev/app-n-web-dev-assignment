import os
import faiss

FAISS_FILE = "index.bin"

def save_faiss(index, logger):
    faiss.write_index(index, FAISS_FILE)
    logger.info("FAISS index saved!")

def load_faiss(logger):
    if os.path.exists(FAISS_FILE):
        index = faiss.read_index(FAISS_FILE)
        return index
    else:
        logger.warning("FAISS index file not found!")
        return None
