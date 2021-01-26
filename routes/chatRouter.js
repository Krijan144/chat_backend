const express = require("express");
const router = express();
const chatController = require("../controller/socketController");

router.get("/:id", chatController.roomchat);

module.exports = router;
