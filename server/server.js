//************************************* */
//*** Top level declarations
const
  express = require('express'),
  bodyParser = require('body-parser'),
  dialogflow = require('dialogflow'),

  { mongoose } = require('./db/mongoose'),
  { get_weather } = require('./controllers/get_weahter'),
  { create_user } = require('./controllers/create_user'),
  { create_chat } = require('./controllers/create_chat'),
  { communicate } = require('./controllers/communicate'),
  User = require('./models/user'),
  app = express();
//************************************* */

// Using Body parser for json parsing
app.use(bodyParser.json());

//*** Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



//*** Server Initialization
app.listen(3000, () => {
  console.log('Server running at port: 3000');
});


/******************************** 
 * POST
 * Expects @city and @date as params in body
 * Calls World Weather Online API and return JSON response
*/
app.post("/get_weather", get_weather);


//*** Not inuse. Only for testing purposes
app.get("/test", (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({ 'message': "here you go" }));
});

//##### RESOURCE: USER

/******************************** 
 * POST
 * Expects @email as param in body
*/
app.post("/users", create_user);


//##### RESOURCE: CHAT
/******************************** 
 * POST
 * Expects @email & @message as param in body
 * DEPRECATED
*/
app.post("/users/chat", create_chat);


/******************************** 
 * POST
 * Expects @email & @message as param in body
 * Interacts with Dialogflow API
*/
app.post('/dialogflow', communicate);


module.exports = { app };