const express = require("express");
const router = express();
const otpController = require("../controller/otpController");

router.get("/login", otpController.login);
router.get("/verify", otpController.verify);
router.get("/message", otpController.message);

module.exports = router;
