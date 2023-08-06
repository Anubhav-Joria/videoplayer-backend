const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const cors = require("cors");
app.use(cors());
require("./dbs/connection.js");

app.use(express.json());
app.use(require("./controllers/Authentication.js"));
app.use(require("./controllers/AllCategories.js"));
app.use(require("./controllers/AddCard.js"));
app.use(require("./controllers/EditCard.js"));
app.use(require("./controllers/deleteCard.js"));
app.use(require("./controllers/DeleteUsers.js"));

app.get("/", (req, res, next) => {
  res.send("Welcome to the Home Page");
});
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("server listening on port " + PORT);
});
