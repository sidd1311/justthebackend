// // // // // const { MongoClient, ObjectId } = require('mongodb');
// // // // // const TeachableMachine = require("@sashido/teachablemachine-node");
// // // // // require('dotenv').config();

// // // // // const url = process.env.MONGO_URL;
// // // // // const client = new MongoClient(url);
// // // // // const dbName = 'HTM';

// // // // // // Initialize the Teachable Machine model
// // // // // const model = new TeachableMachine({
// // // // //     modelUrl: process.env.MODEL_API
// // // // // });

// // // // // // Connect to MongoDB
// // // // // async function connectToDatabase() {
// // // // //     try {
// // // // //         await client.connect();
// // // // //         console.log("Connected to MongoDB");
// // // // //     } catch (err) {
// // // // //         console.error("Error connecting to MongoDB:", err);
// // // // //     }
// // // // // }

// // // // // connectToDatabase();

// // // // // // Process image upload and classification
// // // // // exports.processImage = async (req, res) => {
// // // // //     const imageUrl = req.file ? req.file.path : null;
// // // // //     const userId = req.user.id; // Extract user ID from authMiddleware

// // // // //     if (!imageUrl) {
// // // // //         return res.status(400).send("No image uploaded!");
// // // // //     }

// // // // //     console.log(imageUrl); // Log image URL for debugging

// // // // //     try {
// // // // //         // Classify the uploaded image using the Teachable Machine model
// // // // //         const predictions = await model.classify({ imageUrl: imageUrl });
// // // // //         console.log(predictions);

// // // // //         const processedPredictions = predictions.map(p => ({
// // // // //             class: p.class,
// // // // //             percentage: (p.score * 100).toFixed(0) // Convert score to percentage and round
// // // // //         }));

// // // // //         // Find the major skin type (one with a percentage > 50%)
// // // // //         const majorType = processedPredictions.find(p => p.percentage > 50)?.class || null;

// // // // //         // Prepare data for database update
// // // // //         const skinData = {
// // // // //             majorType,
// // // // //             predictions
// // // // //         };

// // // // //         // Update the user's skin type in the database
// // // // //         const db = client.db(dbName);
// // // // //         const collection = db.collection('users'); // Assuming user data is stored in the 'users' collection

// // // // //         const result = await collection.updateOne(
// // // // //             { _id: new ObjectId(userId) },
// // // // //             { $set: { skinType: skinData } }
// // // // //         );

// // // // //         if (result.modifiedCount === 0) {
// // // // //             return res.status(500).send("Failed to update user data in the database!");
// // // // //         }

// // // // //         // Send response with processed predictions and major skin type
// // // // //         res.json({
// // // // //             skinTypes: predictions,
// // // // //             majorType
// // // // //         });

// // // // //     } catch (error) {
// // // // //         console.error("Error:", error);
// // // // //         res.status(500).send("Something went wrong during classification!");
// // // // //     }
// // // // // };

// // // // const { Client } = require("@gradio/client");
// // // // const axios = require("axios");
// // // // require("dotenv").config();



// // // // /**
// // // //  * Handles image processing and classification
// // // //  * @param {Request} req - Express request object
// // // //  * @param {Response} res - Express response object
// // // //  */
// // // // exports.processImage = async (req, res) => {
// // // //   faceUrl = process.env.MODEL_API_FD;
// // // //   modelUrl = process.env.MODEL_API_US;
// // // //   const imageUrl = req.file ? req.file.path : null;

// // // //   if (!imageUrl) {
// // // //     return res.status(400).send("No image uploaded!");
// // // //   }

// // // //   console.log("Uploaded Image URL:", imageUrl);

// // // //   try {
// // // //     // Call Flask API for classification
// // // //     const client = await Client.connect("arnavktis/hello-skin1");
// // // //     const result = await client.predict("/predict", { 		
// // // // 		img_url: imageUrl, 
// // // //     });
// // // //     console.log(result)

// // // //     const flaskResponse = await axios.post(`${modelUrl}`, { url: imageUrl });

// // // //     const predictedClass = flaskResponse.data.predicted_class;

// // // //     let skinType = "";
// // // //     switch (predictedClass) {
// // // //       case 0:
// // // //         skinType = "Dry";
// // // //         break;
// // // //       case 1:
// // // //         skinType = "Normal";
// // // //         break;
// // // //       case 2:
// // // //         skinType = "Oily";
// // // //         break;
// // // //       default:
// // // //         skinType = "Failed to Determine Skin Type, Try Again";
// // // //     }
// // // //     console.log(skinType);
// // // //     // Render result page with classified skin type
// // // //     res.json({
// // // //             result
// // // //     });
// // // //   } catch (error) {
// // // //     console.error("Error processing image:", error);
// // // //     res.status(500).send("Something went wrong during classification!");
// // // //   }
// // // // };

// // // // const axios = require("axios");
// // // // require("dotenv").config();

// // // // /**
// // // //  * Handles image processing and classification
// // // //  * @param {Request} req - Express request object
// // // //  * @param {Response} res - Express response object
// // // //  */
// // // // exports.processImage = async (req, res) => {
// // // //   const faceUrl = process.env.MODEL_API_FD; // Unused? Remove if not needed.
// // // //   const modelUrl = process.env.MODEL_API_US;
// // // //   const imageUrl = req.file ? req.file.path : null;
// // // // console.log(imageUrl)
// // // //   if (!imageUrl) {
// // // //     return res.status(400).send("No image uploaded!");
// // // //   }

// // // //   console.log("Uploaded Image URL:", imageUrl);

// // // //   try {
// // // //     // Connect to your Hugging Face Space via Gradio Client

// // // //     // Call the Flask API for classification
// // // //     const flaskResponse = await axios.post("https://arnavktis-hello-skin1.hf.space/gradio_api/call/predict", { img_url: imageUrl });
// // // //     console.log(flaskResponse)
// // // //     const predictedClass = flaskResponse.data.predicted_class;

// // // //     let skinType = "";
// // // //     switch (predictedClass) {
// // // //       case 0:
// // // //         skinType = "Dry";
// // // //         break;
// // // //       case 1:
// // // //         skinType = "Normal";
// // // //         break;
// // // //       case 2:
// // // //         skinType = "Oily";
// // // //         break;
// // // //       default:
// // // //         skinType = "Failed to Determine Skin Type, Try Again";
// // // //     }
// // // //     console.log("Predicted skin type:", skinType);

// // // //     // Return both the Gradio result and the skin type classification
// // // //     res.json({
// // // //       gradioResult,
// // // //       predictedClass,
// // // //       skinType,
// // // //     });
// // // //   } catch (error) {
// // // //     console.error("Error processing image:", error);
// // // //     res.status(500).send("Something went wrong during classification!");
// // // //   }
// // // // };
// // // const axios = require("axios");
// // // require("dotenv").config();

// // // /**
// // //  * Handles image processing and classification
// // //  * @param {Request} req - Express request object
// // //  * @param {Response} res - Express response object
// // //  */
// // // exports.processImage = async (req, res) => {
// // //   const modelUrl = process.env.MODEL_API_US;
// // //   const imageUrl = req.file ? req.file.path : null;

// // //   if (!imageUrl) {
// // //     return res.status(400).send("No image uploaded!");
// // //   }

// // //   console.log("Uploaded Image URL:", imageUrl);

// // //   try {
// // //     // Call Hugging Face Gradio API
// // //     // const gradioResponse = await axios.post(
// // //     //   "https://arnavktis-hello-skin1.hf.space/gradio_api/call/predict",
// // //     //   { data: [imageUrl] }, // Corrected request format
// // //     //   { headers: { "Content-Type": "application/json" } }
// // //     // );

// // //     const { Client } = await import("@gradio/client");
// // //     const client = await Client.connect("arnavktis/hello-skin1");
// // //     const result = await client.predict("/predict", { 		
// // // 		img_url: imageUrl, 
// // // });
// // //     console.log(result)
    
// // //     // // Call Hugging Face Gradio API
// // //     // const gradioResponse = await axios.post(
// // //     //   "https://arnavktis-hello-skin1.hf.space/gradio_api/call/predict",
// // //     //   { data: [imageUrl] }, // Corrected request format
// // //     //   { headers: { "Content-Type": "application/json" } }
// // //     // );

// // //     // console.log("Gradio Response:", gradioResponse.data);


// // //     // Extract prediction result
// // //     const predictedClass = result.data.predicted_class;
// // //     const is_face = result.data.face_detected;
// // //     console.log(predictedClass, is_face)
// // //     if(!is_face) {
// // //         return res.status(422).json({message: "No face detected, Please try again"})
// // //     }
// // //     if (predictedClass === 0) skinType = "Dry";
// // //     else if (predictedClass === 1) skinType = "Normal";
// // //     else if (predictedClass === 2) skinType = "Oily";

// // //     console.log("Predicted skin type:", skinType);

// // //     // Return classification result
// // //     res.json({
// // //       predictedClass,
// // //       skinType,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error processing image:", error.response?.data || error.message);
// // //     res.status(500).send("Something went wrong during classification!");
// // //   }
// // // };

// // const axios = require("axios");
// // require("dotenv").config();

// // /**
// //  * Handles image processing and classification
// //  * @param {Request} req - Express request object
// //  * @param {Response} res - Express response object
// //  */
// // exports.processImage = async (req, res) => {
// //   const modelUrl = process.env.MODEL_API_US;
// //   const imageUrl = req.file ? req.file.path : null;

// //   if (!imageUrl) {
// //     return res.status(400).send("No image uploaded!");
// //   }

// //   console.log("Uploaded Image URL:", imageUrl);

// //   try {
// //     // Import Gradio Client dynamically
// //     const { Client } = await import("@gradio/client");
// //     const client = await Client.connect("arnavktis/hello-skin1");

// //     // Call model
// //     const result = await client.predict("/predict", { img_url: imageUrl });

// //     console.log("Gradio Result:", result);

// //     // Extract prediction result properly
// //     const responseData = result.data?.[0]; // Extract first object from array

// //     if (!responseData) {
// //       return res.status(500).json({ message: "Invalid response from model" });
// //     }

// //     const predictedClass = responseData.predicted_class;
// //     const is_face = responseData.face_detected;

// //     console.log("Predicted Class:", predictedClass, "Face Detected:", is_face);

// //     if (!is_face) {
// //       return res.status(422).json({ message: "No face detected, Please try again" });
// //     }

// //     let skinType = "Failed to Determine Skin Type, Try Again";
// //     if (predictedClass === 0) skinType = "Dry";
// //     else if (predictedClass === 1) skinType = "Normal";
// //     else if (predictedClass === 2) skinType = "Oily";

// //     console.log("Predicted skin type:", skinType);

// //     // Return classification result
// //     res.json({
// //       skinType,
// //     });
// //   } catch (error) {
// //     console.error("Error processing image:", error.response?.data || error.message);
// //     res.status(500).send("Something went wrong during classification!");
// //   }
// // };
// // // // const { MongoClient, ObjectId } = require('mongodb');
// // // // const TeachableMachine = require("@sashido/teachablemachine-node");
// // // // require('dotenv').config();

// // // // const url = process.env.MONGO_URL;
// // // // const client = new MongoClient(url);
// // // // const dbName = 'HTM';

// // // // // Initialize the Teachable Machine model
// // // // const model = new TeachableMachine({
// // // //     modelUrl: process.env.MODEL_API
// // // // });

// // // // // Connect to MongoDB
// // // // async function connectToDatabase() {
// // // //     try {
// // // //         await client.connect();
// // // //         console.log("Connected to MongoDB");
// // // //     } catch (err) {
// // // //         console.error("Error connecting to MongoDB:", err);
// // // //     }
// // // // }

// // // // connectToDatabase();

// // // // // Process image upload and classification
// // // // exports.processImage = async (req, res) => {
// // // //     const imageUrl = req.file ? req.file.path : null;
// // // //     const userId = req.user.id; // Extract user ID from authMiddleware

// // // //     if (!imageUrl) {
// // // //         return res.status(400).send("No image uploaded!");
// // // //     }

// // // //     console.log(imageUrl); // Log image URL for debugging

// // // //     try {
// // // //         // Classify the uploaded image using the Teachable Machine model
// // // //         const predictions = await model.classify({ imageUrl: imageUrl });
// // // //         console.log(predictions);

// // // //         const processedPredictions = predictions.map(p => ({
// // // //             class: p.class,
// // // //             percentage: (p.score * 100).toFixed(0) // Convert score to percentage and round
// // // //         }));

// // // //         // Find the major skin type (one with a percentage > 50%)
// // // //         const majorType = processedPredictions.find(p => p.percentage > 50)?.class || null;

// // // //         // Prepare data for database update
// // // //         const skinData = {
// // // //             majorType,
// // // //             predictions
// // // //         };

// // // //         // Update the user's skin type in the database
// // // //         const db = client.db(dbName);
// // // //         const collection = db.collection('users'); // Assuming user data is stored in the 'users' collection

// // // //         const result = await collection.updateOne(
// // // //             { _id: new ObjectId(userId) },
// // // //             { $set: { skinType: skinData } }
// // // //         );

// // // //         if (result.modifiedCount === 0) {
// // // //             return res.status(500).send("Failed to update user data in the database!");
// // // //         }

// // // //         // Send response with processed predictions and major skin type
// // // //         res.json({
// // // //             skinTypes: predictions,
// // // //             majorType
// // // //         });

// // // //     } catch (error) {
// // // //         console.error("Error:", error);
// // // //         res.status(500).send("Something went wrong during classification!");
// // // //     }
// // // // };

// // // const { Client } = require("@gradio/client");
// // // const axios = require("axios");
// // // require("dotenv").config();



// // // /**
// // //  * Handles image processing and classification
// // //  * @param {Request} req - Express request object
// // //  * @param {Response} res - Express response object
// // //  */
// // // exports.processImage = async (req, res) => {
// // //   faceUrl = process.env.MODEL_API_FD;
// // //   modelUrl = process.env.MODEL_API_US;
// // //   const imageUrl = req.file ? req.file.path : null;

// // //   if (!imageUrl) {
// // //     return res.status(400).send("No image uploaded!");
// // //   }

// // //   console.log("Uploaded Image URL:", imageUrl);

// // //   try {
// // //     // Call Flask API for classification
// // //     const client = await Client.connect("arnavktis/hello-skin1");
// // //     const result = await client.predict("/predict", { 		
// // // 		img_url: imageUrl, 
// // //     });
// // //     console.log(result)

// // //     const flaskResponse = await axios.post(`${modelUrl}`, { url: imageUrl });

// // //     const predictedClass = flaskResponse.data.predicted_class;

// // //     let skinType = "";
// // //     switch (predictedClass) {
// // //       case 0:
// // //         skinType = "Dry";
// // //         break;
// // //       case 1:
// // //         skinType = "Normal";
// // //         break;
// // //       case 2:
// // //         skinType = "Oily";
// // //         break;
// // //       default:
// // //         skinType = "Failed to Determine Skin Type, Try Again";
// // //     }
// // //     console.log(skinType);
// // //     // Render result page with classified skin type
// // //     res.json({
// // //             result
// // //     });
// // //   } catch (error) {
// // //     console.error("Error processing image:", error);
// // //     res.status(500).send("Something went wrong during classification!");
// // //   }
// // // };

// // // const axios = require("axios");
// // // require("dotenv").config();

// // // /**
// // //  * Handles image processing and classification
// // //  * @param {Request} req - Express request object
// // //  * @param {Response} res - Express response object
// // //  */
// // // exports.processImage = async (req, res) => {
// // //   const faceUrl = process.env.MODEL_API_FD; // Unused? Remove if not needed.
// // //   const modelUrl = process.env.MODEL_API_US;
// // //   const imageUrl = req.file ? req.file.path : null;
// // // console.log(imageUrl)
// // //   if (!imageUrl) {
// // //     return res.status(400).send("No image uploaded!");
// // //   }

// // //   console.log("Uploaded Image URL:", imageUrl);

// // //   try {
// // //     // Connect to your Hugging Face Space via Gradio Client

// // //     // Call the Flask API for classification
// // //     const flaskResponse = await axios.post("https://arnavktis-hello-skin1.hf.space/gradio_api/call/predict", { img_url: imageUrl });
// // //     console.log(flaskResponse)
// // //     const predictedClass = flaskResponse.data.predicted_class;

// // //     let skinType = "";
// // //     switch (predictedClass) {
// // //       case 0:
// // //         skinType = "Dry";
// // //         break;
// // //       case 1:
// // //         skinType = "Normal";
// // //         break;
// // //       case 2:
// // //         skinType = "Oily";
// // //         break;
// // //       default:
// // //         skinType = "Failed to Determine Skin Type, Try Again";
// // //     }
// // //     console.log("Predicted skin type:", skinType);

// // //     // Return both the Gradio result and the skin type classification
// // //     res.json({
// // //       gradioResult,
// // //       predictedClass,
// // //       skinType,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error processing image:", error);
// // //     res.status(500).send("Something went wrong during classification!");
// // //   }
// // // };
// // const axios = require("axios");
// // require("dotenv").config();

// // /**
// //  * Handles image processing and classification
// //  * @param {Request} req - Express request object
// //  * @param {Response} res - Express response object
// //  */
// // exports.processImage = async (req, res) => {
// //   const modelUrl = process.env.MODEL_API_US;
// //   const imageUrl = req.file ? req.file.path : null;

// //   if (!imageUrl) {
// //     return res.status(400).send("No image uploaded!");
// //   }

// //   console.log("Uploaded Image URL:", imageUrl);

// //   try {
// //     // Call Hugging Face Gradio API
// //     // const gradioResponse = await axios.post(
// //     //   "https://arnavktis-hello-skin1.hf.space/gradio_api/call/predict",
// //     //   { data: [imageUrl] }, // Corrected request format
// //     //   { headers: { "Content-Type": "application/json" } }
// //     // );

// //     const { Client } = await import("@gradio/client");
// //     const client = await Client.connect("arnavktis/hello-skin1");
// //     const result = await client.predict("/predict", { 		
// // 		img_url: imageUrl, 
// // });
// //     console.log(result)
    
// //     // // Call Hugging Face Gradio API
// //     // const gradioResponse = await axios.post(
// //     //   "https://arnavktis-hello-skin1.hf.space/gradio_api/call/predict",
// //     //   { data: [imageUrl] }, // Corrected request format
// //     //   { headers: { "Content-Type": "application/json" } }
// //     // );

// //     // console.log("Gradio Response:", gradioResponse.data);


// //     // Extract prediction result
// //     const predictedClass = result.data.predicted_class;
// //     const is_face = result.data.face_detected;
// //     console.log(predictedClass, is_face)
// //     if(!is_face) {
// //         return res.status(422).json({message: "No face detected, Please try again"})
// //     }
// //     if (predictedClass === 0) skinType = "Dry";
// //     else if (predictedClass === 1) skinType = "Normal";
// //     else if (predictedClass === 2) skinType = "Oily";

// //     console.log("Predicted skin type:", skinType);

// //     // Return classification result
// //     res.json({
// //       predictedClass,
// //       skinType,
// //     });
// //   } catch (error) {
// //     console.error("Error processing image:", error.response?.data || error.message);
// //     res.status(500).send("Something went wrong during classification!");
// //   }
// // };

// // const axios = require("axios");
// // require("dotenv").config();

// // /**
// //  * Handles image processing and classification
// //  * @param {Request} req - Express request object
// //  * @param {Response} res - Express response object
// //  */
// // exports.processImage = async (req, res) => {
// //   const modelUrl = process.env.MODEL_API_US;
// //   const imageUrl = req.file ? req.file.path : null;

// //   if (!imageUrl) {
// //     return res.status(400).send("No image uploaded!");
// //   }

// //   console.log("Uploaded Image URL:", imageUrl);

// //   try {
// //     // Import Gradio Client dynamically
// //     const { Client } = await import("@gradio/client");
// //     const client = await Client.connect("arnavktis/hello-skin1");

// //     // Call model
// //     const result = await client.predict("/predict", { img_url: imageUrl });

// //     console.log("Gradio Result:", result);

// //     // Extract prediction result properly
// //     const responseData = result.data?.[0]; // Extract first object from array

// //     if (!responseData) {
// //       return res.status(500).json({ message: "Invalid response from model" });
// //     }

// //     const predictedClass = responseData.predicted_class;
// //     const is_face = responseData.face_detected;

// //     console.log("Predicted Class:", predictedClass, "Face Detected:", is_face);

// //     if (!is_face) {
// //       return res.status(422).json({ message: "No face detected, Please try again" });
// //     }

// //     let skinType = "Failed to Determine Skin Type, Try Again";
// //     if (predictedClass === 0) skinType = "Dry";
// //     else if (predictedClass === 1) skinType = "Normal";
// //     else if (predictedClass === 2) skinType = "Oily";

// //     console.log("Predicted skin type:", skinType);

// //     // Return classification result
// //     res.json({
// //       skinType,
// //     });
// //   } catch (error) {
// //     console.error("Error processing image:", error.response?.data || error.message);
// //     res.status(500).send("Something went wrong during classification!");
// //   }
// // };


// const axios = require("axios");
// require("dotenv").config();

// /**
//  * Handles image processing and classification
//  * @param {Request} req - Express request object
//  * @param {Response} res - Express response object
//  */
// exports.processImage = async (req, res) => {
//   const modelUrl = process.env.MODEL_API_US;
//   const imageUrl = req.file ? req.file.path : null;

//   if (!imageUrl) {
//     return res.status(400).send("No image uploaded!");
//   }

//   console.log("Uploaded Image URL:", imageUrl);

//   try {
//     // Import Gradio Client dynamically
//     const { Client } = await import("@gradio/client");
//     const client = await Client.connect("arnavktis/hello-skin1");

//     // Call model
//     const result = await client.predict("/predict", { img_url: imageUrl });

//     console.log("Gradio Result:", result);

//     // Extract prediction result properly
//     const responseData = result.data?.[0]; // Extract first object from array

//     if (!responseData) {
//       return res.status(500).json({ message: "Invalid response from model" });
//     }

//     const predictedClass = responseData.predicted_class;
//     const is_face = responseData.face_detected;
//     const dryPercentage = responseData.dry;
//     const normalPercentage = responseData.normal ;
//     const oilyPercentage = responseData.oily;

//     console.log("Predicted Class:", predictedClass, "Face Detected:", is_face);
//     console.log("Confidence Scores - Dry:", dryPercentage, "Normal:", normalPercentage, "Oily:", oilyPercentage);

//     if (!is_face) {
//       return res.status(422).json({ message: "No face detected, Please try again" });
//     }

//     let skinType = "Failed to Determine Skin Type, Try Again";
//     if (predictedClass === 0) skinType = "Dry";
//     else if (predictedClass === 1) skinType = "Normal";
//     else if (predictedClass === 2) skinType = "Oily";

//     console.log("Percentages: " ,dryPercentage, normalPercentage, oilyPercentage) 
//     console.log("Predicted skin type:", skinType);

//     // Return classification result with confidence scores
//     res.json({
//       skinType,
//       confidenceScores: {
//         dry: dryPercentage?.toFixed(2) || "N/A",
//         normal: normalPercentage?.toFixed(2) || "N/A",
//         oily: oilyPercentage?.toFixed(2) || "N/A"
//       },
//       primaryConfidence: getPrimaryConfidence(predictedClass, dryPercentage, normalPercentage, oilyPercentage)
//     });
//   } catch (error) {
//     console.error("Error processing image:", error.response?.data || error.message);
//     res.status(500).send("Something went wrong during classification!");
//   }
// };

// /**
//  * Get the confidence percentage for the primary prediction
//  * @param {number} predictedClass - The predicted class (0, 1, or 2)
//  * @param {number} dryPercentage - Confidence score for dry skin
//  * @param {number} normalPercentage - Confidence score for normal skin
//  * @param {number} oilyPercentage - Confidence score for oily skin
//  * @returns {string} Formatted confidence percentage
//  */
// function getPrimaryConfidence(predictedClass, dryPercentage, normalPercentage, oilyPercentage) {
//   let primaryScore;
  
//   if (predictedClass === 0) {
//     primaryScore = dryPercentage;
//   } else if (predictedClass === 1) {
//     primaryScore = normalPercentage;
//   } else if (predictedClass === 2) {
//     primaryScore = oilyPercentage;
//   }
  
//   return primaryScore ? `${primaryScore.toFixed(2)}%` : "N/A";
// }

// // // // const { MongoClient, ObjectId } = require('mongodb');
// // // // const TeachableMachine = require("@sashido/teachablemachine-node");
// // // // require('dotenv').config();

// // // // const url = process.env.MONGO_URL;
// // // // const client = new MongoClient(url);
// // // // const dbName = 'HTM';

// // // // // Initialize the Teachable Machine model
// // // // const model = new TeachableMachine({
// // // //     modelUrl: process.env.MODEL_API
// // // // });

// // // // // Connect to MongoDB
// // // // async function connectToDatabase() {
// // // //     try {
// // // //         await client.connect();
// // // //         console.log("Connected to MongoDB");
// // // //     } catch (err) {
// // // //         console.error("Error connecting to MongoDB:", err);
// // // //     }
// // // // }

// // // // connectToDatabase();

// // // // // Process image upload and classification
// // // // exports.processImage = async (req, res) => {
// // // //     const imageUrl = req.file ? req.file.path : null;
// // // //     const userId = req.user.id; // Extract user ID from authMiddleware

// // // //     if (!imageUrl) {
// // // //         return res.status(400).send("No image uploaded!");
// // // //     }

// // // //     console.log(imageUrl); // Log image URL for debugging

// // // //     try {
// // // //         // Classify the uploaded image using the Teachable Machine model
// // // //         const predictions = await model.classify({ imageUrl: imageUrl });
// // // //         console.log(predictions);

// // // //         const processedPredictions = predictions.map(p => ({
// // // //             class: p.class,
// // // //             percentage: (p.score * 100).toFixed(0) // Convert score to percentage and round
// // // //         }));

// // // //         // Find the major skin type (one with a percentage > 50%)
// // // //         const majorType = processedPredictions.find(p => p.percentage > 50)?.class || null;

// // // //         // Prepare data for database update
// // // //         const skinData = {
// // // //             majorType,
// // // //             predictions
// // // //         };

// // // //         // Update the user's skin type in the database
// // // //         const db = client.db(dbName);
// // // //         const collection = db.collection('users'); // Assuming user data is stored in the 'users' collection

// // // //         const result = await collection.updateOne(
// // // //             { _id: new ObjectId(userId) },
// // // //             { $set: { skinType: skinData } }
// // // //         );

// // // //         if (result.modifiedCount === 0) {
// // // //             return res.status(500).send("Failed to update user data in the database!");
// // // //         }

// // // //         // Send response with processed predictions and major skin type
// // // //         res.json({
// // // //             skinTypes: predictions,
// // // //             majorType
// // // //         });

// // // //     } catch (error) {
// // // //         console.error("Error:", error);
// // // //         res.status(500).send("Something went wrong during classification!");
// // // //     }
// // // // };

// // // const { Client } = require("@gradio/client");
// // // const axios = require("axios");
// // // require("dotenv").config();



// // // /**
// // //  * Handles image processing and classification
// // //  * @param {Request} req - Express request object
// // //  * @param {Response} res - Express response object
// // //  */
// // // exports.processImage = async (req, res) => {
// // //   faceUrl = process.env.MODEL_API_FD;
// // //   modelUrl = process.env.MODEL_API_US;
// // //   const imageUrl = req.file ? req.file.path : null;

// // //   if (!imageUrl) {
// // //     return res.status(400).send("No image uploaded!");
// // //   }

// // //   console.log("Uploaded Image URL:", imageUrl);

// // //   try {
// // //     // Call Flask API for classification
// // //     const client = await Client.connect("arnavktis/hello-skin1");
// // //     const result = await client.predict("/predict", { 		
// // // 		img_url: imageUrl, 
// // //     });
// // //     console.log(result)

// // //     const flaskResponse = await axios.post(`${modelUrl}`, { url: imageUrl });

// // //     const predictedClass = flaskResponse.data.predicted_class;

// // //     let skinType = "";
// // //     switch (predictedClass) {
// // //       case 0:
// // //         skinType = "Dry";
// // //         break;
// // //       case 1:
// // //         skinType = "Normal";
// // //         break;
// // //       case 2:
// // //         skinType = "Oily";
// // //         break;
// // //       default:
// // //         skinType = "Failed to Determine Skin Type, Try Again";
// // //     }
// // //     console.log(skinType);
// // //     // Render result page with classified skin type
// // //     res.json({
// // //             result
// // //     });
// // //   } catch (error) {
// // //     console.error("Error processing image:", error);
// // //     res.status(500).send("Something went wrong during classification!");
// // //   }
// // // };

// // // const axios = require("axios");
// // // require("dotenv").config();

// // // /**
// // //  * Handles image processing and classification
// // //  * @param {Request} req - Express request object
// // //  * @param {Response} res - Express response object
// // //  */
// // // exports.processImage = async (req, res) => {
// // //   const faceUrl = process.env.MODEL_API_FD; // Unused? Remove if not needed.
// // //   const modelUrl = process.env.MODEL_API_US;
// // //   const imageUrl = req.file ? req.file.path : null;
// // // console.log(imageUrl)
// // //   if (!imageUrl) {
// // //     return res.status(400).send("No image uploaded!");
// // //   }

// // //   console.log("Uploaded Image URL:", imageUrl);

// // //   try {
// // //     // Connect to your Hugging Face Space via Gradio Client

// // //     // Call the Flask API for classification
// // //     const flaskResponse = await axios.post("https://arnavktis-hello-skin1.hf.space/gradio_api/call/predict", { img_url: imageUrl });
// // //     console.log(flaskResponse)
// // //     const predictedClass = flaskResponse.data.predicted_class;

// // //     let skinType = "";
// // //     switch (predictedClass) {
// // //       case 0:
// // //         skinType = "Dry";
// // //         break;
// // //       case 1:
// // //         skinType = "Normal";
// // //         break;
// // //       case 2:
// // //         skinType = "Oily";
// // //         break;
// // //       default:
// // //         skinType = "Failed to Determine Skin Type, Try Again";
// // //     }
// // //     console.log("Predicted skin type:", skinType);

// // //     // Return both the Gradio result and the skin type classification
// // //     res.json({
// // //       gradioResult,
// // //       predictedClass,
// // //       skinType,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error processing image:", error);
// // //     res.status(500).send("Something went wrong during classification!");
// // //   }
// // // };
// // const axios = require("axios");
// // require("dotenv").config();

// // /**
// //  * Handles image processing and classification
// //  * @param {Request} req - Express request object
// //  * @param {Response} res - Express response object
// //  */
// // exports.processImage = async (req, res) => {
// //   const modelUrl = process.env.MODEL_API_US;
// //   const imageUrl = req.file ? req.file.path : null;

// //   if (!imageUrl) {
// //     return res.status(400).send("No image uploaded!");
// //   }

// //   console.log("Uploaded Image URL:", imageUrl);

// //   try {
// //     // Call Hugging Face Gradio API
// //     // const gradioResponse = await axios.post(
// //     //   "https://arnavktis-hello-skin1.hf.space/gradio_api/call/predict",
// //     //   { data: [imageUrl] }, // Corrected request format
// //     //   { headers: { "Content-Type": "application/json" } }
// //     // );

// //     const { Client } = await import("@gradio/client");
// //     const client = await Client.connect("arnavktis/hello-skin1");
// //     const result = await client.predict("/predict", { 		
// // 		img_url: imageUrl, 
// // });
// //     console.log(result)
    
// //     // // Call Hugging Face Gradio API
// //     // const gradioResponse = await axios.post(
// //     //   "https://arnavktis-hello-skin1.hf.space/gradio_api/call/predict",
// //     //   { data: [imageUrl] }, // Corrected request format
// //     //   { headers: { "Content-Type": "application/json" } }
// //     // );

// //     // console.log("Gradio Response:", gradioResponse.data);


// //     // Extract prediction result
// //     const predictedClass = result.data.predicted_class;
// //     const is_face = result.data.face_detected;
// //     console.log(predictedClass, is_face)
// //     if(!is_face) {
// //         return res.status(422).json({message: "No face detected, Please try again"})
// //     }
// //     if (predictedClass === 0) skinType = "Dry";
// //     else if (predictedClass === 1) skinType = "Normal";
// //     else if (predictedClass === 2) skinType = "Oily";

// //     console.log("Predicted skin type:", skinType);

// //     // Return classification result
// //     res.json({
// //       predictedClass,
// //       skinType,
// //     });
// //   } catch (error) {
// //     console.error("Error processing image:", error.response?.data || error.message);
// //     res.status(500).send("Something went wrong during classification!");
// //   }
// // };

// // const axios = require("axios");
// // require("dotenv").config();

// // /**
// //  * Handles image processing and classification
// //  * @param {Request} req - Express request object
// //  * @param {Response} res - Express response object
// //  */
// // exports.processImage = async (req, res) => {
// //   const modelUrl = process.env.MODEL_API_US;
// //   const imageUrl = req.file ? req.file.path : null;

// //   if (!imageUrl) {
// //     return res.status(400).send("No image uploaded!");
// //   }

// //   console.log("Uploaded Image URL:", imageUrl);

// //   try {
// //     // Import Gradio Client dynamically
// //     const { Client } = await import("@gradio/client");
// //     const client = await Client.connect("arnavktis/hello-skin1");

// //     // Call model
// //     const result = await client.predict("/predict", { img_url: imageUrl });

// //     console.log("Gradio Result:", result);

// //     // Extract prediction result properly
// //     const responseData = result.data?.[0]; // Extract first object from array

// //     if (!responseData) {
// //       return res.status(500).json({ message: "Invalid response from model" });
// //     }

// //     const predictedClass = responseData.predicted_class;
// //     const is_face = responseData.face_detected;

// //     console.log("Predicted Class:", predictedClass, "Face Detected:", is_face);

// //     if (!is_face) {
// //       return res.status(422).json({ message: "No face detected, Please try again" });
// //     }

// //     let skinType = "Failed to Determine Skin Type, Try Again";
// //     if (predictedClass === 0) skinType = "Dry";
// //     else if (predictedClass === 1) skinType = "Normal";
// //     else if (predictedClass === 2) skinType = "Oily";

// //     console.log("Predicted skin type:", skinType);

// //     // Return classification result
// //     res.json({
// //       skinType,
// //     });
// //   } catch (error) {
// //     console.error("Error processing image:", error.response?.data || error.message);
// //     res.status(500).send("Something went wrong during classification!");
// //   }
// // };


// const axios = require("axios");
// require("dotenv").config();

// /**
//  * Handles image processing and classification
//  * @param {Request} req - Express request object
//  * @param {Response} res - Express response object
//  */
// exports.processImage = async (req, res) => {
//   const modelUrl = process.env.MODEL_API_US;
//   const imageUrl = req.file ? req.file.path : null;

//   if (!imageUrl) {
//     return res.status(400).send("No image uploaded!");
//   }

//   console.log("Uploaded Image URL:", imageUrl);

//   try {
//     // Import Gradio Client dynamically
//     const { Client } = await import("@gradio/client");
//     const client = await Client.connect("arnavktis/hello-skin1");

//     // Call model
//     const result = await client.predict("/predict", { img_url: imageUrl });

//     console.log("Gradio Result:", result);

//     // Extract prediction result properly
//     const responseData = result.data?.[0]; // Extract first object from array

//     if (!responseData) {
//       return res.status(500).json({ message: "Invalid response from model" });
//     }

//     const predictedClass = responseData.predicted_class;
//     const is_face = responseData.face_detected;
//     const dryPercentage = responseData.dry;
//     const normalPercentage = responseData.normal ;
//     const oilyPercentage = responseData.oily;

//     console.log("Predicted Class:", predictedClass, "Face Detected:", is_face);
//     console.log("Confidence Scores - Dry:", dryPercentage, "Normal:", normalPercentage, "Oily:", oilyPercentage);

//     if (!is_face) {
//       return res.status(422).json({ message: "No face detected, Please try again" });
//     }

//     let skinType = "Failed to Determine Skin Type, Try Again";
//     if (predictedClass === 0) skinType = "Dry";
//     else if (predictedClass === 1) skinType = "Normal";
//     else if (predictedClass === 2) skinType = "Oily";

//     console.log("Percentages: " ,dryPercentage, normalPercentage, oilyPercentage) 
//     console.log("Predicted skin type:", skinType);

//     // Return classification result with confidence scores
//     res.json({
//       skinType,
//       confidenceScores: {
//         dry: dryPercentage?.toFixed(2) || "N/A",
//         normal: normalPercentage?.toFixed(2) || "N/A",
//         oily: oilyPercentage?.toFixed(2) || "N/A"
//       },
//       primaryConfidence: getPrimaryConfidence(predictedClass, dryPercentage, normalPercentage, oilyPercentage)
//     });
//   } catch (error) {
//     console.error("Error processing image:", error.response?.data || error.message);
//     res.status(500).send("Something went wrong during classification!");
//   }
// };

// /**
//  * Get the confidence percentage for the primary prediction
//  * @param {number} predictedClass - The predicted class (0, 1, or 2)
//  * @param {number} dryPercentage - Confidence score for dry skin
//  * @param {number} normalPercentage - Confidence score for normal skin
//  * @param {number} oilyPercentage - Confidence score for oily skin
//  * @returns {string} Formatted confidence percentage
//  */
// function getPrimaryConfidence(predictedClass, dryPercentage, normalPercentage, oilyPercentage) {
//   let primaryScore;
  
//   if (predictedClass === 0) {
//     primaryScore = dryPercentage;
//   } else if (predictedClass === 1) {
//     primaryScore = normalPercentage;
//   } else if (predictedClass === 2) {
//     primaryScore = oilyPercentage;
//   }
  
//   return primaryScore ? `${primaryScore.toFixed(2)}%` : "N/A";
// }

const axios = require("axios");
require("dotenv").config();
const { connectToDatabase } = require('./db');
/**
 * Handles image processing and classification for a single image
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
exports.processImage = async (req, res) => {

  const modelUrl = process.env.MODEL_API_US;
  const imageUrl = req.file ? req.file.path : null;

  if (!imageUrl) {
    return res.status(400).send("No image uploaded!");
  }

  console.log("Uploaded Image URL:", imageUrl);

  try {
    // Import Gradio Client dynamically
    const { Client } = await import("@gradio/client");
    const client = await Client.connect("arnavktis/hello-skin1");

    // Call model
    const result = await client.predict("/predict", { img_url: imageUrl });

    console.log("Gradio Result:", result);

    // Extract prediction result properly
    const responseData = result.data?.[0]; // Extract first object from array

    if (!responseData) {
      return res.status(500).json({ message: "Invalid response from model" });
    }

    const predictedClass = responseData.predicted_class;
    const is_face = responseData.face_detected;
    const dryPercentage = responseData.dry;
    const normalPercentage = responseData.normal;
    const oilyPercentage = responseData.oily;

    console.log("Predicted Class:", predictedClass, "Face Detected:", is_face);
    console.log("Confidence Scores - Dry:", dryPercentage, "Normal:", normalPercentage, "Oily:", oilyPercentage);

    if (!is_face) {
      return res.status(422).json({ message: "No face detected, Please try again" });
    }

    let skinType = "Failed to Determine Skin Type, Try Again";
    if (predictedClass === 0) skinType = "Dry";
    else if (predictedClass === 1) skinType = "Normal";
    else if (predictedClass === 2) skinType = "Oily";

    console.log("Percentages: ", dryPercentage, normalPercentage, oilyPercentage);
    console.log("Predicted skin type:", skinType);

    // Return classification result with confidence scores
    res.json({
      skinType,
      confidenceScores: {
        dry: dryPercentage?.toFixed(2) || "N/A",
        normal: normalPercentage?.toFixed(2) || "N/A",
        oily: oilyPercentage?.toFixed(2) || "N/A"
      },
      primaryConfidence: getPrimaryConfidence(predictedClass, dryPercentage, normalPercentage, oilyPercentage)
    });
  } catch (error) {
    console.error("Error processing image:", error.response?.data || error.message);
    res.status(500).send("Something went wrong during classification!");
  }
};

/**
 * Handles processing and classification of multiple face images (front, left, right)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
exports.processMultipleImages = async (req, res) => {

  const userId = req.user.id;
  // Check if files were uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No images uploaded!" });
  }

  const frontImageUrl = req.files.image_front?.[0]?.path;
  const leftImageUrl = req.files.image_left?.[0]?.path;
  const rightImageUrl = req.files.image_right?.[0]?.path;

  // Ensure all required images are present
  if (!frontImageUrl || !leftImageUrl || !rightImageUrl) {
    return res.status(400).json({ message: "Missing one or more required images (front, left, right)" });
  }

  console.log("Uploaded Image URLs - Front:", frontImageUrl, "Left:", leftImageUrl, "Right:", rightImageUrl);

  try {
    // Import Gradio Client dynamically
    const { Client } = await import("@gradio/client");
    const client = await Client.connect("arnavktis/hello-skin1");

    // Process all three images with the model
    const [frontResult] = await Promise.all([
      client.predict("/predict", { img_url: frontImageUrl }),
    ]);

    // Extract prediction results
    const frontData = frontResult.data?.[0];
    console.log("Front Data: ", frontData)
  

    // Check if all responses are valid
    if (!frontData ) {
      return res.status(500).json({ message: "Invalid response from model for one or more images" });
    }

    // Check if faces were detected in all images
    if (!frontData.face_detected) {
      return res.status(422).json({ message: "Face not detected in one or more images. Please try again." });
    }
    const db = await connectToDatabase();
    const collection = db.collection("skin-track");
  

    // Calculate average scores across all three images
    const avgDry = frontData.dry ;
    const avgNormal = frontData.normal ;
    const avgOily = frontData.oily;

    // Determine the overall skin type based on average scores
    let predictedClass, skinType;
    
    if (avgDry > avgNormal && avgDry > avgOily) {
      predictedClass = 0;
      skinType = "Dry";
    } else if (avgNormal > avgDry && avgNormal > avgOily) {
      predictedClass = 1;
      skinType = "Normal";
    } else {
      predictedClass = 2;
      skinType = "Oily";
    }

    console.log("Average Scores - Dry:", avgDry, "Normal:", avgNormal, "Oily:", avgOily);
    console.log("Overall predicted skin type:", skinType);

    // Provide detailed analysis for each face region
    const detailedAnalysis = {
      front: {
        skinType: getSkinTypeFromClass(frontData.predicted_class),
        confidenceScores: {
          dry: frontData.dry?.toFixed(2) || "N/A",
          normal: frontData.normal?.toFixed(2) || "N/A",
          oily: frontData.oily?.toFixed(2) || "N/A"
        }
      },
      
    };

    // const db_res = await collection.insertOne({
    //   userId :  userId,
    //   frontImage: frontImageUrl,
    //   leftImage: leftImageUrl,
    //   rightImage: rightImageUrl,
    //   dry: frontData.dry,
    //   normal: frontData.normal,
    //   oily: frontData.oily,
    //   skinType : skinType,
    //   detailedAnalysis,
    // })
    // console.log(db_res)


    const db_res = await collection.updateOne(
      { userId: userId }, // Find the user by userId
      {
        $push: {
          records: {
            frontImage: frontImageUrl,
            leftImage: leftImageUrl,
            rightImage: rightImageUrl,
            dry: frontData.dry,
            normal: frontData.normal,
            oily: frontData.oily,
            skinType: skinType,
            detailedAnalysis: detailedAnalysis,
            timestamp: new Date(),
          }
        }
      },
      { upsert: true } // Create a new document if userId doesn't exist
    );
    
    console.log(db_res);
    
    // Return final results
    res.json({
      skinType,
      confidenceScores: {
        dry: avgDry.toFixed(2) || "N/A",
        normal: avgNormal.toFixed(2) || "N/A",
        oily: avgOily.toFixed(2) || "N/A"
      },
      primaryConfidence: getPrimaryConfidence(predictedClass, avgDry, avgNormal, avgOily),
      detailedAnalysis
    });
  } catch (error) {
    console.error("Error processing images:", error.response?.data || error.message);
    res.status(500).send("Something went wrong during classification!");
  }
};

/**
 * Get skin type string from class number
 * @param {number} classNumber - The predicted class (0, 1, or 2)
 * @returns {string} Skin type description
 */
function getSkinTypeFromClass(classNumber) {
  if (classNumber === 0) return "Dry";
  if (classNumber === 1) return "Normal";
  if (classNumber === 2) return "Oily";
  return "Unknown";
}

/**
 * Get the confidence percentage for the primary prediction
 * @param {number} predictedClass - The predicted class (0, 1, or 2)
 * @param {number} dryPercentage - Confidence score for dry skin
 * @param {number} normalPercentage - Confidence score for normal skin
 * @param {number} oilyPercentage - Confidence score for oily skin
 * @returns {string} Formatted confidence percentage
 */
function getPrimaryConfidence(predictedClass, dryPercentage, normalPercentage, oilyPercentage) {
  let primaryScore;
  
  if (predictedClass === 0) {
    primaryScore = dryPercentage;
  } else if (predictedClass === 1) {
    primaryScore = normalPercentage;
  } else if (predictedClass === 2) {
    primaryScore = oilyPercentage;
  }
  
  return primaryScore ? `${primaryScore.toFixed(2)}%` : "N/A";
}

exports.getUserSkin = async(req, res) => {
  const userId = req.user.id
  console.log(userId)
  const db = await connectToDatabase();
  const collection = db.collection("skin-track");

  try{
    const user = await collection.findOne({ userId : userId });
    console.log(user)
    if (!user || !user.records) {
      return res.status(404).json({ message: "No records found for this user." });
    }
    const records = user.records.map(record => ({
      skinType: record.skinType,
      dryScore: record.dry,
      normalScore: record.normal,
      oilyScore: record.oily,
      frontImage: record.frontImage,
      leftImage: record.leftImage,
      rightImage: record.rightImage,
      timestamp: record.timestamp
    }));

    res.status(200).json(records);

  }catch(e){
    console.error("Error fetching data:", e.message);
    res.status(500).send("Something went wrong in fetching data!");
  }
}

module.exports.exports; 