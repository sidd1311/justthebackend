// const { initDB } = require("./config/vdb_config");
// const { addPaper } = require("./controllers/vdb_controller")


// async function main() {
//     await initDB();

//     await addPaper("Hyaluronic acid helps retain moisture in the skin.", "dry");
//     await addPaper("Oily skin benefits from salicylic acid and clay masks.", "oily");
//     await addPaper("Regular hydration is necessary for all skin types.", "general");

//     console.log("Papers added successfully.");
// }

// main();
const axios = require("axios");

async function addPaperRequest(text, skinType) {
    try {
        const response = await axios.post("http://localhost:5000/vdb/add", {
            text,
            skinType,
        });
        console.log("Response:", response.data);
    } catch (error) {
        console.error("Error adding paper:", error.response ? error.response.data : error.message);
    }
}

async function main() {
    await addPaperRequest("Hyaluronic acid helps retain moisture in the skin.", "dry");
    await addPaperRequest("Oily skin benefits from salicylic acid and clay masks.", "oily");
    await addPaperRequest("Regular hydration is necessary for all skin types.", "general");

    console.log("Papers added successfully.");
}

main();
