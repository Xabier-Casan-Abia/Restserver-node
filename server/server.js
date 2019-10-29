require("./config/config");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/user", function(req, res) {
  res.json("GET User");
});

app.listen(process.env.PORT, () => {
  console.log("Listening from port: ", process.env.PORT);
});
