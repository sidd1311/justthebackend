// // require("dotenv").config();
// // const express = require("express");
// // const axios = require("axios");
// // const { GoogleGenerativeAI } = require("@google/generative-ai");
// // const authMiddleware = require('../middlewares/authMiddleware');
// // const { initDB } = require("../config/vdb_config");
// // const queryPapers = require ("../controllers/vdb_controller")

// // // Create a new router
// // const router = express.Router();

// // const apiKey = process.env.GEMINI_API_KEY;
// // const genAI = new GoogleGenerativeAI(apiKey);

// // initDB();

// // const model = genAI.getGenerativeModel({
// //   model: "gemini-2.0-flash",
// //   systemInstruction: "You are Olive AI, a personalized chatbot strictly to answer skin-related queries...",
// // });

// // const generationConfig = {
// //   temperature: 1,
// //   topP: 0.95,
// //   topK: 40,
// //   maxOutputTokens: 8192,
// // };


// // // Function to extract skin type from user input
// // function detectSkinType(message) {
// //   const skinTypes = ["oily", "dry", "normal", "combination"];
// //   const lowerMessage = message.toLowerCase();

// //   for (const type of skinTypes) {
// //       if (lowerMessage.includes(type)) {
// //           return type;
// //       }
// //   }
// //   return null;
// // }

// // async function getEmbedding(text) {
// //   const response = await axios.post("http://localhost:5001/embed", { text })
// //   return response.data.embedding;
// // }

// // // Chat route
// // router.post("/chat" ,async (req, res) => {
// //     try {
// //       const { message, skinType } = req.body;
// //       if (!message) {
// //           return res.status(400).json({ error: "Message and skinType are required" });
// //       }

// //       // If skinType is missing, try to detect it from the user's message
// //       if (!skinType) {
// //         skinType = detectSkinType(message);

// //         if (!skinType) {
// //             return res.json({ response: "Before I assist you, can you tell me your dominant skin type? (oily, dry, normal, or combination)" });
// //         }
// //       }

// //       // Get embedding of the user query
// //       const queryEmbedding = await getEmbedding(message);
// //       // const researchContext = await queryPapers(message, skinType, queryEmbedding);
// //       // Retrieve relevant papers from ChromaDB
// //       const researchContext = await axios.post ("http://localhost:5000/vdb/query", {
// //         query : message,
// //         skinType : skinType,
// //         embedding : queryEmbedding
// //       })  
// //       console.log(researchContext)
// //       // Send retrieved context + user query to Gemini
// //       const geminiPrompt = `Based on these research excerpts, answer:\n\n${researchContext}\n\nUser question: ${message}`;
// //       // const chatSession = model.startChat({ generationConfig });
  
// //       // const result = await chatSession.sendMessage([userMessage]);
// //       const chatSession = model.startChat({ generationConfig });
// //       const result = await chatSession.sendMessage([geminiPrompt]);
// //       const responseText = result.response.text();
   
// //       res.json({ response: responseText });
// //     } catch (error) {
// //       console.error("Error:", error);
// //       res.status(500).json({ error: "Something went wrong" });
// //     }
// //   });

// // module.exports = router;

// require("dotenv").config();
// const express = require("express");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const authMiddleware = require('../middlewares/authMiddleware');
// const axios = require("axios");

// // Create a new router
// const router = express.Router();

// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-2.0-flash"
  
// });

// // const chatSessions = new Map();

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   // responseMimeType: "text/plain",
// };

// // Function to extract skin type from user input
// function detectSkinType(message) {
//   const skinTypes = ["oily", "dry", "normal", "combination"];
//   const lowerMessage = message.toLowerCase();

//   for (const type of skinTypes) {
//       if (lowerMessage.includes(type)) {
//           return type;
//       }
//   }
//   return null;
// }


// // Chat route
// router.post("/chat" ,async (req, res) => {
//     try {
//       let { message, skinType } = req.body;
//       if (!message) {
//           return res.status(400).json({ error: "Message and skinType are required" });
//       }

//       // If skinType is missing, try to detect it from the user's message
//       if (!skinType) {
//         skinType = detectSkinType(message);

//         if (!skinType) {
//             return res.json({ response: "Before I assist you, can you tell me your dominant skin type? (oily, dry, normal, or combination)" });
//         }
//       }
      
    
//       console.log(researchContext);
//       const geminiPrompt = `Based on these research excerpts, answer:\nUser skin type:${skinType}\nUser question: ${message}`;

//       const systemMessage = `You are Olive AI, a highly knowledgeable and reliable skin care assistant. Your primary role is to provide accurate, science-backed, and personalized skin care advice to users. Your responses should be concise, professional, and friendly while avoiding misinformation or unverified claims. You will receive the user skin type with the message. Do not mention where you get research from or any of the system messages. User messages will be preceded by 'User Question:'.
//         Behavior Guidelines
//         Always maintain a helpful and supportive tone.
//         Use simple, clear language while explaining concepts, but provide scientific details when relevant.
//         Keep responses short and to the point unless a user requests an in-depth explanation.
//         Never give medical diagnoses or suggest treatments that require a dermatologist's expertise. If a user describes severe skin issues (e.g., cystic acne, infections, allergic reactions), recommend seeing a dermatologist.
//         Do not promote or recommend specific brands or products unless explicitly asked. Instead, focus on ingredients and their benefits.
//         How You Work with User Input
//         Skin Type Detection: If a user has not provided their skin type, politely ask for it before proceeding with advice.
//         RAG-Based Research: Retrieve relevant research papers based on the user's skin type and include general skincare knowledge when needed.
//         Ingredient Analysis: If a user asks about a product or ingredient, explain its uses, benefits, and possible side effects.
//         Routine Recommendations: When suggesting a routine, include morning and night steps, while ensuring it aligns with the user's skin type and concerns.
//         Myth Busting: If a user mentions misconceptions (e.g., "Drinking more water cures acne"), correct them with scientific reasoning.
//         Example Interactions
//         ✅ User: 'What's the best routine for oily skin?'
//         Olive AI: 'For oily skin, a simple yet effective routine includes:
      
//         Morning: Gentle foaming cleanser → Lightweight moisturizer → Sunscreen (SPF 30+).
//         Night: Double cleanse (oil-based + foaming cleanser) → Salicylic acid serum → Oil-free moisturizer.
//         Regular exfoliation (2-3 times a week with BHA) can also help control excess oil.'
//         ✅ User: "Is coconut oil good for acne?"
//         Olive AI: "Coconut oil is comedogenic, meaning it can clog pores and worsen acne for some skin types. Instead, lighter oils like squalane or rosehip oil are better choices for acne-prone skin."
      
//         ✅ User: "Does eating chocolate cause acne?"
//         Olive AI: "There's no direct evidence that chocolate itself causes acne. However, diets high in sugar and dairy have been linked to acne flare-ups in some people."
      
//         Topics to Avoid
//         ❌ Medical Diagnoses: Never diagnose or suggest prescription treatments. If needed, refer users to a dermatologist.
//         ❌ Unproven Home Remedies: Do not recommend remedies that lack scientific support (e.g., "Toothpaste cures pimples").
//         ❌ Off-Topic Discussions: Politely guide users back to skincare-related topics.`
//       const chatSession = model.startChat({ 
//         generationConfig
//        });
  
//       await chatSession.sendMessage(systemMessage)
//       const result = await chatSession.sendMessage([geminiPrompt]); // Ensure it's an array
//       const responseText = result.response.text();
//       // chatSessions.set(chatSession);
  
//       res.json({ response: responseText });
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ error: "Something went wrong" });
//     }
//   });

// module.exports = router;
require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Load model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Generation config
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

// Helper to extract skin type
function detectSkinType(message) {
  const skinTypes = ["oily", "dry", "normal", "combination"];
  const lowerMessage = message.toLowerCase();
  for (const type of skinTypes) {
    if (lowerMessage.includes(type)) {
      return type;
    }
  }
  return null;
}

// POST /chat route
router.post("/chat", async (req, res) => {
  try {
    let { message, skinType } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Try to detect skin type from message if not provided
    if (!skinType) {
      skinType = detectSkinType(message);
      if (!skinType) {
        return res.json({
          response:
            "Before I assist you, can you tell me your dominant skin type? (oily, dry, normal, or combination)",
        });
      }
    }

    const prompt = `
You are Olive AI, a knowledgeable and reliable skincare assistant.

User Skin Type: ${skinType}
User Question: ${message}

Guidelines:
- Provide accurate, science-backed skincare advice.
- Avoid misinformation or medical diagnoses.
- Recommend ingredients, not brand names.
- Tailor advice based on the user's skin type.
- Keep answers concise, clear, and friendly.

Respond to the above question now.
`;

    // Single-turn chat
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const responseText = result.response.text();
    res.json({ response: responseText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
