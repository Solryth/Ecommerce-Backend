//[SECTION] Dependencies and Modules
const express = require("express");
const productController = require("../controllers/product.js");
const { verify, verifyAdmin } = require("../auth.js");

//[SECTION] Routing Component
const router = express.Router();

//[SECTION] Route for creating a product
router.post("/", verify, verifyAdmin, productController.addProduct);

//[SECTION] Route for retrieving all courses
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

router.get("/active", productController.getAllActive);

router.get("/:productId", productController.getProduct);

//[SECTION] Route for updating a product (Admin)
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

//[SECTION] Route to archiving a product (Admin)
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

//[SECTION] Route to activating a product (Admin)
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

//[SECTION] 
router.post("/search-by-name", productController.searchByName);

//[SECTION] 
router.post("/search-by-price", productController.searchByPrice);

//[SECTION] Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;