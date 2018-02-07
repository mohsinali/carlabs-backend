var express = require('express');
var bodyParser = require('body-parser');

// var { mongoose } = require('./db/mongoose');

var app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Server running at port: 3000');
});


app.get("/get_weather", (req, res) => {
  response = "This is a sample response from your webhook!" //Default response from the webhook to show it's working


  res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
  res.send(JSON.stringify({ "speech": response, "displayText": response 
  //"speech" is the spoken version of the response, "displayText" is the visual version
  }));
});


module.exports = { app };