const 
  User = require('../models/user'),
  logger = require("../utils/logger")

const get_user = (req, res) => {
  User.findOne({email: req.params.email}).then((user) => {
    if(user){
      res.send(JSON.stringify({error: false, "user": user}));
    }else{
      res.status(200).send(JSON.stringify({error: true, "message": "Unable to find user. "}));  
    }
  }).catch((e) => {
    logger.debug("=========== Exception - controllers/get_user ===========");
    logger.debug(e.message);
    res.status(500).send(JSON.stringify({error: true, "message": "Unable to find user. "}));
  });  
}

module.exports = get_user;