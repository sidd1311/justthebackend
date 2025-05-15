// const { MongoClient, ObjectId } = require('mongodb');
// const axios = require('axios');
// require('dotenv').config();
// const { connectToDatabase } = require('./db');


// // Health Form Submission Handler
// exports.submitHealthForm = async (req, res) => {
//     const userId = req.user.id;
//     const skinType = req.user.skinType; // Assuming skinType is available in user info
//     const formData = req.body;

//     try {
//         const db = await connectToDatabase();
//         const healthCollection = db.collection('healthData');
//         const prescriptionsCollection = db.collection('prescriptions');
//         const aiAnalysisCollection = db.collection('aihealthanalysis');

//         // Fetch user's prescription history
//         const prescriptions = await prescriptionsCollection.find({ userId: new ObjectId(userId) }).toArray();

//         // Prepare health record
//         const healthRecord = {
//             userId: new ObjectId(userId),
//             skinType,
//             ...formData,
//             createdAt: new Date(),
//         };

//         // Prepare data for AI analysis
//         const message = `Analyze the following user data to provide personalized skin health suggestions:
//         Form Data: ${JSON.stringify(formData)}
//         Skin Type: ${skinType}
//         Prescription History: ${JSON.stringify(prescriptions)}`;

//         const dataForAI = { message };

//         // Send request to AI model
//         const aiResponse = await axios.post(
//             'https://admiring-lamarr-charming.lemme.cloud/api/ed30d674-0ae7-4d5f-ad9c-6ce54bf02b8d',
//             dataForAI,
//             { headers: { 'Content-Type': 'application/json' } }
//         );

//         console.log('AI Response:', aiResponse.data);
//         const aiResult = aiResponse.data;

//         // Save records in the database
//         await healthCollection.insertOne(healthRecord);
//         await aiAnalysisCollection.insertOne({ userId: new ObjectId(userId), date: new Date(), analysis: aiResult });

//         res.status(201).json({ message: 'Success', analysis: aiResult });

//     } catch (e) {
//         console.error(`Error: ${e}`);
//         res.status(400).json({ message: 'Error storing health data', error: e.message });
//     }
// };

// // Fetch AI Depth Analysis Handler
// exports.getDepthAnalysis = async (req, res) => {
//     const userId = req.user.id;

//     try {
//         const db = await connectToDatabase();
//         const aiAnalysisCollection = db.collection('aihealthanalysis');

//         // Fetch AI analysis data for the user
//         const depthAnalysis = await aiAnalysisCollection.find({ userId: new ObjectId(userId) }).toArray();
//         console.log(depthAnalysis);
//         res.status(200).json({ message: 'Success', analysis: depthAnalysis });

//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

const { MongoClient, ObjectId } = require('mongodb');
const axios = require('axios');
const Joi = require('joi');
require('dotenv').config();
const { connectToDatabase } = require('./db');

// Define Joi schema for health form validation
const healthFormSchema = Joi.object({
    age: Joi.number().integer().min(1).max(120).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    symptoms: Joi.array().items(Joi.string()).required(),
    medications: Joi.array().items(Joi.string()).optional(),
    allergies: Joi.array().items(Joi.string()).optional(),
    lifestyle: Joi.string().optional(),
    notes: Joi.string().allow('').optional()
});

// Health Form Submission Handler
exports.submitHealthForm = async (req, res) => {
    const userId = req.user.id;
    const skinType = req.user.skinType;
    const formData = req.body;

    // Validate input
    const { error } = healthFormSchema.validate(formData);
    if (error) {
        return res.status(400).json({ message: 'Validation Error', error: error.details[0].message });
    }

    try {
        const db = await connectToDatabase();
        const healthCollection = db.collection('healthData');
        const prescriptionsCollection = db.collection('prescriptions');
        const aiAnalysisCollection = db.collection('aihealthanalysis');

        // Fetch user's prescription history
        const prescriptions = await prescriptionsCollection.find({ userId: new ObjectId(userId) }).toArray();

        // Prepare health record
        const healthRecord = {
            userId: new ObjectId(userId),
            skinType,
            ...formData,
            createdAt: new Date(),
        };

        // Prepare message for AI
        const message = `Analyze the following user data to provide personalized skin health suggestions:
        Form Data: ${JSON.stringify(formData)}
        Skin Type: ${skinType}
        Prescription History: ${JSON.stringify(prescriptions)}`;

        // Send request to AI model
        const aiResponse = await axios.post(
            'https://admiring-lamarr-charming.lemme.cloud/api/ed30d674-0ae7-4d5f-ad9c-6ce54bf02b8d',
            { message },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const aiResult = aiResponse.data;

        // Store data
        await healthCollection.insertOne(healthRecord);
        await aiAnalysisCollection.insertOne({
            userId: new ObjectId(userId),
            date: new Date(),
            analysis: aiResult
        });

        res.status(201).json({ message: 'Success', analysis: aiResult });

    } catch (e) {
        console.error(`Error: ${e}`);
        res.status(400).json({ message: 'Error storing health data', error: e.message });
    }
};
exports.getDepthAnalysis = async (req, res) => {
    const userId = req.user.id;

    try {
        const db = await connectToDatabase();
        const aiAnalysisCollection = db.collection('aihealthanalysis');

        // Fetch AI analysis data for the user
        const depthAnalysis = await aiAnalysisCollection.find({ userId: new ObjectId(userId) }).toArray();
        console.log(depthAnalysis);
        res.status(200).json({ message: 'Success', analysis: depthAnalysis });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};