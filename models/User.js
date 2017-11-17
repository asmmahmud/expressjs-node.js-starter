const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserScema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  date_of_birth: {
    type: Date
  },
  photo: {
    type: String
  },
  date_of_registration: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('user', UserScema);