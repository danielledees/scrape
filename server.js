var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 8080;

var app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapeRA", {useNewUrlParser: true});

//routes

//GET route for scraping from resident advisor news column
app.get("/scrape", function(req, res) {
    axios.get("https://www.residentadvisor.net/news").then(function(response) {
        var $ = cheerio.load(response.data);

        $("title h1").each(function(i, element) {
            var result = {};

            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");

            console.log(result.title);
            console.log(result.link);
            
            db.News.create(result)
            .then(function(dbNews) {
                console.log(dbNews);
            })
            .catch(function(err) {
                console.log(err);
            });
        });

        res.send("scrape completed");
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



app.listen(PORT, function() {
    console.log("App listening on port " + PORT);
});

