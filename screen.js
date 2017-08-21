const GpioPin = require('gpio-promise');

module.exports = {
  wakeUp,
  fallAsleep
};

let sleepTimeout = setTimeout(fallAsleep, 1000*60);
const bgLed = new GpioPin(362);

async function wakeUp(){
  console.log('wake up');
  await bgLed.out().catch(logError);
  await bgLed.low().catch(logError);
  clearTimeout(sleepTimeout);
  sleepTimeout = setTimeout(fallAsleep, 1000*60);
}

async function fallAsleep(){
  console.log('fall asleep');
  await bgLed.in().catch(logError);
}

function logError(e){
  console.error(e);
}