const config = require('./config.json');
const Hub = require('./Hub.js');

const Screen = require('./Screen.js');
const Accelerometer = require('./Accelerometer.js');

const debug = process.env.DEBUG == "true" ? { dummy: true } : undefined;

const screen = new Screen(debug);
const accelerometer = new Accelerometer(debug);
const hub = new Hub(config.hue);

let isOutside = false;

exports.start = async function () {
  await accelerometer.start({
    async onMotion() {
      if (isOutside) {
        await hub.activateScene('Relax');
        isOutside = false;
      }

      await delay(1000);
    }
  }).catch(r => console.error(r));
}

exports.getScreen = async function () {
  return await screen.get();
}

exports.setScreen = async function (on) {
  if (on) {
    await screen.on();
  } else {
    await screen.off();
  }
}

exports.activateScene = async function (name) {
  await hub.activateScene(name);
}

exports.setStatus = async function (status) {
  isOutside = status === 'outside';
  await hub.wakeUpInMorning(status === 'sleep');
}

exports.listScenes = async function () {
  return await hub.listScenes();
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}