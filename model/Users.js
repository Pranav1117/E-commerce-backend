const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const user = new mongoose.Schema({
  name: {
    type: String,
    requred: true,
  },
  email: {
    type: String,
    requred: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    requred: true,
  },
  phoneNo: {
    type: Number,
    requred: true,
  },
});

const Users = mongoose.model("Users", user);
module.exports = Users;
