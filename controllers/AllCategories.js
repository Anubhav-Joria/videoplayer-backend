const express = require("express");
const categoryRouter = express.Router();
const { Users } = require("../Model/schemas");

categoryRouter.get("/data", async function (req, res) {
  const email = req.query.email;
  if (!email) return res.status(404).send({ message: "cannot find user" });

  const userData = await Users.findOne({ email: email });
  res.status(200).send({ userData: userData.data });
});

categoryRouter.get("/cards", async function (req, res) {
  const email = req.query.email;
  const category = req.query.category;
  if (!email) {
    return res.status(404).send({ message: "cannot find user" });
  }
  if (!category) {
    return res.status(404).send({ message: "cannot find category" });
  }
  const userData = await Users.findOne({ email: email });
  if(category === "All Items"){
    return res.status(200).send({ cards: userData.data.cards });
  }

  let categoryCards = userData.data.cards.filter(e => e.category === category)
  return res.status(200).send({ cards: categoryCards});
});

module.exports = categoryRouter;
