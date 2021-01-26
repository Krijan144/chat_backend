const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const socketController = require("./controller/socketController");
const otpController = require("./controller/otpController");
const app = require("./app");
const http = require("http").createServer(app);
const cors = require("cors");

//app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

dotenv.config();

// const uri = process.env.DATABASE_DEV;
// const connect = mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// });
socketController.chat(http);

// const connection = mongoose.connection;
// connection.once("open", () => {
//   console.log("!!! Database Successfully Connected !!!");
// });

const PORT = 4000 || process.env.PORT;
http.listen(PORT, () => `Server running on port ${PORT}`);

// module.exports = connect;
