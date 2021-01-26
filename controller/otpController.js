const config = require("../config/otpconfig");
const client = require("twilio")(config.accountSid, config.authToken);

exports.message = (req, res) => {
  //   client.verify.services
  //     .create({ friendlyName: "My Verify Service" })
  //     .then((service) => console.log(service.sid));
  try {
    client.messages
      .create({
        body: "Message Send!!",
        from: "+12092531148",
        to: `+${req.query.phonenumber}`,
      })
      .then((message) => res.json(message));
  } catch (err) {
    res.status(500).json(err);
  }
};
//+9779823513496;
exports.login = (req, res) => {
  try {
    client.verify
      .services(config.serviceID)
      .verifications.create({
        to: `+${req.query.phonenumber}`,
        channel: req.query.channel,
      })
      .then((data) => {
        //console.log(data);
        res.status(200).json(data);
      });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

exports.verify = (req, res, next) => {
  try {
    client.verify
      .services(config.serviceID)
      .verificationChecks.create({
        to: `+${req.query.phonenumber}`,
        code: req.query.code,
      })
      .then((data) => {
        console.log(data.valid);
        res.status(200).json({
          valid: true,
        });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.protect = (req, res, next) => {
  try {
    let valid = req.headers.valid;
    if (valid == true) {
      return res.status(200).send("validated");
    }
    res.send("no");
  } catch (err) {
    res.status(500).send(err);
  }
  next();
};
