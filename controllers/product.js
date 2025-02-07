//[SECTION] Dependencies and Modules
const Product = require("../models/Product.js");

const { errorHandler } = require('../auth.js');


//[SECTION] Create a product
module.exports.addProduct = (req, res) => {
    let newProduct = new Product({
            name : req.body.name,
            description : req.body.description,
            price : req.body.price
        });

    Product.findOne({name: req.body.name})
    .then(existingProduct => {
        if (existingProduct) {
             // Notice that we didn't response directly in string, instead we added an object with a value of a string. This is a proper response from API to Client. Direct string will only cause an error when connecting it to your frontend.
            return res.status(409).send({message: 'Product already exists'});

        }else {
            // Saves the created object to our database
            return newProduct.save()
            //add status 201
            .then(result => res.status(201).send({
                success: true,
                message: 'Product added successfully',
                result: result
            }))
            // Error handling is done using .catch() to capture any errors that occur during the course save operation.

            // .catch(err => err) captures the error but does not take any action, it's only capturing the error to pass it on to the next .then() or .catch() method in the chain. Postman is waiting for a response to be sent back to it but is not receiving anything.
            // .catch.catch(err => res.send(err)) captures the error and takes action by sending it back to the client/Postman with the use of "res.send"
        }
    }).catch(err => errorHandler(err, req, res))
}; 


//[SECTION] getAllProducts
module.exports.getAllProducts = (req, res) => {

    return Product.find({})
    .then(result => {
        // if the result is not null send status 200 and its result
        if(result.length > 0){
            return res.status(200).send(result);
        }
        else{
            // 404 for not found courses
            return res.status(404).send({message: 'No Products'});
        }
    })
    .catch(error => errorHandler(error, req, res));

};


//[SECTION] getAllActive
module.exports.getAllActive = (req, res) => {

    Product.find({ isActive : true }).then(result => {
        if (result.length > 0){
            //if the product is active, return the course.
            return res.status(200).send(result);
        }
        else {
            //if there is no active courses, return 'No active courses found'.
            return res.status(200).send({ message: 'No active product found' });
        }
    }).catch(err => res.status(500).send(err));

};


//[SECTION] getProduct
module.exports.getProduct = (req, res) => {

    Product.findById(req.params.productId)
    .then(product => {
        if (product) {
            //if the product is found, return the product.
            return res.status(200).send(product);
        } else {
            //if the product is not found, return 'Product not found'.
            return res.status(404).send({ message: 'Product not found' });
        }
    })
    .catch(error => errorHandler(error, req, res)); 
    
};


//[SECTION] updateProduct
module.exports.updateProduct = (req, res)=>{

    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    // findByIdandUpdate() finds the the document in the db and updates it automatically
    // req.body is used to retrieve data from the request body, commonly through form submission
    // req.params is used to retrieve data from the request parameters or the url
    // req.params.productId - the id used as the reference to find the document in the db retrieved from the url
    // updatedProduct - the updates to be made in the document
    return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then(product => {
        if (product) {
            //if the product is found, return the course and send a message 'Product updated successfully'.
            res.status(200).send({ success: true, message: 'Product updated successfully' });
        } else {
            //if the product is not found, return 'Product not found'.
            res.status(404).send({ message: 'Product not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};


//[SECTION] archiveProduct
module.exports.archiveProduct = (req, res) => {

    let updateActiveField = {
       isActive: false
   };

   Product.findByIdAndUpdate(req.params.productId, updateActiveField)
       .then(product => {
           if (product) {
               if (!product.isActive) {
                   //if the Product isActive is already false, send a message 'Product already archived' and return the Product.
                   return res.status(200).send({ 
                       message: 'Product already archived',
                       product: product
                       });
               }
               //if the Product is successfully archived, return true and send a message 'Product archived successfully'.
               return res.status(200).send({ 
                           success: true, 
                           message: 'Product archived successfully'
                       });
           } else {
               //if the Product is not found, return 'Product not found'
               return res.status(404).send({ message: 'Product not found' });
           }
       })
       .catch(error => errorHandler(error, req, res));
};


//[SECTION] activateProduct
module.exports.activateProduct = (req, res) => {

    let updateActiveField = {
        isActive: true
    }

    Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(product => {
            if (product) {
                if (product.isActive) {
                    // if the Product isActive is already true, send a message 'Product already activated', and return the Product.
                    return res.status(200).send({ 
                        message: 'Product already activated', 
                        product: product
                    });
                }
                //if the Product is successfully activated, return true and send a message 'Product activated successfully'.
                return res.status(200).send({
                    success: true,
                    message: 'Product activated successfully'
                });
            } else {
                // if the Product is not found, return 'Product not found'
                return res.status(404).send({ message: 'Product not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};


//[SECTION] searchByName
module.exports.searchByName = async (req, res) => {
    try {
        const { name } = req.body;
    
        // Use a regular expression to perform a case-insensitive search
        const product = await Product.find({
            name: { $regex: name, $options: 'i' }
        });
    
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//[SECTION] searchByPrice
module.exports.searchByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body;

        if (minPrice === undefined || maxPrice === undefined) {
            return res.status(400).json({ error: 'minPrice and maxPrice are required' });
        }

        // Use a regular expression to perform a case-insensitive search
        const product = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        if(product.length > 0){
            res.json(product);
        }else{
            return res.status(404).send({ message: 'No product found' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
    