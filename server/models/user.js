const
  mongoose = require('mongoose'),
  Schema = mongoose.Schema
  
  // Embedded Chats schema
  Chats = new Schema({
    message: { type: String, required: true },
    sender: { type: String }
  }),

  // User schema
  UserModel = new Schema({
    email: { type: String, trim: true, required: true },
    chats: [Chats]
  }),
  
  model = mongoose.model('User', UserModel);

module.exports = model;