require("dotenv").config();

const config = require("./Utils/config");
const commandController = require("./Controller/CommandController");
const lightEvents = require("./Commands/ChangeLightColor");

const v3 = require("node-hue-api").v3;

const hueApi = v3.api;

config.client.connect();

async function OnConnectHandler() {
  const authenticatedApi = await hueApi
    .createLocal("192.168.1.147")
    .connect(process.env.HUE_USERNAME);

  config.client.say(process.env.CHANNEL_NAME, ".");
}

config.client.on("connected", OnConnectHandler);

config.client.on("message", (channel, tags, message, self) => {
  if (self) return;

  //Many thanks to @whitep4nth3r for this
  const getCommandFromMessage = message.split(" ")[0];
  const getRestOfMessage = message.split(" ").slice(1);

  commandController.GetCommandName(
    getCommandFromMessage,
    getRestOfMessage,
    tags
  );
});

config.client.on("cheer", (channel, userstate, message) => {
  lightEvents.TriggerLightsOnEvent("cheerOrSubscriber");
});

config.client.on(
  "subscription",
  (channel, username, method, message, userstate) => {
    lightEvents.TriggerLightsOnEvent("cheerOrSubscriber");
  }
);

config.client.on("hosted", (channel, username, viewers, autohost) => {
  lightEvents.TriggerLightsOnEvent("hostOrRaid");
});

config.client.on("raided", (channel, username, viewers) => {
  lightEvents.TriggerLightsOnEvent("hostOrRaid");
});
