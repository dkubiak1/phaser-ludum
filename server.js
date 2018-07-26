// Dependencies
var express = require("express");

var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));



// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
