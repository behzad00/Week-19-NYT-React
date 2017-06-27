var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var History = require("./models/History");

var app = express();

var PORT = process.env.PORT || 3000;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("./public"));

mongoose.connect("mongodb://admin:codingrocks@ds023664.mlab.com:23664/reactlocate");
////mongoose.connect("mongodb://localhost/article");

var db = mongoose.connection;

db.on("error" , function(err){
	console.log("Mongoose Error: ", err);
	});
db.once("open" , function(){
	console.log("Mongoose connection successful.");
});

// Main "/" Route. This will redirect the user to our rendered React application
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/api", function(req, res) {

  // We will find all the records, sort it in descending order, then limit the records to 5
  History.find({}).sort([
    ["date", "descending"]
  ]).limit(5).exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

app.post("/api", function(req, res) {
  console.log("BODY: " + req.body.title);

// We'll use Date.now() to always get the current date time
  Article.create({
    title: req.body.title,
    url: req.body.url,
    publishedDate: req.param.date
  }, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      res.send("Saved Search");
    }
  });
});

// Listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
