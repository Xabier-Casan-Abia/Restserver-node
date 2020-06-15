require("./config/config");

const express = require("express");
const mongoose = require('mongoose');
const app = express();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// global configutation of routes
app.use(require("./routes/index"));

// connect database with mongoose
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {

    if (err) console.log(err)

    console.log("Database online")

});

// PORT
app.listen(process.env.PORT, () => {
    console.log("Listening from port: ", process.env.PORT);
});