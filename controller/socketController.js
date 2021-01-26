const socketio = require("socket.io");
const io = socketio();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const formatMessage = require("../utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("../utils/users");
const ChatModel = require("../models/chatModel");

exports.chat = (http) => {
  app.use(express.static("public"));
  const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {

    socket.on("join", ({ name, room }, callback) => {
      const { error, user } = userJoin(socket.id, name, room)
      if (error) return callback(error)
      socket.emit("message", { user: `${user.username}`, text: `${user.username}, welcome to the room ${user.room}` })
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: "New user has joined" });
      socket.join(user.room);
      //
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
      callback();
    });

    socket.on("chatMessage", (msg, callback) => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit("message", formatMessage(user.username, msg));
      callback();
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
