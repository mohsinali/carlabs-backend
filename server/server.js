var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');

var app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Server running at port: 3000');
});

