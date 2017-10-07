const GpioPin = require('gpio-promise');

module.exports = {
  wakeUp,
  fallAsleep
};

const bgLed = new GpioPin(362);
const init = new Promise(res => bgLed.export(res)).then(bgLed.out());

async function wakeUp(){
  await init;
  console.log('wake up');
  await bgLed.out().catch(logError);
  await bgLed.low().catch(logError);
}

async function fallAsleep(){
  await init;
  console.log('fall asleep');
  await bgLed.in().catch(logError);
}

function logError(e){
  console.error(e);
}