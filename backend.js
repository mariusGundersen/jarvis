const config = require('./config.json');
const Hub = require('./Hub.js');

const Screen = require('./Screen.js');
const Accelerometer = require('./Accelerometer.js');

const debug = process.env.DEBUG == "true" ? { dummy: true } : undefined;

const screen = new Screen({ dummy: true });
const accelerometer = new Accelerometer(debug);
let hub;

let isOutside = false;

exports.start = async function () {
  console.log('backend started');
  hub = await Hub.create(config.hue);
  await accelerometer.start({
    async onMotion() {
      if (isOutside) {
        isOutside = false;
        await hub.activateScene('Relax');
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