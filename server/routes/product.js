const express = require('express');

const { tokenVerification } = require('../middlewares/authentication');


let app = express();
let Product = require('../models/product');


// GET

// All Products
app.get('/products', tokenVerification, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    Product.find({ disponibility: true })
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products
            });

        })

});

// One category per id
app.get('/products/:id', (req, res) => {

    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, productDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "ID doesn't exist."
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            });

        });

});

// Search by term 
app.get('/products/search/:term', tokenVerification, (req, res) => {

    let term = req.params.term;

    let regex = new RegExp(term, 'i');

    Product.find({ name: regex })
        .populate('category', 'name')
        .exec((err, product) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product
            })

        })


});



// POST|
app.post('/products', tokenVerification, (req, res) => {

    let body = req.body;

    let product = new Product({
        user: req.user._id,
        name: body.name,
        price: body.price,
        description: body.description,
        disponibility: body.disponibility,
        category: body.category
    });

    product.save((err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            product: productDB
        });

    });

});

// PATCH
app.patch('/products/:id', tokenVerification, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "ID doesn't exist."
                }
            });
        }

        productDB.name = body.name;
        productDB.price = body.price;
        productDB.category = body.category;
        productDB.disponibility = body.disponibility;
        productDB.description = body.description;

        productDB.save((err, newProduct) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: newProduct
            });

        });

    });


});

// Delete
app.delete('/products/:id', tokenVerification, (req, res) => {

    let id = req.params.id;

    Product.findById(id, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "ID doesn't exist."
                }
            });
        }

        productDB.disponibility = false;

        productDB.save((err, deletedProduct) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: deletedProduct,
                message: 'Product deleted'
            });

        })

    })

});

module.exports = app;