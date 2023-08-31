//jshint esversion:6
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

//Database

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ['password']}); 

const User = mongoose.model("User", userSchema);


app.get("/",function(req,res){
    res.render("home");
})

app.get("/login", function(req, res){
    res.render("login");
})

app.get("/register", function(req, res){
    res.render("register");
})

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().catch(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Saved");
        }
    })
})

app.post("/login", function(req,res){
    User.findOne({email: req.body.username}).then(function(user){
        if(user.password === req.body.password){
            res.render("secrets");
        }else{
            console.log("Wrong Password");
        }
    })
})


app.listen(3000);