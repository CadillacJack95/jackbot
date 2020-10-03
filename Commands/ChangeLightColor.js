require("dotenv").config();

const axios = require("axios");
const v3 = require("node-hue-api").v3;
const discovery = v3.discovery;
const namedColors = require("color-name-list");
const hexRgb = require("hex-rgb");

const LightState = v3.lightStates.LightState;

async function changeLightColor(chosenColor) {
  const lightID = [5, 6, 7, 8, 10, 12, 13];

  try {
    const searchResults = await v3.discovery.nupnpSearch();
    if (searchResults) {
      const host = searchResults[0].ipaddress;
      const api = await v3.api
        .createLocal(host)
        .connect(process.env.HUE_USERNAME);

      if (api) {
        let foundColor = namedColors.find(
          (color) => color.name === String(chosenColor)
        );
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
