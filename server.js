var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");

var db = require("./models");


var PORT = process.env.PORT || 8080;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main",}));
app.set("view engine", "handlebars");


var databaseUri = 'mongodb://localhost/RA';

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri, { useNewUrlParser: true });
}

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


//handlebars route
app.get("/", function(req, res) {
    db.Article.find({saved: false})
    .then(function (dbArticle) {
        var hbsObject = {
            articles: dbArticle
        };
        res.render("index", hbsObject);
    })
    .catch(function(err) {
        console.log(err);
    }); 
});



//GET route for scraping from resident advisor news column
app.get("/scrape", function(req, res) {
    axios.get("https://www.residentadvisor.net/news").then(function(response) {
        var $ = cheerio.load(response.data);

        console.log("scraping Started")
        $("article.highlight-top").each(function(i, element) {
            var result = {};

            // result.image = $(this)
            // .find("thumb")
            // .attr("img");
            result.title = $(this)
            .find("h1")
            .text();
            result.link = $(this)
            .find("a")
            .attr("href");
            result.headline = $(this)
            .find("p.copy")
            .text();
            if (!result.link) {
                result.link = "link not available"
            } 
            // console.log($(this).find("a.title").attr("href"));
            // console.log($(this).find("h1").text());

            // console.log(result.title);
            // console.log(result.link);
           result.saved = false;
            console.log(result);
            
            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(err) {
                console.log(err);
            });
        });

        res.redirect("/");
        // res.render("index", hbsObject);
        console.log("done")
        // console.log(result + "results");
        // console.log(dbNews + "dbNews");
    });
});

//to clear all scrapes
// app.get("/clear", function(req, res) {
//     db.Article.remove({}, function(err, data) {
//        db.Note.remove({}, function (err, data))
//     })
//     res.redirect("/");
// });

// route for grabbing news articles from the db
app.get("/news", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/saved", function(req, res) {
    db.Article.find({saved: true})
    .populate("notes")
    .then(function(err, savedArticles) {
        var hbsObject = {
            articles: savedArticles
        };
        res.render("saved", hbsObject);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// route to grab specific article with note
app.get("/news/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id})
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle) 
    })
    .catch(function(err) {
        res.json(err);
    });
});

//route for saving an article
app.put("/save/:id", function(req, res) {
    db.Article.findOneAndUpdate({_id: req.params.id}, {saved:true})
    .then(function(data) {
        res.json(data)
    })
    .catch(function(err) {
        res.json(err);
    });
    
});

//route for saving/updating article's notes
app.post("/news/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id}, {$push:{note: dbNote._id}}, {new: true});
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});


//route to save new note
app.post("/news/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id,}, {body: req.body.text}, {new:true});
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//route for deleting article
app.delete("/delete/:id", function(req, res) {
    db.Article.findOneAndUpdate({_id: req.params.id}, {"saved": false}, {new: true})
    .then(function(dbArticle) {

    })
    .catch(function (err) {
        res.json(err);
    });
});

//route to delete an article's note
app.delete("/notes/:id", function(req, res) {
    console.log(req.params.id);
    db.Note.findOneandRemove({id: req.params.note_id})
    .then(function(dbNote) {
        return db.Article.findOneAndRemove({ _id: req.params.id}, {note: dbNote._id}, {new: true});
    })
    .then(function(dbArticle) {
        res.json(dbArticle);

    })
    .catch(function(err) {
        res.json(err);
    });
});

app.listen(PORT, function() {
    console.log("App listening on port " + PORT);
});
