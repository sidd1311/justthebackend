import chromadb


chroma_client = chromadb.HttpClient(host="localhost", port=8000)
print("Connected to ChromaDB server!")
# input("Press Enter to stop...")