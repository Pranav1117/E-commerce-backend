const express = require("express");
const app = express();
const cors = require("cors");

const { route } = require("./Routes/Routes");

app.use(express.json());

app.use(cors());

const dotenv = require("dotenv");
const { connection } = require("./Config/DB");
const {
  addData,
  deleteData,
  deleteAllCartProducts,
  deleteZeroQuantityItems,
} = require("./controllers/controller");
const { isLoggedIn } = require("./middleaware/middleware");
dotenv.config();
const PORT = process.env.Port;

app.get("/", (req, res) => {
  res.send("home page");
});

app.use(route);

// app.use(isLoggedIn);

app.listen(PORT, async () => {
  try {
    await connection();
    // addData();
    // deleteData()
    // deleteAllCartProducts();
    deleteZeroQuantityItems();
    console.log(`running on ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});
