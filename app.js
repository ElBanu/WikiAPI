
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const uriAtlas = "mongodb+srv://admin:admin@cluster0.vbbdz.mongodb.net/?retryWrites=true&w=majority";

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(uriAtlas, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "wikiDB"
});

const articlesSchema = {
    title: {
      type: String,
      required: [true, 'missing blog post title']
    },
   
    content: {
      type: String,
      required: [true, 'missing blog post content']
    }
  };
  
const Article = mongoose.model("Article", articlesSchema);

//////////// Requests targeting all articles////////////////

app.route("/articles")
.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err) {
        res.send(foundArticles);
    } else {
        res.send(err);
    }
    });
  })

.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err) {
            res.send("Successfully added a new article.")
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err) {
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});


//////////// Requests targeting a specific article////////////////
app.route("/articles/:articleTitle")
    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
            if(foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("No articles matching that title was found");
            }
        });
})

    .put(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content}, 
            function(err){
                if(!err) {
                    res.send("Successfully updated the article.")
                } else {
                    res.send("Updating the article failed.")
                }
        });
    })

    .patch(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err) {
                if(!err) {
                    res.send("Successfully updated the article.")
                } else {
                    res.send("Updating the article failed.")
                }
            }
        )
    })

    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err) {
                if(!err) {
                    res.send("Successfully deleted the article.")
                } else {
                    res.send("Deleting the article failed.")
                }
            }
        )
    })

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });

