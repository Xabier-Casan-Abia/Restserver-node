const express = require("express");
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const app = express();

// GET
app.get("/user", function(req, res) {

    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 10;

    User.find({ status: true }, 'name email role')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            User.countDocuments({ status: true }, (err, count) => {

                res.json({
                    ok: true,
                    count,
                    users
                });

            });

        });
});

// POST
app.post("/user", function(req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            user: userDB
        });

    });
});

// PATCH
app.patch("/user/:id", function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            user: userDB
        });

    })
});

// DELETE
app.delete("/user/:id", function(req, res) {

    let id = req.params.id;

    let changeStatus = {
        status: false
    }

    User.findByIdAndUpdate(id, changeStatus, { new: true }, (err, deletedUser) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        };

        res.json({
            ok: true,
            user: deletedUser
        });

    })

});

module.exports = app;