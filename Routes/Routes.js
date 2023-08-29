const express = require("express");
const route = express.Router();

const {
  SignIn,
  Register,
  data,
  getCartItems,
  addtOCart,
  decreaseItemCart,
  deleteItem,
  logOut,
  orderDetails,
  searchProducts,
} = require("../controllers/controller");

const { isLoggedIn } = require("../middleaware/middleware");
const authMiddleware = require("../middleaware/auth");

route.post("/login", SignIn);

route.post("/register", Register);

route.get("/cartitems", isLoggedIn, getCartItems);

route.post("/addtocart", isLoggedIn, addtOCart);

route.patch("/decreaseitemcart", isLoggedIn, decreaseItemCart);

route.post("/orders", orderDetails);

route.post("/deleteitemcart", deleteItem);

route.get("/logout", logOut);

route.get("/data", isLoggedIn, data);

route.get("/search/:data", searchProducts);

module.exports = { route };
