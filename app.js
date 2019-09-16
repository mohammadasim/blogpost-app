// Constant Declaration
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

//Initialization
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressSanitizer()); //Important to place it after the body-parser use statement
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
  req.body.blog.body = req.sanitize(req.body.blog.body);
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
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      console.log('An Error occured: ', err)
    } else {
      res.render("edit", {
        blog: foundBlog
      });
    }
  });
});

app.put("/blogs/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      console.log("An error was thrown");
      res.redirect("/blogs/req.params.id/edit");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.delete("/blogs/:id", (req, res) =>{
  Blog.findOneAndDelete(req.params.id,(err) =>{
    if(err){
      res.redirect("/blogs/req.params.id");
    }
    else{
      res.redirect("/blogs");
    }
  });
});

// RUN APP SERVER
const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port} 🔥`);