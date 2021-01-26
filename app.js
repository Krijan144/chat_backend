const express = require("express");
const app = express();
const cors = require("cors");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT", "POST", "GET", "DELETE");
    return res.status(200).json("ok");
  }
  next();
});
app.use("/api/chat", require("./routes/chatRouter"));

module.exports = app;
