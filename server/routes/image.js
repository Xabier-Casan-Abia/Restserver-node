const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');
const { imgTokenVerification } = require('../middlewares/authentication');


app.get('/image/:type/:img', imgTokenVerification, (req, res) => {

    let type = req.params.type;
    let img = req.params.img;
    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        let noImgPath = path.resolve(__dirname, "../assets/no-image.jpg");
        res.sendFile(noImgPath);
    }

})

module.exports = app;