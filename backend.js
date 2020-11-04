const config = require('./config.json');
const Hub = require('./Hub.js');

const Screen = require('./Screen.js');
const Accelerometer = require('./Accelerometer.js');

exports.start = async function (debug) {
  console.log('backend started');

  const screen = new Screen(debug);
  const accelerometer = new Accelerometer(debug);

  let isOutside = false;

  const hub = await Hub.create(config.hue);

  accelerometer.start({
    async onMotion() {
      if (isOutside) {
        isOutside = false;
        await hub.activateScene('Relax');
      }

      await delay(1000);
    }
  }).catch(r => console.error(r));

  return {
    async getScreen() {
      return await screen.get();
    },

    async setScreen(on) {
      if (on) {
        await screen.on();
      } else {
        await screen.off();
      }
    },

    async activateScene(name, onlyIfOn = false) {
      await hub.activateScene(name, onlyIfOn);
    },

    async setStatus(status) {
      isOutside = status === 'outside';
      if (isOutside) {
        console.log('Turn on ligts next time the door opens');
      } else {
        console.log('disabled door sensor');
      }

      await hub.wakeUpInMorning(status === 'sleep');
    },

    async listScenes() {
      return await hub.listScenes();
    }
  }
}


function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}