const User = require('../models/user');

let create_chat = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  let params = req.body;
  let user = null;

  user = await User.findOne({email: params.email});
  if(user){
    user.chats.push({message: params.message, sender: params.sender});
    
    user.save().then((docUser) => {
      res.status(200).send(JSON.stringify({ 'user': docUser, 'message': 'Chat created successfully.' }));
    
    }).catch((err) => {
      res.status(400).send(JSON.stringify({ 'user': null, 'message': err.message }));
    });

  }else{
    res.status(400).send(JSON.stringify({ 'user': null, 'message': "User not found." }));
  }  
}

module.exports = { create_chat };