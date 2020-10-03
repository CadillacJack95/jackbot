require("dotenv").config();
const lights = require("../Commands/ChangeLightColor");
const config = require("../Utils/config");

function GetCommandName(command, args) {
  switch (String(command).toLowerCase()) {
    case "!light": {
      lights.changeLightColor(args);
      break;
    }
    case "!help": {
      config.client.say(
        process.env.CHANNEL_NAME,
        "You can use !light <color>, !discord, !github & !twitter"
      );
      break;
    }
  }
}

module.exports = {
  GetCommandName,
};
