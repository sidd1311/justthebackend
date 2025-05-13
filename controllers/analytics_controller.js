// // const { MongoClient, ObjectId } = require('mongodb');
// // require('dotenv').config();

// // const url = process.env.MONGO_URL;
// // const client = new MongoClient(url);
// // const dbName = 'HTM';

// // // Controller function to fetch historical health data
// // const getHealthHistory = async (req, res) => {
// //     const userId = req.user.id;

// //     try {
// //         await client.connect();
// //         const db = client.db(dbName);
// //         const collection = db.collection('healthData');

// //         const healthData = await collection.find({ userId: new ObjectId(userId) })
// //                                            .sort({ createdAt: 1 }) // Sort by date
// //                                            .toArray();

// //         res.status(200).json(healthData);
// //     } catch (e) {
// //         console.error(`Error: ${e}`);
// //         res.status(400).json({ message: 'Error fetching health data', error: e.message });
// //     } finally {
// //         await client.close();
// //     }
// // };

// // module.exports = { getHealthHistory };

// // getHealthHistory_controller.js
// const { connectToDatabase } = require('./db');
// const { ObjectId } = require('mongodb');

// // Controller function to fetch historical health data
// const getHealthHistory = async (req, res) => {
//     const userId = req.user.id;

//     try {
//         const db = await connectToDatabase();
//         const collection = db.collection('healthData');

//         const healthData = await collection.find({ userId: new ObjectId(userId) })
//                                            .sort({ createdAt: 1 }) // Sort by creation date
//                                            .toArray();

//         res.status(200).json(healthData);
//     } catch (e) {
//         console.error(`Error: ${e}`);
//         res.status(400).json({ message: 'Error fetching health data', error: e.message });
//     }
// };

// module.exports = { getHealthHistory };

const { connectToDatabase } = require('./db');
const { ObjectId } = require('mongodb');
const Joi = require('joi');

// Define validation schema for userId
const userSchema = Joi.object({
    userId: Joi.string().length(24).hex().required() // MongoDB ObjectId must be 24 hex characters
});

const getHealthHistory = async (req, res) => {
    const userId = req.user?.id;

    // Validate userId format
    const { error } = userSchema.validate({ userId });
    if (error) {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }

    try {
        const db = await connectToDatabase();
        const collection = db.collection('healthData');

        const healthData = await collection
            .find({ userId: new ObjectId(`${userId}`) })
            .sort({ createdAt: 1 })
            .toArray();

        res.status(200).json(healthData);
    } catch (e) {
        console.error(`Error: ${e}`);
        res.status(500).json({ message: 'Error fetching health data', error: e.message });
    }
};

module.exports = { getHealthHistory };
