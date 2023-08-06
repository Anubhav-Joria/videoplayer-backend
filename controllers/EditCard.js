const express = require("express");
const router = express.Router();
const { Users } = require("../Model/schemas");

router.post("/editCard", async function (req, res) {
  const { email, newData, id } = req.query;
  if (!email) {
    return res.status(404).send({ message: "user not found" });
  }
  if (!newData) {
    return res.status(404).send({ message: "Please enter all the newData" });
  }

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }

    user.data.cards.forEach((obj, index)=>{
      const objectID = obj._id.toString();
      if(objectID !== id){
        if(obj.name === newData.name || obj.link === newData.link){
          return res.status(200).send({ message: "a card already exists with the same name or link" });
        }
      }
      else{
        user.data.cards[index] = {
          ...user.data.cards[index],
          name : newData.name,
          link : newData.link,
          category : newData.category
      }
      }
    })

    if (!user.data.categories.some((obj) => obj.name === newData.category)) {
      user.data.categories.push({ name: newData.category });
    }
    await user.save(); 
    return res.status(200).send({ message: "Card edited successfully" });
  } 
  catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "An error occurred while adding the card" });
  }
});

module.exports = router;
