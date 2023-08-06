const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: { type: "string", required: true },
  link: { type: "string", required: true },
  category: { type: "string", required: true },
});

const categorySchema = new mongoose.Schema({
  name: { type: "string", required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: "string", required: true },
  email: { type: "string", required: true },
  password: { type: "string", required: true },
  data: {
    categories: [categorySchema],
    cards: [cardSchema],
  }
});



const Users = mongoose.model("Users", userSchema);

module.exports = { Users };
