const User = require('./../models/user');

let create_user = (req, res) => {  
  let user = new User({email: req.body.email});
  res.setHeader('Content-Type', 'application/json');

  user.save().then((docUser) => {
    res.status(200).send(JSON.stringify({ 'user': docUser, 'message': 'User created successfully.' }));
  
  }).catch((err) => {
    res.status(400).send(JSON.stringify({ 'user': null, 'message': err.message }));
  });    
}

module.exports = { create_user }