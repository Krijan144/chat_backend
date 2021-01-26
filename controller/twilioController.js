const config = require("../config/otpconfig");
const twilio = require("twilio");

const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

const TokenGenerator = (identity) => {
  const appName = "TwilioChat";

  // Create a "grant" which enables a client to use Chat as a given user
  const chatGrant = new ChatGrant({
    serviceSid: config.serviceSID,
  });

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    config.accountSid,
    config.chatSID,
    config.apiSecret
  );

  token.addGrant(chatGrant);
  token.identity = identity;
};
