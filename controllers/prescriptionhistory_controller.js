// const { MongoClient, ObjectId } = require('mongodb');
// require('dotenv').config();

// const { connectToDatabase } = require('./db');


// exports.addPrescription = async (req, res) => {
//     const { userId, prescription } = req.body;
//     const doctorId = req.user.id;

//     if (req.role !== 'doctor') {
//         return res.status(403).json({ message: 'Access denied. You are not a doctor.' });
//     }

//     try {
//         const db = await connectToDatabase();

//         const collection = db.collection('prescriptions');

//         const newPrescription = {
//             userId: new ObjectId(`${userId}`),
//             prescription,
//             doctorId: new ObjectId(`${doctorId}`),
//             docName: req.user.name,
//             createdAt: new Date()
//         };

//         const result = await collection.insertOne(newPrescription);
//         res.status(201).json({ message: 'Prescription Added Successfully', result });
//     } catch (e) {
//         console.log(`Error: ${e}`);
//         res.status(400).json({ message: 'Error adding prescription', error: e.message });
//     } 
// };

// exports.getPrescriptions = async (req, res) => {
//     const userId = req.user.id;

//     try {
//         const db = await connectToDatabase();
//         const collection = db.collection('prescriptions');

//         const prescriptions = await collection.find({ userId: userId }).sort({ createdAt: -1 }).toArray();

//         res.status(200).json({ prescriptions });
//     } catch (e) {
//         console.log(`Error: ${e}`);
//         res.status(400).json({ message: 'Error fetching prescriptions', error: e.message });
//     }
// };

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const Joi = require('joi');
const { connectToDatabase } = require('./db');

// Joi Schema for prescription validation
const prescriptionSchema = Joi.object({
    userId: Joi.string().required().messages({
        'string.base': 'User ID must be a string',
        'any.required': 'User ID is required'
    }),
    prescription: Joi.string().min(3).required().messages({
        'string.base': 'Prescription must be a string',
        'string.min': 'Prescription must be at least 3 characters long',
        'any.required': 'Prescription content is required'
    })
});

// POST /addPrescription
exports.addPrescription = async (req, res) => {
    const { userId, prescription } = req.body;
    const doctorId = req.user.id;

    // Check role
    if (req.role !== 'doctor') {
        return res.status(403).json({ message: 'Access denied. You are not a doctor.' });
    }

    // Validate input
    const { error } = prescriptionSchema.validate({ userId, prescription });
    if (error) {
        return res.status(400).json({ message: 'Validation Error', error: error.details[0].message });
    }

    try {
        const db = await connectToDatabase();
        const collection = db.collection('prescriptions');

        const newPrescription = {
            userId: new ObjectId(userId),
            prescription,
            doctorId: new ObjectId(doctorId),
            docName: req.user.name,
            createdAt: new Date()
        };

        const result = await collection.insertOne(newPrescription);
        res.status(201).json({ message: 'Prescription Added Successfully', result });
    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(400).json({ message: 'Error adding prescription', error: e.message });
    }
};

// GET /getPrescriptions
exports.getPrescriptions = async (req, res) => {
    const userId = req.user.id;

    try {
        const db = await connectToDatabase();
        const collection = db.collection('prescriptions');

        const prescriptions = await collection
            .find({ userId: new ObjectId(userId) })
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json({ prescriptions });
    } catch (e) {
        console.log(`Error: ${e}`);
        res.status(400).json({ message: 'Error fetching prescriptions', error: e.message });
    }
};
