const GpioPin = require('gpio-promise');

module.exports = {
  wakeUp,
  fallAsleep
};

const bgLed = new GpioPin(362);

async function wakeUp(){
  console.log('wake up');
  await bgLed.out().catch(logError);
  await bgLed.low().catch(logError);
}

async function fallAsleep(){
  console.log('fall asleep');
  await bgLed.in().catch(logError);
}

function logError(e){
  console.error(e);
}