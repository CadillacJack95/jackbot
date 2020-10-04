require("dotenv").config();

const v3 = require("node-hue-api").v3;
const discovery = v3.discovery;
const namedColors = require("color-name-list");
const hexRgb = require("hex-rgb");
const config = require("../Utils/config");

const LightState = v3.lightStates.LightState;

async function changeLightColor(chosenColor) {
  const lightID = [5, 6, 7, 8, 10, 12, 13];
  const chosenColorName = String(chosenColor.join(" ").toLowerCase());

  try {
    const searchResults = await discovery.nupnpSearch();
    if (searchResults) {
      const host = searchResults[0].ipaddress;
      const api = await v3.api
        .createLocal(host)
        .connect(process.env.HUE_USERNAME);

      if (chosenColorName === "black") {
        const offState = new LightState().off(true);
        return lightID.map((light) =>
          api.lights.setLightState(light, offState)
        );
      }

      if (api) {
        let foundColor = namedColors.find(
          (color) => color.name.toLowerCase() === chosenColorName
        );

        if (!foundColor) {
          config.client.say(
            process.env.CHANNEL_NAME,
            `${chosenColorName} does not exist. For a list of colors you can head to this link: https://codepen.io/meodai/full/VMpNdQ/`
          );
          return;
        }
        const RGB = hexRgb(foundColor.hex);

        const state = new LightState()
          .on(true)
          .brightness(100)
          .rgb(RGB.red, RGB.green, RGB.blue);

        lightID.map((light) => api.lights.setLightState(light, state));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  changeLightColor,
};
