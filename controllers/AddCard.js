const express = require("express");
const router = express.Router();
const { Users } = require("../Model/schemas");

router.post("/addCard1", async function (req, res) {
  const { email, values } = req.body;
  if (!email) {
    return res.status(404).send({ message: "user not found" });
  }
  if (!values) {
    return res.status(404).send({ message: "Please enter all the values" });
  }

  const { data } = await Users.find({ email });
  if (!data.categories.some((obj) => obj.name === values.category)) {
    data.categories.push({ name: values.category });
  }

  data.cards.push({
    name: values.name,
    link: values.link,
    category: values.category,
  });
});

router.post("/addCard", async function (req, res) {
  const { email, values } = req.body;
  if (!email) {
    return res.status(404).send({ message: "user not found" });
  }
  if (!values) {
    return res.status(404).send({ message: "Please enter all the values" });
  }

  try {
    const user = await Users.findOne({ email });
    console.log("user", user);
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }

    if (!user.data.categories.some((obj) => obj.name === values.category)) {
      user.data.categories.push({ name: values.category });
    }
    if (
      !user.data.cards.some(
        (obj) => obj.name === values.name || obj.link === values.link
      )
    ) {
      user.data.cards.push({
        name: values.name,
        link: values.link,
        category: values.category,
      });
    }
    else{
        return res
        .status(500)
        .send({ message: "A card with this name or link already exist" });
    }

    await user.save();
    
    res.status(200).send({ message: "Card added successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "An error occurred while adding the card" });
  }
});

module.exports = router;
