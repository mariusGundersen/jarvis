const GpioPin = require('gpio-promise');
const i2c = require('./i2c.js');

const interrupt = new GpioPin(71); //pin 11

i2c.initialize().then(async () => {
  interrupt.on('change', function(value) {
    console.log('change', value);
 });
}).catch(r => console.error(r));
