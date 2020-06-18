require("./config/config");

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const path = require("path")

// Access public folder
app.use(express.static(path.resolve(__dirname, "../public")));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Global configutation of routes
app.use(require("./routes/index"));

// Connect database with mongoose
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {

    if (err) console.log(err)

    console.log("Database online")

});

// Port
app.listen(process.env.PORT, () => {
    console.log("Listening from port: ", process.env.PORT);
});