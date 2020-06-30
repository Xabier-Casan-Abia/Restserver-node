const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

// Default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;


    if (!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({
            ok: false,
            message: "No files were uploaded."
        });

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.file;
    let fileNameSplit = file.name.split(".");
    let extension = fileNameSplit[fileNameSplit.length - 1];

    // Valid types
    let validTypes = ['products', 'users'];

    if (validTypes.indexOf(type) < 0)
        return res.status(400).json({
            ok: false,
            err: {
                message: "Valid types: " + validTypes.join(", "),
                type
            }
        });

    // Valid extensions
    let validExtensions = ["png", "jpg", "jpeg", "gif"];

    if (validExtensions.indexOf(extension) < 0)
        return res.status(400).json({
            ok: false,
            err: {
                message: "File extensions permited: " + validExtensions.join(", "),
                extension
            }
        });

    let fileName = `${id}-${new Date().getMilliseconds() }.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(`uploads/${type}/${fileName}`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (type === "users") return userImage(id, res, fileName, type);

        if (type === "products") return productImage(id, res, fileName, type);

    });
});

const userImage = (id, res, fileName, type) => {

    User.findById(id, (err, userDB) => {

        if (err) {
            deleteImg(fileName, type);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            deleteImg(fileName, type);
            return res.status(400).json({
                ok: false,
                message: "User not found!"
            });
        }

        deleteImg(userDB.img, type);

        // Save new user image

        userDB.img = fileName;
        userDB.save((err, savedUser) => {

            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                });

            res.json({
                ok: true,
                user: savedUser,
                img: fileName
            })

        });
    })
}

const productImage = (id, res, fileName, type) => {

    Product.findById(id, (err, productDB) => {

        if (err) {
            deleteImg(fileName, type);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            deleteImg(fileName, type);
            return res.status(400).json({
                ok: false,
                message: "Product not found!"
            });
        }

        deleteImg(productDB.img, type);

        // Save new product img

        productDB.img = fileName;
        productDB.save((err, savedProduct) => {

            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                });

            res.json({
                ok: true,
                product: savedProduct,
                img: fileName
            })

        });
    })

}

const deleteImg = (fileName, type) => {

    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);

    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}

module.exports = app;