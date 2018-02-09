//************************************* */
//*** Top level declarations
const
  express = require('express'),
  bodyParser = require('body-parser'),

  { mongoose } = require('./db/mongoose'),
  { get_weather } = require('./controllers/get_weahter'),
  { create_user } = require('./controllers/create_user'),
  { create_chat } = require('./controllers/create_chat'),
  User = require('./models/user'),
  app = express();
//************************************* */

// Using Body parser for json parsing
app.use(bodyParser.json());


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
*/
app.post("/users/chat", create_chat);


module.exports = { app };