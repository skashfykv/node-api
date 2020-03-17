const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/ProductsController');

// Multer is image upload handler
const multer = require('multer');

// Define image upload directory & uploaded filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        // .replace(/:/g, '-') is a fix for Windows directory
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

// Prevent upload of unknown file format
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG and PNG file formats are allowed'), false);
    }
};

// Will use this as a middleware in routes
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require("../models/product");
router.get("/", ProductController.index);
router.post("/", checkAuth, upload.single('productImage'), ProductController.create);
router.get("/:productId", ProductController.show);
router.patch("/:productId", checkAuth, ProductController.update);
router.delete("/:productId", checkAuth, ProductController.destroy);

module.exports = router;