const Order = require("../models/Order.js");
const Cart = require("../models/Cart.js");


const { errorHandler } = require('../auth.js');
const { createConnection } = require("mongoose");



//[SECTION] createOrder
module.exports.createOrder = (req, res) => {
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) {
                return res.status(500).send({
                    message: 'No items to checkout'
                });
            } else {
                console.log("cart", cart);
                if (cart.cartItems.length > 0) {
                    // Create a new order with only relevant properties
                    const newOrderData = {
                        userId: cart.userId,
                        productsOrdered: cart.cartItems,
                        totalPrice: cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0),
                        orderedOn: new Date()
                    };

                    const newOrder = new Order(newOrderData);

                    return newOrder.save()
                        .then(result => res.status(201).send({
                            success: true,
                            message: 'Ordered successfully',
                            order: result
                        }))
                        .catch(error => res.status(500).send({
                            success: false,
                            message: 'Error saving new order',
                            error: error.message
                        }));
                } else {
                    return res.status(500).send({
                        message: 'No items to checkout'
                    });
                }
            }
        })
        .catch(error => res.status(500).send({
            success: false,
            message: 'Error finding cart',
            error: error.message
        }));
};


//[SECTION] retrieveOrder
module.exports.retrieveOrder = (req, res) => {
    Order.find({userId: req.user.id})
    .then(order => {
        if (order.length > 0) {
            return res.status(200).send(order);
        } else {
            return res.status(404).send({ message: 'No order found' });
        }
    })
    .catch(error => errorHandler(error, req, res)); 

};


//[SECTION] retrieveAllOrder
module.exports.retrieveAllOrder = (req, res) => {
    Order.find()
    .then(order => {
        if (order.length > 0) {
            return res.status(200).send(order);
        } else {
            return res.status(404).send({ message: 'No order found' });
        }
    })
    .catch(error => errorHandler(error, req, res)); 

};