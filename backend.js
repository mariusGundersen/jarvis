const config = require('./.philips-hue.json');
const Hub = require('./Hub.js');

const screen = require('./screen.js');
const accelerometer = require('./accelerometer.js');

const hub = new Hub(config);
let lastTouchAt = Date.now();

exports.start = async function(){
  await accelerometer.start(async () => {
    if(Date.now() - lastTouchAt > 1000*60){
      await hub.activateScene('Bright');
    }
    await delay(1000);
  }).catch(r => console.error(r));
}

exports.wakeUp = async function(){
  await screen.wakeUp();
  lastTouchAt = Date.now();
}

exports.fallAsleep = async function(){
  await screen.fallAsleep();
}

exports.activateScene = async function(name){
  await hub.activateScene(name);
}

exports.listScenes = async function(){
  return await hub.listScenes();
}

function delay(ms){
  return new Promise(res => setTimeout(res, ms));
}