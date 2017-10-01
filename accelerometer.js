const GpioPin = require('gpio-promise');
const i2c = require('./i2c.js');

const interrupt = new GpioPin(71); //pin 11
interrupt.export(e => console.log(e));

exports.start = function start(onMotion){
  i2c.initialize().then(async () => {
    console.log('setup interrupt');
    await i2c.getInterrupt();
    await interrupt.in();
    interrupt.on('rising-edge', async function(value) {
      console.log('rising-edge', value);
      if(value){
        await onMotion().catch(e => console.warn(e));
        console.log('change', value, (await i2c.getInterrupt()).toString(16));
      }
    });
    const r = await i2c.getInterrupt();
    console.log('on rising edge', r);
  }).catch(r => console.error(r));
}

//exports.start();