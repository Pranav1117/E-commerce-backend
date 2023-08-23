const express = require("express");
const route = express.Router();

const { SignIn, Register, data } = require("../controllers/controller");

route.use("/signin", SignIn);

route.post("/register", Register);

route.get("/data", data);

module.exports = { route };
