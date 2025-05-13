

// const axios = require("axios");
// require("dotenv").config();
// const { connectToDatabase } = require('./db');
// /**
//  * Handles image processing and classification for a single image
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
//     const normalPercentage = responseData.normal;
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

//     console.log("Percentages: ", dryPercentage, normalPercentage, oilyPercentage);
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


// exports.processMultipleImages = async (req, res) => {

//   const userId = req.user.id;
//   // Check if files were uploaded
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).json({ message: "No images uploaded!" });
//   }

//   const frontImageUrl = req.files.image_front?.[0]?.path;
//   const leftImageUrl = req.files.image_left?.[0]?.path;
//   const rightImageUrl = req.files.image_right?.[0]?.path;

//   // Ensure all required images are present
//   if (!frontImageUrl || !leftImageUrl || !rightImageUrl) {
//     return res.status(400).json({ message: "Missing one or more required images (front, left, right)" });
//   }

//   console.log("Uploaded Image URLs - Front:", frontImageUrl, "Left:", leftImageUrl, "Right:", rightImageUrl);

//   try {
//     // Import Gradio Client dynamically
//     const { Client } = await import("@gradio/client");
//     const client = await Client.connect("arnavktis/hello-skin1");

//     // Process all three images with the model
//     const [frontResult] = await Promise.all([
//       client.predict("/predict", { img_url: frontImageUrl }),
//     ]);

//     // Extract prediction results
//     const frontData = frontResult.data?.[0];
//     console.log("Front Data: ", frontData)
  

//     // Check if all responses are valid
//     if (!frontData ) {
//       return res.status(500).json({ message: "Invalid response from model for one or more images" });
//     }

//     // Check if faces were detected in all images
//     if (!frontData.face_detected) {
//       return res.status(422).json({ message: "Face not detected in one or more images. Please try again." });
//     }
//     const db = await connectToDatabase();
//     const collection = db.collection("skin-track");
  

//     // Calculate average scores across all three images
//     const avgDry = frontData.dry ;
//     const avgNormal = frontData.normal ;
//     const avgOily = frontData.oily;

//     // Determine the overall skin type based on average scores
//     let predictedClass, skinType;
    
//     if (avgDry > avgNormal && avgDry > avgOily) {
//       predictedClass = 0;
//       skinType = "Dry";
//     } else if (avgNormal > avgDry && avgNormal > avgOily) {
//       predictedClass = 1;
//       skinType = "Normal";
//     } else {
//       predictedClass = 2;
//       skinType = "Oily";
//     }

//     console.log("Average Scores - Dry:", avgDry, "Normal:", avgNormal, "Oily:", avgOily);
//     console.log("Overall predicted skin type:", skinType);

//     // Provide detailed analysis for each face region
//     const detailedAnalysis = {
//       front: {
//         skinType: getSkinTypeFromClass(frontData.predicted_class),
//         confidenceScores: {
//           dry: frontData.dry?.toFixed(2) || "N/A",
//           normal: frontData.normal?.toFixed(2) || "N/A",
//           oily: frontData.oily?.toFixed(2) || "N/A"
//         }
//       },
      
//     };

//     // const db_res = await collection.insertOne({
//     //   userId :  userId,
//     //   frontImage: frontImageUrl,
//     //   leftImage: leftImageUrl,
//     //   rightImage: rightImageUrl,
//     //   dry: frontData.dry,
//     //   normal: frontData.normal,
//     //   oily: frontData.oily,
//     //   skinType : skinType,
//     //   detailedAnalysis,
//     // })
//     // console.log(db_res)


//     const db_res = await collection.updateOne(
//       { userId: userId }, // Find the user by userId
//       {
//         $push: {
//           records: {
//             frontImage: frontImageUrl,
//             leftImage: leftImageUrl,
//             rightImage: rightImageUrl,
//             dry: frontData.dry,
//             normal: frontData.normal,
//             oily: frontData.oily,
//             skinType: skinType,
//             detailedAnalysis: detailedAnalysis,
//             timestamp: new Date(),
//           }
//         }
//       },
//       { upsert: true } // Create a new document if userId doesn't exist
//     );
    
//     console.log(db_res);
    
//     // Return final results
//     res.json({
//       skinType,
//       confidenceScores: {
//         dry: avgDry.toFixed(2) || "N/A",
//         normal: avgNormal.toFixed(2) || "N/A",
//         oily: avgOily.toFixed(2) || "N/A"
//       },
//       primaryConfidence: getPrimaryConfidence(predictedClass, avgDry, avgNormal, avgOily),
//       detailedAnalysis
//     });
//   } catch (error) {
//     console.error("Error processing images:", error.response?.data || error.message);
//     res.status(500).send("Something went wrong during classification!");
//   }
// };

// /**
//  * Get skin type string from class number
//  * @param {number} classNumber - The predicted class (0, 1, or 2)
//  * @returns {string} Skin type description
//  */
// function getSkinTypeFromClass(classNumber) {
//   if (classNumber === 0) return "Dry";
//   if (classNumber === 1) return "Normal";
//   if (classNumber === 2) return "Oily";
//   return "Unknown";
// }

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

// exports.getUserSkin = async(req, res) => {
//   const userId = req.user.id
//   console.log(userId)
//   const db = await connectToDatabase();
//   const collection = db.collection("skin-track");

//   try{
//     const user = await collection.findOne({ userId : userId });
//     console.log(user)
//     if (!user || !user.records) {
//       return res.status(404).json({ message: "No records found for this user." });
//     }
//     const records = user.records.map(record => ({
//       skinType: record.skinType,
//       dryScore: record.dry,
//       normalScore: record.normal,
//       oilyScore: record.oily,
//       frontImage: record.frontImage,
//       leftImage: record.leftImage,
//       rightImage: record.rightImage,
//       timestamp: record.timestamp
//     }));

//     res.status(200).json(records);

//   }catch(e){
//     console.error("Error fetching data:", e.message);
//     res.status(500).send("Something went wrong in fetching data!");
//   }
// }

// module.exports.exports; 
const axios = require("axios");
require("dotenv").config();
const { connectToDatabase } = require('./db');
const Joi = require('joi'); // Import Joi for validation

// JOI SCHEMAS
const singleImageSchema = Joi.object({
  file: Joi.object({
    path: Joi.string().required()
  }).unknown(true)
});

const multipleImagesSchema = Joi.object({
  image_front: Joi.array().items(
    Joi.object({ path: Joi.string().required() }).unknown(true)
  ).required(),

  image_left: Joi.array().items(
    Joi.object({ path: Joi.string().required() }).unknown(true)
  ).required(),

  image_right: Joi.array().items(
    Joi.object({ path: Joi.string().required() }).unknown(true)
  ).required()
});

// Single image processing
exports.processImage = async (req, res) => {
  const validation = singleImageSchema.validate({ file: req.file });
  if (validation.error) {
    return res.status(400).json({ error: validation.error.message });
  }

  const imageUrl = req.file.path;
  console.log("Uploaded Image URL:", imageUrl);

  try {
    const { Client } = await import("@gradio/client");
    const client = await Client.connect("arnavktis/hello-skin1");
    const result = await client.predict("/predict", { img_url: imageUrl });
    const responseData = result.data?.[0];

    if (!responseData || !responseData.face_detected) {
      return res.status(422).json({ message: "No face detected, please try again." });
    }

    const predictedClass = responseData.predicted_class;
    const dry = responseData.dry;
    const normal = responseData.normal;
    const oily = responseData.oily;

    let skinType = getSkinTypeFromClass(predictedClass);
    const primaryConfidence = getPrimaryConfidence(predictedClass, dry, normal, oily);

    res.json({
      skinType,
      confidenceScores: {
        dry: dry?.toFixed(2) || "N/A",
        normal: normal?.toFixed(2) || "N/A",
        oily: oily?.toFixed(2) || "N/A"
      },
      primaryConfidence
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Error during classification");
  }
};

// Multiple image processing
exports.processMultipleImages = async (req, res) => {
  const userId = req.user.id;
  const validation = multipleImagesSchema.validate(req.files);

  if (validation.error) {
    return res.status(400).json({ error: validation.error.message });
  }

  const frontImageUrl = req.files.image_front[0].path;
  const leftImageUrl = req.files.image_left[0].path;
  const rightImageUrl = req.files.image_right[0].path;

  try {
    const { Client } = await import("@gradio/client");
    const client = await Client.connect("arnavktis/hello-skin1");

    const [frontResult] = await Promise.all([
      client.predict("/predict", { img_url: frontImageUrl })
    ]);

    const frontData = frontResult.data?.[0];
    if (!frontData || !frontData.face_detected) {
      return res.status(422).json({ message: "Face not detected in one or more images." });
    }

    const db = await connectToDatabase();
    const collection = db.collection("skin-track");

    const dry = frontData.dry;
    const normal = frontData.normal;
    const oily = frontData.oily;

    const predictedClass = dry > normal && dry > oily ? 0 :
                           normal > dry && normal > oily ? 1 : 2;
    const skinType = getSkinTypeFromClass(predictedClass);

    const detailedAnalysis = {
      front: {
        skinType: getSkinTypeFromClass(frontData.predicted_class),
        confidenceScores: {
          dry: dry?.toFixed(2),
          normal: normal?.toFixed(2),
          oily: oily?.toFixed(2)
        }
      }
    };

    const dbRes = await collection.updateOne(
      { userId },
      {
        $push: {
          records: {
            frontImage: frontImageUrl,
            leftImage: leftImageUrl,
            rightImage: rightImageUrl,
            dry,
            normal,
            oily,
            skinType,
            detailedAnalysis,
            timestamp: new Date(),
          }
        }
      },
      { upsert: true }
    );

    res.json({
      skinType,
      confidenceScores: {
        dry: dry?.toFixed(2),
        normal: normal?.toFixed(2),
        oily: oily?.toFixed(2),
      },
      primaryConfidence: getPrimaryConfidence(predictedClass, dry, normal, oily),
      detailedAnalysis
    });
  } catch (error) {
    console.error("Error processing images:", error.message);
    res.status(500).send("Error during classification");
  }
};

// Get skin records for user
exports.getUserSkin = async (req, res) => {
  const userId = req.user.id;

  try {
    const db = await connectToDatabase();
    const collection = db.collection("skin-track");

    const user = await collection.findOne({ userId });
    if (!user || !user.records) {
      return res.status(404).json({ message: "No records found." });
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
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Error fetching user skin data");
  }
};

// Helper Functions
function getSkinTypeFromClass(classNumber) {
  if (classNumber === 0) return "Dry";
  if (classNumber === 1) return "Normal";
  if (classNumber === 2) return "Oily";
  return "Unknown";
}

function getPrimaryConfidence(predictedClass, dry, normal, oily) {
  const scores = [dry, normal, oily];
  const score = scores[predictedClass];
  return score ? `${score.toFixed(2)}%` : "N/A";
}

module.exports = {
  processImage,
  processMultipleImages,
  getUserSkin
};
