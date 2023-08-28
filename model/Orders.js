const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const orderSchema = new mongoose.Schema({
  userEmail: {
    type: String,
  },
  product: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
  },
  image: {
    type: String,
  },
  date: {
    type: Number,
  },
});

const Orders = mongoose.model("Orders", orderSchema);
module.exports = Orders;
