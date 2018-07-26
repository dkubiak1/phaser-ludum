// Dependencies
var express = require("express");

var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));

var PORT = process.env.PORT || 8080;



// Set the app to listen on port 3000
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

