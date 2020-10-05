require("dotenv").config();
const tmi = require("tmi.js");

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: process.env.JACKBOT_USERNAME,
    password: process.env.JACKBOT_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
});

module.exports = {
  client,
};
