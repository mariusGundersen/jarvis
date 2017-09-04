const GpioPin = require('onoff').Gpio;
const i2c = require('./i2c.js');

const interrupt = new GpioPin(71, 'in', 'rising'); //pin 11

i2c.initialize().then(async () => {
  interrupt.watch((err, value) => {
    console.write(err, value);
  })
}).catch(r => console.error(r));
