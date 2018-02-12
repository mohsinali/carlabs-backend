const 
  User = require('../models/user'),
  dialogflow = require('dialogflow'),
  projectId = process.env.PROJECT_ID,
  sessionId = process.env.SESSION_ID

const communicate = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  let params = req.body;

  getWeatherUpdate(params).then((weather) => {
    res.status(200).send(JSON.stringify({ 'message': weather }));
  });
  // const weather = await get_user(params.email);
  // Verify email
  // user = await get_user(params.email);
  
  // if(user){
  //   try {
  //     // save user's message in db
  //     await save_chat(user, params.message, 'user');
  
  //     // hit dialogflow
  //     // msg = await get_dialogflow_response(params.message);
  
  //     // save bot's message in db
  //     await save_chat(user, "params.message", 'bot');
  
  //     // return response
  //     await res.status(200).send(JSON.stringify({ 'message': "msg" }));
  //   } catch (ex) {
  //     console.log("=========== Exception - communicate ===========");
  //     console.log(ex.message);

  //     res.status(500).send(JSON.stringify({ "error": true, 'message': "Couldn't process the request." }));  
  //   }
  // }else{
  //   res.status(401).send(JSON.stringify({ "error": true, 'message': "Unauthorized access." }));
  // }
};

const getWeatherUpdate = async (params) => {
  user = await get_user(params.email);
  chat = await save_chat(user, params.message, 'user');
  weather_update = await get_dialogflow_response(params.message);
  console.log("Weahter update: " + weather_update);
  
  return `Its sunny. ${chat}`;
}

get_user = (email) => {
  return User.findOne({email: email}).then((user) => {    
    return user;
  });
}

save_chat = (user, message, sender) => {
  user.chats.push({message: message, sender: sender});
  return user.save().then((docUser) => {
    return user;
  });

  // return new Promise((resolve, reject) => {
  //   user.chats.push({message: message, sender: sender});

  //   user.save().then((docUser) => {
  //     console.log("Chat message saved successfully.");
  //     return user;
  //   });    
  // });
  // console.log("debugging: **** ", message);
  // user.chats.push({message: message, sender: sender});
  
  // user.save().then((docUser) => {
  //   console.log("Chat message saved successfully.");
  // }).catch((err) => {
  //   console.log("Unable to save chat message: ", err.message);
  // });
}


get_dialogflow_response = (message) => {
  let dialogflow_res_message = "";

  // Instantiates a sessison client
  const sessionClient = new dialogflow.SessionsClient();

  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  let promise;

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en',
      },
    },
  };

  if (!promise) {
    // First query.
    console.log(`Sending query "${message}"`);
    promise = sessionClient.detectIntent(request);
  } else {
    promise = promise.then(responses => {
      console.log('Detected intent');
      const response = responses[0];      

      // Use output contexts as input contexts for the next query.
      response.queryResult.outputContexts.forEach(context => {        
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

  promise
    .then(responses => {
      console.log('Detected intent');
      dialogflow_res_message = responses[0].queryResult["fulfillmentText"];
      console.log(responses[0].queryResult["fulfillmentText"]);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

  return dialogflow_res_message;  
}

module.exports = { communicate };