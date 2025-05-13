// const { connectToDatabase } = require('./db');

// // Add product to cart
// const addToCart = async (req, res) => {
//   const { productId, imageURL, price, title, quantity } = req.body;
//   const userId = req.user.id;
//   const qty = quantity ? parseInt(quantity) : 1;

//   try {
//     const db = await connectToDatabase();
//     const cartCollection = db.collection("carts");

//     const cart = await cartCollection.findOne({ userId });

//     if (cart) {
//       const productIndex = cart.products.findIndex(p => p.productId === productId);
//       if (productIndex > -1) {
//         cart.products[productIndex].quantity += qty;
//       } else {
//         cart.products.push({ productId, imageURL, price, title, quantity: qty });
//       }
//       await cartCollection.updateOne({ userId }, { $set: { products: cart.products } });
//     } else {
//       await cartCollection.insertOne({
//         userId,
//         products: [{ productId, imageURL, price, title, quantity: qty }]
//       });
//     }

//     res.status(200).json({ message: "Product added to cart successfully" });
//   } catch (e) {
//     console.error(`Error: ${e}`);
//     res.status(500).json({ message: "Error adding product to cart" });
//   }
// };

// // Get cart items for a user
// const getCart = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const db = await connectToDatabase();
//     const cartCollection = db.collection("carts");

//     const cart = await cartCollection.findOne({ userId });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     res.status(200).json(cart);
//   } catch (e) {
//     console.error(`Error: ${e}`);
//     res.status(500).json({ message: "Error fetching cart" });
//   }
// };

// // Remove a product from the cart
// const removeFromCart = async (req, res) => {
//   const { productId } = req.body;
//   const userId = req.user.id;

//   try {
//     const db = await connectToDatabase();
//     const cartCollection = db.collection("carts");

//     const cart = await cartCollection.findOne({ userId });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     cart.products = cart.products.filter(p => p.productId !== productId);

//     await cartCollection.updateOne({ userId }, { $set: { products: cart.products } });

//     res.status(200).json({ message: "Product removed from cart successfully" });
//   } catch (e) {
//     console.error(`Error: ${e}`);
//     res.status(500).json({ message: "Error removing product from cart" });
//   }
// };

// module.exports = { addToCart, getCart, removeFromCart };

const { connectToDatabase } = require('./db');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

// Joi validation schema
const productSchema = Joi.object({
  productId: Joi.string().length(24).hex().required(),
  imageURL: Joi.string().uri().required(),
  price: Joi.number().positive().required(),
  title: Joi.string().min(1).max(100).required(),
  quantity: Joi.number().integer().min(1).default(1)
});

// Add product to cart
const addToCart = async (req, res) => {
  const userId = req.user?.id;

  // Validate input
  const { error, value } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Invalid product data', error: error.details[0].message });
  }

  const { productId, imageURL, price, title, quantity } = value;

  try {
    const db = await connectToDatabase();
    const cartCollection = db.collection("carts");

    const cart = await cartCollection.findOne({ userId });

    if (cart) {
      const productIndex = cart.products.findIndex(p => p.productId === productId);
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, imageURL, price, title, quantity });
      }
      await cartCollection.updateOne({ userId }, { $set: { products: cart.products } });
    } else {
      await cartCollection.insertOne({
        userId,
        products: [{ productId, imageURL, price, title, quantity }]
      });
    }

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (e) {
    console.error(`Error: ${e}`);
    res.status(500).json({ message: "Error adding product to cart" });
  }
};

// Get cart items for a user
const getCart = async (req, res) => {
  const userId = req.user?.id;

  try {
    const db = await connectToDatabase();
    const cartCollection = db.collection("carts");

    const cart = await cartCollection.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (e) {
    console.error(`Error: ${e}`);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

// Remove a product from the cart
const removeFromCart = async (req, res) => {
  const userId = req.user?.id;

  const removeSchema = Joi.object({
    productId: Joi.string().length(24).hex().required()
  });

  const { error, value } = removeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Invalid product ID', error: error.details[0].message });
  }

  const { productId } = value;

  try {
    const db = await connectToDatabase();
    const cartCollection = db.collection("carts");

    const cart = await cartCollection.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const updatedProducts = cart.products.filter(p => p.productId !== productId);

    await cartCollection.updateOne({ userId }, { $set: { products: updatedProducts } });

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (e) {
    console.error(`Error: ${e}`);
    res.status(500).json({ message: "Error removing product from cart" });
  }
};

module.exports = { addToCart, getCart, removeFromCart };
