require("dotenv").config();
const lights = require("../Commands/ChangeLightColor");
const config = require("../Utils/config");

function GetCommandName(command, args) {
  switch (command) {
    case "!light": {
      lights.changeLightColor(args);
    }
    case "!help": {
      config.client.say(
        process.env.CHANNEL_NAME,
        "You can use !light <color>, !discord, !github & !twitter"
      );
    }
  }
}

module.exports = {
  GetCommandName,
};