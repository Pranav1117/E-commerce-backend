const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Users = require("../model/Users");
dotenv.config();
const SECRET_KEY = process.env.SecretKey;

const getUser = async (headers) => {
  const { authorization } = headers;
  const token = authorization.split(" ")[1];

  if (!token) {
    return res.send({ msg: "Not Logged in" });
  } else {
    try {
      const { email } = jwt.verify(token, SECRET_KEY);

      const User = await Users.findOne({ email: email });

      return User;
    } catch (err) {
      console.log(err);
    }
  }
};
module.exports = { getUser };
