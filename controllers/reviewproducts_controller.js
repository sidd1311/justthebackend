

// // reviews.js
// const { ObjectId } = require('mongodb');
// const { connectToDatabase } = require('./db');

// // Add a new review for a product
// const addReview = async (req, res) => {
//     const { productId, comment, rating } = req.body;

//     try {
//         const user = req.user;
//         if (!user) {
//             return res.status(401).json({ message: 'User is not authenticated' });
//         }

//         const db = await connectToDatabase();
//         const reviewsCollection = db.collection('reviews');

//         const newReview = {
//             productId: new ObjectId(`${productId}`),
//             userId: new ObjectId(`${user.id}`),
//             comment,
//             rating: parseFloat(rating),
//             createdAt: new Date(),
//         };

//         const result = await reviewsCollection.insertOne(newReview);
//         res.status(201).json({ message: 'Review added successfully', result });
//     } catch (e) {
//         console.error(`Error: ${e}`);
//         res.status(500).json({ message: 'Error adding review', error: e.message });
//     }
// };

// // Fetch all reviews for a product
// const getReviews = async (req, res) => {
//     const { productId } = req.params;

//     try {
//         const db = await connectDB();
//         const reviewsCollection = db.collection('reviews');

//         const reviews = await reviewsCollection
//             .find({ productId: new ObjectId(`${productId}`) })
//             .toArray();

//         res.status(200).json({ reviews });
//     } catch (e) {
//         console.error(`Error: ${e}`);
//         res.status(500).json({ message: 'Error fetching reviews', error: e.message });
//     }
// };

// // Fetch average rating for a product
// const getAverageRating = async (req, res) => {
//     const { productId } = req.params;

//     try {
//         const db = await connectDB();
//         const reviewsCollection = db.collection('reviews');

//         const result = await reviewsCollection.aggregate([
//             { $match: { productId: new ObjectId(`${productId}`) } },
//             { $group: { _id: "$productId", averageRating: { $avg: "$rating" } } }
//         ]).toArray();

//         const averageRating = result.length ? result[0].averageRating : 0;

//         res.status(200).json({ averageRating });
//     } catch (e) {
//         console.error(`Error: ${e}`);
//         res.status(500).json({ message: 'Error calculating average rating', error: e.message });
//     }
// };

// module.exports = {
//     addReview,
//     getReviews,
//     getAverageRating,
// };

const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./db');

// Joi schema for review validation
const reviewSchema = Joi.object({
    productId: Joi.string().hex().length(24).required(),
    comment: Joi.string().max(500).required(),
    rating: Joi.number().min(1).max(5).required()
});

// Add a new review for a product
const addReview = async (req, res) => {
    const { productId, comment, rating } = req.body;

    // Validate input
    const { error } = reviewSchema.validate({ productId, comment, rating });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }

        const db = await connectToDatabase();
        const reviewsCollection = db.collection('reviews');

        const newReview = {
            productId: new ObjectId(productId),
            userId: new ObjectId(user.id),
            comment,
            rating: parseFloat(rating),
            createdAt: new Date(),
        };

        const result = await reviewsCollection.insertOne(newReview);
        res.status(201).json({ message: 'Review added successfully', result });
    } catch (e) {
        console.error(`Error: ${e}`);
        res.status(500).json({ message: 'Error adding review', error: e.message });
    }
};

// Fetch all reviews for a product
const getReviews = async (req, res) => {
    const { productId } = req.params;

    if (!ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const db = await connectToDatabase();
        const reviewsCollection = db.collection('reviews');

        const reviews = await reviewsCollection
            .find({ productId: new ObjectId(productId) })
            .toArray();

        res.status(200).json({ reviews });
    } catch (e) {
        console.error(`Error: ${e}`);
        res.status(500).json({ message: 'Error fetching reviews', error: e.message });
    }
};

// Fetch average rating for a product
const getAverageRating = async (req, res) => {
    const { productId } = req.params;

    if (!ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const db = await connectToDatabase();
        const reviewsCollection = db.collection('reviews');

        const result = await reviewsCollection.aggregate([
            { $match: { productId: new ObjectId(productId) } },
            { $group: { _id: "$productId", averageRating: { $avg: "$rating" } } }
        ]).toArray();

        const averageRating = result.length ? result[0].averageRating : 0;

        res.status(200).json({ averageRating });
    } catch (e) {
        console.error(`Error: ${e}`);
        res.status(500).json({ message: 'Error calculating average rating', error: e.message });
    }
};

module.exports = {
    addReview,
    getReviews,
    getAverageRating,
};
