const express = require("express");
const orderController = require("../controllers/order.js");
const { verify, verifyAdmin } = require("../auth.js");

//[SECTION] Activity: Routing Component
const router = express.Router();

//[SECTION] 
router.post("/checkout", verify, orderController.createOrder);
router.get("/my-orders", verify, orderController.retrieveOrder);
router.get("/all-orders", verify, verifyAdmin, orderController.retrieveAllOrder);

module.exports = router;