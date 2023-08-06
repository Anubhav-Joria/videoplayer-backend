const express = require("express");
const router = express.Router();
const { Users } = require("../Model/schemas");

router.get('/api/deleteUsers', async function(req, res){
  try {
    const result = await Users.deleteMany({});
    console.log(`${result.deletedCount} users were deleted`);
    res.send(`${result.deletedCount} users were deleted`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting users");
  }
})
module.exports = router;