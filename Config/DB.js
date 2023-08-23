const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const url =
  "mongodb+srv://Pranav:Pranav123@cluster0.j4ne11g.mongodb.net/?retryWrites=true&w=majority";

const connection = async () => {
  try {
    const client = await mongoose.connect(url);
    console.log("connected with atlas");
  } catch (err) {
    console.log(err);
  }
};
module.exports = { connection };
