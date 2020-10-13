const Gpio = require('../Gpio.js');

const pin = new Gpio(4, 'in', 'none');


async function run() {
  while (true) {
    console.log(await pin.read());
  }
}

run();