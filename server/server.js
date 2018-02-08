var express = require('express');
var bodyParser = require('body-parser');

// var { mongoose } = require('./db/mongoose');
var { get_weather } = require('./controllers/get_weahter');

var app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Server running at port: 3000');
});



app.post("/get_weather", get_weather);


module.exports = { app };