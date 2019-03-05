
const express = require("express");
const http = require("http");
const logger = require("morgan");
const path = require("path");
const mongoose=require('mongoose');
const bodyParser = require("body-parser");

const app = express();
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
var entries = [];
app.locals.entries = entries;
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect('mongodb://abc123:mybis@cluster0-shard-00-00-s8hvh.mongodb.net:27017,cluster0-shard-00-01-s8hvh.mongodb.net:27017,cluster0-shard-00-02-s8hvh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',{ useNewUrlParser: true })
.catch((e) => {
    console.log("catch error: ", e)
})


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
console.log("Mongoose is connected");
})

mongoose.connection.on('disconnected', function () {//disconnected
console.log("Mongoose is disconnected");
process.exit(1);

});

mongoose.connection.on('error', function (err) {//any error
console.log('Mongoose connection error: ', err);
process.exit(1);
})

process.on('SIGINT', function () {/////this function will run jst before app is closing
console.log("app is terminating");
mongoose.connection.close(function () {
    console.log('Mongoose default connection closed');
    process.exit(0);
});
});

var userSchema = new mongoose.Schema({
    "title": String,
    "body": String
    

});
var userModel = mongoose.model("user", userSchema);



//--------- main app
app.get("/", (req, res, next) => {
    res.render("index");
  
});

app.get("/new-entry", (req, res, next) => {
    res.render("new-entry");
});

app.post("/new-entry",(req,res,next)=>{
    if(!req.body.title || !req.body.body)
        {
            res.status(403).send("Entires must have title and body");
            return;
        }
        
        var newUser = {
            title: req.body.title,
            body: req.body.body
        };
        new userModel(newUser)
            .save()
            .then(s => {
                res.send("Details Saved");
                
            })
             
            .catch(err => { console.log(err) });
            entries.push({
                title:req.body.title,
                body:req.body.body,
                published: new Date()
    
            })
        res.redirect("/");
});

app.use((req,res)=>{
    res.status(404).render("404");
});

app.listen(process.env.PORT||3000)