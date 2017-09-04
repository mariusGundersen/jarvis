const GpioPin = require('gpio-promise');
const i2c = require('./i2c.js');

const interrupt = new GpioPin(71); //pin 11


exports.start = function(onMotion){
  i2c.initialize().then(async () => {
    await i2c.getInterrupt();
    await interrupt.in();
    interrupt.on('rising-edge', async function(value) {
      if(value){
        await onMotion();
        console.log('change', value, (await i2c.getInterrupt()).toString(16));
      }
   });
  }).catch(r => console.error(r));
}