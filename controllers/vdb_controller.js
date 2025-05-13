// const { getCollection } = require("../config/vdb_config");
// const crypto = require("crypto");

// // Add a research paper to the database
// async function addPaper(req, res) {
//     try {
//         const { text, skinType } = req.body;
//         if (!text || !skinType) {
//             return res.status(400).json({ error: "Text and skinType are required" });
//         }

//         const collection = await getCollection();
//         await collection.add({
//             ids: [crypto.randomUUID()],
//             documents: [text],
//             metadatas: [{ skin_type: skinType }],
//         });

//         res.json({ message: "Paper added successfully." });
//     } catch (error) {
//         console.error("Error adding paper:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }

// // Query relevant papers
// async function queryPapers(req, res) {
//     try {
//         const { query, skinType, embedding } = req.body;
//         if (!query || !skinType || !embedding) {
//             return res.status(400).json({ error: "Query, skinType, and embedding are required" });
//         }

//         const collection = await getCollection();
//         const results = await collection.query({
//             queryEmbeddings: [embedding],
//             nResults: 3,
//             where: { skin_type: { $in: [skinType, "general"] } }, // Always include general papers
//         });

//         const documents = results.metadatas.map((item) => item.documents).join("\n\n");
//         res.json({ documents });
//     } catch (error) {
//         console.error("Error querying papers:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }

// module.exports = { addPaper, queryPapers };

const { getCollection } = require("../config/vdb_config");
const crypto = require("crypto");
const Joi = require("joi");

// Joi schemas
const addPaperSchema = Joi.object({
    text: Joi.string().min(10).required(),
    skinType: Joi.string().max(50).required()
});

const queryPapersSchema = Joi.object({
    query: Joi.string().min(3).required(),
    skinType: Joi.string().max(50).required(),
    embedding: Joi.array().items(Joi.number()).min(1).required()
});

// Add a research paper to the database
async function addPaper(req, res) {
    const { error } = addPaperSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { text, skinType } = req.body;

    try {
        const collection = await getCollection();
        await collection.add({
            ids: [crypto.randomUUID()],
            documents: [text],
            metadatas: [{ skin_type: skinType }],
        });

        res.json({ message: "Paper added successfully." });
    } catch (err) {
        console.error("Error adding paper:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Query relevant papers
async function queryPapers(req, res) {
    const { error } = queryPapersSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { query, skinType, embedding } = req.body;

    try {
        const collection = await getCollection();
        const results = await collection.query({
            queryEmbeddings: [embedding],
            nResults: 3,
            where: { skin_type: { $in: [skinType, "general"] } },
        });

        const documents = results.documents?.flat() || [];
        res.json({ documents });
    } catch (err) {
        console.error("Error querying papers:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { addPaper, queryPapers };
