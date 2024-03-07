var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var multer = require("multer");
var bcrypt = require("bcrypt");
var session = require("express-session");
var port = process.env.PORT || 3001;
var app = express();
var ejs = require("ejs");

var main_router = require("./routes/main.js");

app.set("views","views")
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended:false}));
app.use(main_router);

app.listen(port,()=>{
  console.log("Weather App Running");
});
