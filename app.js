const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");

// DB CONNECTION SETUP
var DATABASE_URL = process.env.MONGODB_DATABASE_URL;
mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("We are connected to the database!!");
});

//SCHEMA SETUP
var blogSchema = mongoose.Schema({
  name: String,
  image: String,
  description: String
});

// Mongoose Model setup
var Blog = mongoose.model('Blog', blogSchema);

// APP ROUTES
app.get("/", (req, res) => {
  res.send("Welcome to the Blog App!!!!");
});

// RUN APP SERVER
const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port} 🔥`);







