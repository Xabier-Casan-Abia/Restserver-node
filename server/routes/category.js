const express = require("express");
const Category = require('../models/category');
const { tokenVerification, admin_roleVerification } = require('../middlewares/authentication');
const app = express();

// GET

// All Categories
app.get('/category', tokenVerification, (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categories
            });

        })
});

// One category per id
app.get('/category/:id', tokenVerification, (req, res) => {

    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Invalid id'
                }
            });
        }


        res.json({
            ok: true,
            category: categoryDB
        });

    });


});

// POST
app.post("/category", tokenVerification, (req, res) => {
    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });

    });
});

// PATCH
app.patch("/category/:id", [tokenVerification], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let categoryDescription = {
        description: body.description
    }

    Category.findByIdAndUpdate(id, categoryDescription, { new: true, runValidators: true }, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });

    })
});

// DELETE
app.delete('/category/:id', [tokenVerification, admin_roleVerification], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "The id doesn't exist"
                }
            });
        }

        res.json({
            ok: true,
            message: "Category deleted"
        });

    });
});

module.exports = app;