//[SECTION] Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cart.js");
const { verify, verifyAdmin } = require("../auth.js");

//[SECTION] Routing Component
const router = express.Router();

router.get("/get-cart", verify, cartController.getCart);

router.post("/add-to-cart", verify, cartController.addToCart);

router.patch("/update-cart-quantity", verify, cartController.updateCartQty);

router.patch("/:productId/remove-from-cart", verify, cartController.removeFromCart);

router.put("/clear-cart", verify, cartController.clearCart);


//[SECTION] Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;