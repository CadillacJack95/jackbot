require("dotenv").config();
const lights = require("../Commands/ChangeLightColor");
const staticCommands = require("../Commands/staticCmd");
const config = require("../Utils/config");

function GetCommandName(command, args, tags, userstate) {
  switch (String(command).toLowerCase()) {
    case "!light": {
      lights.changeLightColor(args);
      break;
    }
    case "!help": {
      staticCommands.SendHelp();

      break;
    }
    case "!discord": {
      staticCommands.Discord();
      break;
    }
    case "!twitter": {
      staticCommands.Twitter();
      break;
    }
    case "!github": {
      staticCommands.GitHub();
      break;
    }
    case "!so": {
      config.client.say(
        process.env.CHANNEL_NAME,
        `Spread the support and love and go check out ${args[0]} at https://www.twitch.tv/${args[0]} !`
      );
      break;
    }
  }
}

module.exports = {
  GetCommandName,
};
