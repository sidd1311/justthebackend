// const { MongoClient, ObjectId } = require('mongodb');
// require('dotenv').config();

// const { connectToDatabase } = require('./db');
 



// // Health Form Submission Handler
// exports.submitHealthForm = async (req, res) => {
//     const userId = req.user.id;
//     const skinType = req.user.skinType; // Assuming skinType is available in user info
//     const formData = req.body;

//     try {
//         const db = await connectToDatabase();
//         const collection = db.collection('healthData');

//         const healthRecord = {
//             userId: new ObjectId(`${userId}`),
//             skinType,
//             ...formData,
//             createdAt: new Date(),
//         };

//         const result = await collection.insertOne(healthRecord);
//         res.status(201).json({ message: 'Health data stored successfully', result });

//     } catch (e) {
//         console.error(`Error: ${e}`);
//         res.status(400).json({ message: 'Error storing health data', error: e.message });
//     }
// };

const { MongoClient, ObjectId } = require('mongodb');
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

    // Validate form data
    const { error } = healthFormSchema.validate(formData);
    if (error) {
        return res.status(400).json({ message: 'Validation Error', error: error.details[0].message });
    }

    try {
        const db = await connectToDatabase();
        const collection = db.collection('healthData');

        const healthRecord = {
            userId: new ObjectId(`${userId}`),
            skinType,
            ...formData,
            createdAt: new Date(),
        };

        const result = await collection.insertOne(healthRecord);
        res.status(201).json({ message: 'Health data stored successfully', result });

    } catch (e) {
        console.error(`Error: ${e}`);
        res.status(400).json({ message: 'Error storing health data', error: e.message });
    }
};
