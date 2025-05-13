// const express = require("express");
// const router = express.Router();
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;
// const authMiddleware = require('../middlewares/authMiddleware');
// const imageController = require('../controllers/face-detection_controller');

// require('dotenv').config();

// // Configure Cloudinary
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Configure Multer to use Cloudinary for storage
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'uploads',
//         allowed_formats: ['jpg', 'jpeg', 'png'],
//     },
// });

// const upload = multer({ storage: storage });

// // Route for image upload and classification
// router.post("/image", authMiddleware, upload.single('image'), imageController.processImage);

// module.exports = router;



    // ROUTER FILE
    const express = require("express");
    const router = express.Router();
    const multer = require('multer');
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('cloudinary').v2;
    const authMiddleware = require('../middlewares/authMiddleware');
    const imageController = require('../controllers/face-detection_controller');
    // const getUserSkin = require('../controllers/face-detection_controller')
    require('dotenv').config();
    
    // Configure Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    // Configure Multer to use Cloudinary for storage
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'uploads',
            allowed_formats: ['jpg', 'jpeg', 'png'],
        },
    });
    
    const upload = multer({ storage: storage });
    
    // Route for single image upload and classification (keep for backward compatibility)
    router.post("/image", authMiddleware, upload.single('image'), imageController.processImage);
    
    // New route for multiple images upload and classification
    router.post("/images", authMiddleware, upload.fields([
        { name: 'image_front', maxCount: 1 },
        { name: 'image_left', maxCount: 1 },
        { name: 'image_right', maxCount: 1 }
    ]), imageController.processMultipleImages);
    
    router.get("/user-track-progress", authMiddleware, imageController.getUserSkin)
    
    module.exports = router;