const config = require('./config.json');
const Hub = require('./Hub.js');
const Bikes = require('./Bikes.js');

const Screen = require('./Screen.js');
const Accelerometer = require('./Accelerometer.js');

const debug = process.env.DEBUG == "true" ? {dummy:true} : undefined;

const screen = new Screen(debug);
const accelerometer = new Accelerometer(debug);
const hub = new Hub(config.hue);
const bikes = new Bikes(config.bikes['api-key']);
let lastTouchAt = Date.now();
let isOutside = false;

exports.start = async function(){
  await accelerometer.start(async () => {
    if(Date.now() - lastTouchAt > 1000*60 && isOutside){
      await hub.activateScene('Relax');
      isOutside = false;
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

exports.setStatus = async function(status){
  isOutside = status === 'outside';
  await hub.setStatus(status);
}

exports.listScenes = async function(){
  return await hub.listScenes();
}

exports.getBikeStatus = async function(){
  return await bikes.getStatus();
}

function delay(ms){
  return new Promise(res => setTimeout(res, ms));
}