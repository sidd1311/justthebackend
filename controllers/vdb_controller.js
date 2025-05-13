const { getCollection } = require("../config/vdb_config");
const crypto = require("crypto");

// Add a research paper to the database
async function addPaper(req, res) {
    try {
        const { text, skinType } = req.body;
        if (!text || !skinType) {
            return res.status(400).json({ error: "Text and skinType are required" });
        }

        const collection = await getCollection();
        await collection.add({
            ids: [crypto.randomUUID()],
            documents: [text],
            metadatas: [{ skin_type: skinType }],
        });

        res.json({ message: "Paper added successfully." });
    } catch (error) {
        console.error("Error adding paper:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Query relevant papers
async function queryPapers(req, res) {
    try {
        const { query, skinType, embedding } = req.body;
        if (!query || !skinType || !embedding) {
            return res.status(400).json({ error: "Query, skinType, and embedding are required" });
        }

        const collection = await getCollection();
        const results = await collection.query({
            queryEmbeddings: [embedding],
            nResults: 3,
            where: { skin_type: { $in: [skinType, "general"] } }, // Always include general papers
        });

        const documents = results.metadatas.map((item) => item.documents).join("\n\n");
        res.json({ documents });
    } catch (error) {
        console.error("Error querying papers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { addPaper, queryPapers };
