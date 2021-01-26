const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    message: {
      type: String,
    },
    sender: {
      type: String,
    },
    time: {
      type: String,
    },
    room: {
      type: String,
    },
  }
  //timestamps: Date.now(),
);

const ChatModel = mongoose.model("ChatModel", ChatSchema);
module.exports = ChatModel;
