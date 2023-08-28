const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const cartSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  productId: {
    type: Number,
    ref: "Products",
  },
  quantity: {
    type: Number,
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  image: {
    type: String,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
