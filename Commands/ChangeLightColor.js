require("dotenv").config();

const v3 = require("node-hue-api").v3;
const discovery = v3.discovery;
const namedColors = require("color-name-list");
const hexRgb = require("hex-rgb");
const config = require("../Utils/config");

const LightState = v3.lightStates.LightState;

async function changeLightColor(chosenColor, tags) {
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

      //TODO: non broadcaster error: cannot read property broadcaster of null
      if (chosenColorName === "kill" && tags.badges.broadcaster === "1") {
        console.log("Kill command recieved");
        const state = new LightState().effect("none").rgb(0, 0, 255);
        lightID.map((light) => api.lights.setLightState(light, state));
        return;
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

async function TriggerLightsOnEvent(event) {
  const lightID = [5, 6, 7, 8, 10, 12, 13];
  let stateData;

  // const returnRandValue = () => {return Math.floor(Math.random() * 256)}
  // let generatedR = getRandomValue(); and have function getRandomValue () { return Math.floor(Math.random * 256) };

  const searchResults = await discovery.nupnpSearch();
  const returnRandValue = () => {
    return Math.floor(Math.random() * 256);
  };

  try {
    if (searchResults) {
      const host = searchResults[0].ipaddress;
      const api = await v3.api
        .createLocal(host)
        .connect(process.env.HUE_USERNAME);

      if (api) {
        switch (event) {
          case "cheerOrSubscriber": {
            stateData = {
              on: true,
              bri: 254,
              effect: "colorloop",
              alert: "lselect",
              event: "cheerOrSubscriber",
            };
            break;
          }
          case "hostOrRaid": {
            stateData = {
              on: true,
              bri: 254,
              alert: "lselect",
              rgb: [0, 0, 0],
              event: "hostOrRaid",
            };
            break;
          }
          default: {
            console.log("Case was not found");
            break;
          }
        }
        TriggerLightState(api, stateData);
      }
    }
  } catch (err) {
    console.error(err);
  }

  function TriggerLightState(api, stateData) {
    const state = new LightState();

    if (stateData.event === "cheerOrSubscriber") {
      for (let i = 0; i < 5; i++) {
        state.populate(stateData);
        lightID.map((light) => api.lights.setLightState(light, state));
      }
    } else if (stateData.event === "hostOrRaid") {
      state.populate(stateData);
      for (let i = 0; i < 5; i++) {
        if (i % 2 === 0) {
          state.rgb(0, 0, 255);
        } else {
          state.rgb(255, 0, 0);
        }

        state.populate(stateData);

        lightID.map((light) => api.lights.setLightState(light, state));
      }
    }
  }
}

module.exports = {
  changeLightColor,
  TriggerLightsOnEvent,
};
