const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  ids: Number,
  category: String,
  subcategory: String,
  product: String,
  price: Number,
  description: String,
  rating: Number,
  image: String,
});

const Product = mongoose.model("Products", productSchema);
module.exports = Product;
