var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
const mongooseValidationErrorTransform = require('mongoose-validation-error-transform');

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 8080;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));


mongoose.connect("mongodb://localhost/RA", { useNewUrlParser: true });



//routes

//GET route for scraping from resident advisor news column
app.get("/scrape", function(req, res) {
    axios.get("https://www.residentadvisor.net/news").then(function(response) {
        var $ = cheerio.load(response.data);
        console.log("scraping Started")
        $("article").each(function(i, element) {
            var result = {};

            result.title = $(this)
            .find("h1")
            .text();
            result.link = $(this)
            .find("a.title")
            .attr("href");
            result.headline = $(this)
            .find(".pt4 f28")
            .text();
            if (!result.link) {
                result.link = "link not available"
            } 
            // console.log($(this).find("a.title").attr("href"));
            // console.log($(this).find("h1").text());

            // console.log(result.title);
            // console.log(result.link);
           
            console.log(result);
            
            db.News.create(result)
            .then(function(dbNews) {
                console.log(dbNews);
            })
            .catch(function(err) {
                console.log(err);
            });
        });

        res.send("scrape completed");
        console.log("done")
        // console.log(result + "results");
        // console.log(dbNews + "dbNews");
    });
});


//route for grabbing news articles from the db
app.get("/news", function(req, res) {
    db.News.find({})
    .then(function(dbNews) {
        res.json(dbNews);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.post("/news:id", function(req, res) {
    console.log(req.params.id);
});



app.listen(PORT, function() {
    console.log("App listening on port " + PORT);
});

