const express = require("express");
const router = express.Router();
const { Users } = require("../Model/schemas");

router.post("/deleteCard", async function (req, res) {
  const id = req.query.id;
  const email = req.query.email;
  try {
    const result = await Users.findOne({email : email});
    const newCardsArray = result.data.cards.filter( obj => obj.id !== id);
    result.data.cards = newCardsArray;
    await result.save();
    return res.status(200).send({ message: "Card deleted successfully", result });
  } catch (err) {
    console.log("error", err);
    return res.status(404).send({ message: "Deletion Unsuccessful" });

  }
});

module.exports = router;
