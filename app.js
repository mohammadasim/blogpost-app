// Constant Declaration
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const bodyParser = require("body-parser");

//Initialization
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride("_method"));

// DB CONNECTION SETUP
var DATABASE_URL = process.env.MONGODB_DATABASE_URL;
mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("We are connected to the database!!");
});

//SCHEMA SETUP
var blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now()
  }
});

// Mongoose Model setup
var Blog = mongoose.model('Blog', blogSchema);

// APP RESTFUL ROUTES
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
      res.render("new");
    } else {
      res.render("index", {
        blogs: blogs
      });
    }
  });
});

app.get("/blogs/new", (req, res) => {
  res.render("new");
});

app.post("/blogs", (req, res) => {
  Blog.create(req.body.blog, (err, blog) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs");
    }
  });
});

app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log('An error has occured: ', err);
    } else {
      res.render("show", {
        blog: blog
      });
    }
  });
});

app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) =>{
    if(err){
      console.log('An Error occured: ', err)
    }
    else{
      res.render("edit", {blog:foundBlog});
    }
  });
});

app.put("/blogs/:id", (req, res) => {
  var query = {title: req.params.title };
  Blog.findOneAndUpdate(query, {
    title: req.params.title,
    image: req.params.image,
    body: req.params.body
  }, (err, updatedBlog) =>{
    if(err){
      res.render("/blogs/req.params.id/edit");
    }
    else{
      res.render("/blogs/updatedBlog.id");
    }
  });
});

// RUN APP SERVER
const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port} 🔥`);