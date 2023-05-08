
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

const articleSchema = {
  title: String,
  content: String
}

const Article = new mongoose.model("Article",articleSchema);

//default data for tests :

const aritcle1 = new Article({
  title: "This is my first article",
  content:"this is what i want to show you in this article !"
});
const aritcle2 = new Article({
  title: "This is my Second article",
  content:"this is what i want to show you in this Second article !"
})

const defaultData =[aritcle1,aritcle2];

//Article.insertMany(defaultData);

app.route("/articles")

.get((req,res)=>{
  Article.find({}).exec().then((docs)=>{
    res.send(docs);
  }).catch((err)=>{
    res.send("Error occurred while trying to GET all articles.");
  });
})

.post((req,res)=>{
  const title = req.body.title;
  const content = req.body.content;
  const newArticle = new Article({
    title: title,
    content: content
  });
  newArticle.save().then((docs)=>{
    res.send("Article sucessfully been added.");
  }).catch((err)=>{
    res.send("Error occurred while trying to post new article.");
  });
})

.delete((req,res)=>{
  Article.deleteMany().then((result)=>{
    console.log("${result.deletedCount}");
    res.send("All articles sucessfully been deleted.");
  }).catch((error)=>{
    console.error(error);
    res.send("Error occurred while trying to delete all articles.");
  });
});



app.route("/articles/:articleTitle")

.get((req,res)=>{
  Article.findOne({title:req.params.articleTitle}).then((article)=>{
      res.send(article);
  }).catch((err)=>{
    res.send("Error occurred while trying to get " + req.params.articleTitle +".");
  })
})

.delete((req,res)=>{
  Article.deleteOne({title:req.params.articleTitle}).then((msg)=>{
    res.send("Article "+req.params.articleTitle+" sucessfully been deleted.");
  }).catch((err)=>{
    res.send("Error occurred while trying to delete " + req.params.articleTitle +".");
  });
})

.put((req,res)=>{
  Article.updateOne({title:req.params.articleTitle},{title:req.body.title, content: req.body.content} ).then((msg)=>{
    res.send("Article "+req.params.articleTitle+" sucessfully been updated.");
  }).catch((err)=>{
    res.send("Error occurred while trying to update " + req.params.articleTitle +".");
  })
})

.patch((req,res)=>{
  Article.updateOne({title:req.params.articleTitle},{$set:req.body}).then((msg)=>{
    res.send("Article "+req.params.articleTitle+" sucessfully been updated.");
  }).catch((err)=>{
    res.send("Error occurred while trying to update " + req.params.articleTitle +".");
  })
});
