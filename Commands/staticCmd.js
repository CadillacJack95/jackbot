require("dotenv").config();
const { client } = require("tmi.js");
const config = require("../Utils/config");

function SendHelp() {
  config.client.say(
    process.env.CHANNEL_NAME,
    "Commands available !light <colorName>, !discord, !github & !twitter"
  );
}

function Discord() {
  config.client.say(
    process.env.CHANNEL_NAME,
    "Want to come hangout with me off stream? We have a discord server now! https://discord.gg/2DbqPHq"
  );
}

function Twitter() {
  config.client.say(
    process.env.CHANNEL_NAME,
    "You can find me @ https://twitter.com/CadillacJack95"
  );
}

function GitHub() {
  config.client.say(
    process.env.CHANNEL_NAME,
    "https://github.com/CadillacJack95"
  );
}

module.exports = {
  SendHelp,
  Discord,
  Twitter,
  GitHub,
};
