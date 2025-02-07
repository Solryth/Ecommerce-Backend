//[SECTION] Dependencies and Modules
const Cart = require("../models/Cart.js");
const { errorHandler } = require('../auth.js');


//[SECTION] getCart
module.exports.getCart = (req, res) => {
    Cart.find({userId: req.user.id})
    .then(cart => {
        if (cart.length > 0) {
            //if the cart is found, return the cart.
            return res.status(200).send(cart);
        } else {
            //if the cart is not found, return 'No cart found'.
            return res.status(404).send({ message: 'No cart found' });
        }
    })
    .catch(error => errorHandler(error, req, res)); 
};


//[SECTION] addToCart
module.exports.addToCart = (req, res) => {
    const { productId, quantity, subtotal } = req.body;
    // Find the user's cart using the user ID from the token (userId: req.user.id)
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) {
                // If no cart found, create a new one
                const newCart = new Cart({
                    userId: req.user.id,
                    cartItems: [{ productId, quantity, subtotal }],
                    totalPrice: subtotal
                });
                return newCart.save()
                    .then(result => res.status(201).send({
                        success: true,
                        message: 'Item added to cart successfully',
                        cart: result
                    }))
                    .catch(error => res.status(500).send({
                        success: false,
                        message: 'Error saving new cart',
                        error: error.message
                    }));
            }
            // Cart exists, check if the product is already in cartItems
            const existingProductIndex = cart.cartItems.findIndex(
                item => item.productId.toString() === productId
            );
            if (existingProductIndex > -1) {
                // Product already in cart: Update quantity and subtotal
                cart.cartItems[existingProductIndex].quantity += quantity;
                cart.cartItems[existingProductIndex].subtotal += subtotal;
            } else {
                // Product not in cart: Add as new item
                cart.cartItems.push({ productId, quantity, subtotal });
            }
            // Recalculate totalPrice
            cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);

            // Save the updated cart
            return cart.save()
                .then(result => res.status(200).send({
                    success: true,
                    message: 'Product added to existing cart',
                    cart: result
                }))
                .catch(error => res.status(500).send({
                    success: false,
                    message: 'Error saving updated cart',
                    error: error.message
                }));
        })
        .catch(error => res.status(500).send({
            success: false,
            message: 'Error finding cart',
            error: error.message
        }));
};


//[SECTION] updateCartQty
module.exports.updateCartQty = (req, res) => {
    const { productId, newQuantity, subtotal } = req.body;
    // Find the user's cart using the user ID from the token ( userId: req.user.id)
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) {
                return res.status(500).send({
                    message: 'Cart not found',
                });
            }
            const existingProductIndex = cart.cartItems.findIndex(
                item => item.productId.toString() === productId
            );
            let message = '';
            if (existingProductIndex > -1) {
                cart.cartItems[existingProductIndex].quantity = newQuantity;
                cart.cartItems[existingProductIndex].subtotal = subtotal;
                message = 'Item updated to existing cart';
            } else {
                quantity = newQuantity;
                cart.cartItems.push({ productId, quantity, subtotal });
                message = 'Item not found in cart'
            }
            // Recalculate totalPrice
            cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
            // Save the updated cart
            return cart.save()
                .then(result => res.status(200).send({
                    success: true,
                    message: message,
                    cart: result
                }))
                .catch(error => res.status(500).send({
                    success: false,
                    message: 'Error saving updated cart',
                    error: error.message
                }));
        })
        .catch(error => res.status(500).send({
            success: false,
            message: 'Error finding cart',
            error: error.message
        }));
};


//[SECTION] removeFromCart
module.exports.removeFromCart = (req, res) => {
    let itemToRemove = req.params.productId;
    // Find the user's cart using the user ID from the token (userId: req.user.id)
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) {
                return res.status(500).send({
                    message: 'Cart not found',
                });
            }
            const existingProductIndex = cart.cartItems.findIndex(
                item => item.productId.toString() === itemToRemove
            );
            let message = '';
            if (existingProductIndex > -1) {
                cart.cartItems.splice(existingProductIndex, 1)
                cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);

                return cart.save()
                .then(result => res.status(200).send({
                    success: true,
                    message: 'Item removed from cart successfully',
                    updatedCart: result
                }))
                .catch(error => res.status(500).send({
                    success: false,
                    message: 'Error saving updated cart',
                    error: error.message
                }));

            } else {
               return res.status(500).send({
                message : 'Item not found in cart'
               }) 
            }

        })
        .catch(error => res.status(500).send({
            success: false,
            message: 'Error finding cart',
            error: error.message
        }));
};

//[SECTION] clearCart
module.exports.clearCart = (req, res) => {
    // Find the user's cart using the user ID from the token (userId: req.user.id)
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) {
                return res.status(500).send({
                    message: 'Cart not found',
                });
            }
            if (cart.cartItems.length > 0) {
                cart.cartItems.length = 0;
                cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
                return cart.save()
                .then(result => res.status(200).send({
                    success: true,
                    message: 'Cart cleared successfully',
                    updatedCart: result
                }))
                .catch(error => res.status(500).send({
                    success: false,
                    message: 'Error saving updated cart',
                    error: error.message
                }));
            }else{
                return res.status(500).send({
                    message : 'Item not found in cart'
                   });
            }})
        .catch(error => res.status(500).send({
            success: false,
            message: 'Error finding cart',
            error: error.message
        }));
};


