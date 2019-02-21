const express = require("express");
const http = require("http");
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
var port = process.env.PORT||3000;
const app = express();
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
var entries = [];
app.locals.entries = entries;
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

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
        entries.push({
            title:req.body.title,
            content:req.body.body,
            published: new Date()

        });
        res.redirect("/");
});

app.use((req,res)=>{
    res.status(404).render("404");
});

http.createServer(app).listen(port,()=>
{
console.log("App started at port 3000");
});