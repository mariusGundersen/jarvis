const GpioPin = require('gpio-promise');
const i2c = require('./i2c.js');

const interruptPin = new GpioPin(233); //pin 13

exports.start = async function start(onMotion){
  await i2c.initialize();
  await new Promise(res => interruptPin.export(res));
  await interruptPin.in();
  console.log('setup interrupt');
  await i2c.getInterrupt();
  interruptPin.on('rising-edge', async function(value) {
    console.log('rising-edge', value);
    if(value){
      await onMotion().catch(e => console.warn(e));
      console.log('change', value, (await i2c.getInterrupt()).toString(16));
    }
  });
  const r = await i2c.getInterrupt();
  console.log('on rising edge', r);
}.catch(r => console.error(r));

//exports.start();