require("dotenv").config();

const v3 = require("node-hue-api").v3;
const discovery = v3.discovery;

const colorTranslator = require("rgb");

const LightState = v3.lightStates.LightState;

async function changeLightColor(color) {
  const lightID = [5, 6, 7, 8, 10, 12, 13];

  try {
    const searchResults = await v3.discovery.nupnpSearch();
    if (searchResults) {
      const host = searchResults[0].ipaddress;
      const api = await v3.api
        .createLocal(host)
        .connect(process.env.HUE_USERNAME);

      if (api) {
        const chosenColor = colorTranslator(color);
        const testString = chosenColor.split("(");
        const finalString = testString[1].split(",");

        const R = finalString[0];
        const G = finalString[1];
        const B = finalString[2].split(")");
        console.log(B[0]);

        const state = new LightState().on(true).brightness(100).rgb(R, G, B);

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
