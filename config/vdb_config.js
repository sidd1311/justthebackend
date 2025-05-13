const { ChromaClient } = require("chromadb");

const chroma = new ChromaClient();
let collection;

// Initialize ChromaDB
async function initDB() {
    collection = await chroma.getOrCreateCollection({ name: "research_papers" });
}

// Get the collection instance
async function getCollection() {
    if (!collection) {
        await initDB();
    }
    return collection;
}

module.exports = { initDB, getCollection };
