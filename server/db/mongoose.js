if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_HOST);

module.exports = { mongoose };