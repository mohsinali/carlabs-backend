const 
  User = require('../models/user'),
  dialogflow = require('dialogflow'),
  projectId = process.env.PROJECT_ID,
  sessionId = process.env.SESSION_ID,
  logger = require("../utils/logger")

const communicate = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  let params = req.body;

  getWeatherUpdate(params).then((weather) => {
    res.status(200).send(JSON.stringify({ 'message': weather }));
  });
  
};

const getWeatherUpdate = async (params) => {
  user = await get_user(params.email);
  user_chat = await save_chat(user, params.message, 'user');
  weather_update = await get_dialogflow_response(params.message);
  user_chat = await save_chat(user, weather_update, 'bot');  
  
  return weather_update;
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

  promise = sessionClient.detectIntent(request);
  return promise
            .then(responses => {
              logger.debug('Detected intent');
              dialogflow_res_message = responses[0].queryResult["fulfillmentText"];
              logger.debug(responses[0].queryResult["fulfillmentText"]);
              return dialogflow_res_message;
            })
            .catch(err => {
              logger.error('ERROR:', err);
            });

  
}

module.exports = { communicate };