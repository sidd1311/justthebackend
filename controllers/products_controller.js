// const { MongoClient, ObjectId } = require("mongodb");
// require("dotenv").config();

// const { connectToDatabase } = require('./db');

// exports.getAllProducts = async (req, res) => {
//     try {
//         const db = await connectToDatabase();
//         const collection = db.collection("products");

//         const { skintypefor } = req.query;
//         let filter = {};

//         if (skintypefor) {
//             const skintypeArray = skintypefor.split(",").map(type => type.trim());
//             filter.skintypefor = { $in: skintypeArray };
//         }

//         const products = await collection.find(filter).toArray();
//         res.status(200).json({ products });

//     } catch (e) {
//         console.log(`Error fetching products: ${e}`);
//         res.status(500).json({ message: "Error fetching products", error: e.message });
//     } 
// };

// exports.getProductById = async (req, res) => {
//     try {
//         const db = await connectToDatabase();        
//         const collection = db.collection("products");

//         const { productId } = req.params;
//         const product = await collection.findOne({ _id: new ObjectId(`${productId}`) });

//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         res.status(200).json({ product });

//     } catch (e) {
//         console.log(`Error fetching product: ${e}`);
//         res.status(500).json({ message: "Error fetching product", error: e.message });
//     }
// };

const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const Joi = require("joi");

const { connectToDatabase } = require('./db');

// Joi schema for query validation (getAllProducts)
const querySchema = Joi.object({
    skintypefor: Joi.string()
        .pattern(/^([\w\s]+,?)*$/)
        .optional()
        .messages({
            'string.pattern.base': 'skintypefor should be a comma-separated list of strings'
        })
});

// Joi schema for param validation (getProductById)
const paramSchema = Joi.object({
    productId: Joi.string().length(24).hex().required().messages({
        'string.length': 'Product ID must be 24 characters long',
        'string.hex': 'Product ID must be a valid hex string',
        'any.required': 'Product ID is required'
    })
});

// GET /products?skintypefor=Dry,Oily
exports.getAllProducts = async (req, res) => {
    try {
        const { error } = querySchema.validate(req.query);
        if (error) {
            return res.status(400).json({ message: "Invalid query parameters", error: error.details[0].message });
        }

        const db = await connectToDatabase();
        const collection = db.collection("products");

        const { skintypefor } = req.query;
        let filter = {};

        if (skintypefor) {
            const skintypeArray = skintypefor.split(",").map(type => type.trim());
            filter.skintypefor = { $in: skintypeArray };
        }

        const products = await collection.find(filter).toArray();
        res.status(200).json({ products });

    } catch (e) {
        console.log(`Error fetching products: ${e}`);
        res.status(500).json({ message: "Error fetching products", error: e.message });
    }
};

// GET /products/:productId
exports.getProductById = async (req, res) => {
    try {
        const { error } = paramSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ message: "Invalid product ID", error: error.details[0].message });
        }

        const db = await connectToDatabase();
        const collection = db.collection("products");

        const { productId } = req.params;
        const product = await collection.findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ product });

    } catch (e) {
        console.log(`Error fetching product: ${e}`);
        res.status(500).json({ message: "Error fetching product", error: e.message });
    }
};
