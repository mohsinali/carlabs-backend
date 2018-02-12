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
*/
app.post("/users/chat", create_chat);

app.post('/dialogflow', communicate);

app.get('/gcl', (req, res) => {
  
  // Instantiates a sessison client
  const sessionClient = new dialogflow.SessionsClient();
  let queries = ["What's the weather like in Los Angeles?"];
  let projectId = process.env.PROJECT_ID;
  let sessionId = process.env.SESSION_ID;
  if (!queries || !queries.length) {
    return;
  }

  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  let promise;

  // Detects the intent of the queries.
  for (const query of queries) {
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: 'en',
        },
      },
    };

    if (!promise) {
      // First query.
      console.log(`Sending query "${query}"`);
      promise = sessionClient.detectIntent(request);
    } else {
      promise = promise.then(responses => {
        console.log('Detected intent');
        const response = responses[0];
        // logQueryResult(sessionClient, response.queryResult);

        // Use output contexts as input contexts for the next query.
        response.queryResult.outputContexts.forEach(context => {
          // There is a bug in gRPC that the returned google.protobuf.Struct
          // value contains fields with value of null, which causes error
          // when encoding it back. Converting to JSON and back to proto
          // removes those values.
          context.parameters = structjson.jsonToStructProto(
            structjson.structProtoToJson(context.parameters)
          );
        });
        request.queryParams = {
          contexts: response.queryResult.outputContexts,
        };

        console.log(`Sending query "${query}"`);
        return sessionClient.detectIntent(request);
      });
    }
  } // Useless for loop

  promise
    .then(responses => {
      console.log('Detected intent');
      // logQueryResult(sessionClient, responses[0].queryResult);
      console.log(responses[0].queryResult);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
});


module.exports = { app };