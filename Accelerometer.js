const GpioPin = require('./Gpio');
const i2c = require('./i2c.js');

module.exports = class Accelerometer{
  constructor({dummy = false} = {dummy: false}){
    if(dummy) return;
    this.interruptPin = new GpioPin(233, 'in', 'rising'); //pin 13
  }

  async start(onMotion){
    if(!this.interruptPin) return;
    await i2c.initialize();
    console.log('setup interrupt');
    await i2c.getInterrupt();
    this.interruptPin.watch(async function(err, value) {
      console.log('rising-edge', value);
      await onMotion().catch(e => console.warn(e));
      console.log('change', value, (await i2c.getInterrupt()).toString(16));
    });
    const r = await i2c.getInterrupt();
    console.log('on rising edge', r);
  }
};

//exports.start();