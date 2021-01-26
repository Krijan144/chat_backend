const socketio = require("socket.io");
const io = socketio();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
// const http = require("http").createServer(app);
// const io = socketio(http);
const formatMessage = require("../utils/messages");
const otpController = require("../controller/otpController");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("../utils/users");
const ChatModel = require("../models/chatModel");
const mongoose = require("mongoose");
const connect = require("../server");

exports.chat = (http) => {
  // const wrap = (otpController.protect = (socket, next) =>
  //   otpController.protect(socket.request, {}, next));

  app.use(express.static("public"));
  const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["valid"],
      credentials: true,
    },
  });
  io.use((socket, next) => {
    otpController.protect(next());
  });
  const bot = "Chatbot";

  //run when client connects
  io.on("connection", (socket) => {
    console.log("sucessfully connected to socket");

    socket.on("chatMessage", (msg) => {
      console.log(msg);
    });
    socket.on("joinroom", ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
      console.log({ username, room });
      socket.join(user.user.room);
      //Welcome Message
      socket.emit("message", formatMessage(bot, "Welcome to chatbot"));
      // Show user has joined the chat
      socket.broadcast
        .to(user.user.room)
        .emit(
          "message",
          formatMessage(bot, `${user.user.username} has joined the chat`)
        );

      socket.on("chatMessage", (msg) => {
        console.log(msg);
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, msg));
        let chatMessage = new ChatModel({
          message: msg,
          sender: user.username,
          time: user.time,
          room: user.room,
        });

        chatMessage.save();
      });
      // //console.log(msg);
      // async (req, res) => {
      //   try {
      //     const msg1 = await ChatModel.new((message = msg));
      //     res.status(200).json({
      //       data: msg1,
      //     });
      //   } catch (err) {
      //     res.json({
      //       data: err,
      //     });
      //   }
      // };
    });
    //Show user has disconnected
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      console.log(user);
      io.to(user.room).emit(
        "message",
        formatMessage(bot, `${user.username} has left the chat`)
      );
    });
  });
};

exports.roomchat = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      room: req.params.id,
    });
    console.log();
    res.status(200).json({
      status: "false",
      data: chat,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
