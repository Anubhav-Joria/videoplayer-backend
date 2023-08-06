const mongoose = require("mongoose");

// const DB = process.env.DB 
const DB = "mongodb+srv://anubhavjoria29:tgQh90d1ZcqrBH35@cluster0.noxonh8.mongodb.net/";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("not connected, error : " + err);
  });
