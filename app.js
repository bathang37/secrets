//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

const dbName = process.env.DB_NAME;

mongoose.connect('mongodb://localhost:27017/'+dbName, {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const secretKey = process.env.SECRET_KEY;
userSchema.plugin(encrypt, { secret: secretKey, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);

//TODO

app.get("/", function (req, res) {
   res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/submit", function (req, res) {
    res.render("submit");
});


app.post("/register", function (req, res) {
   const user = new User({
       username: req.body.username,
       password: req.body.password
   });
   user.save(function (err) {
       if (err) {
           console.log(err);
       } else {
           res.render("secrets");
       }
   })
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}, function (err, foundUser) {
        if (!foundUser) {
            console.log("Username not exist!");
        } else {
            if (foundUser.password == password) {
                res.render("secrets");
            } else {
                console.log("Password not match!");
            }
        }
    })
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
});
