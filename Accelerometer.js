const GpioPin = require('./Gpio');
const i2c = require('./i2c.js');

module.exports = class Accelerometer {
  constructor({ dummy = false, pin = 4 } = {}) {
    if (dummy) return;
    this.interruptPin = new GpioPin(pin, 'in', 'rising'); //pin 13
  }

  async start({ onMotion }) {
    if (!this.interruptPin) return;
    await i2c.initialize();
    console.log('setup interrupt');
    await i2c.resetInterrupt();
    this.interruptPin.watch(async function (err, value) {
      console.log('rising-edge', value);
      const accel = await i2c.getAcceleration();
      console.log('accel', accel);
      await onMotion().catch(e => console.warn(e));
      console.log('change', value, (await i2c.resetInterrupt()).toString(16));
    });
    const r = await i2c.resetInterrupt();
    console.log('on rising edge', r.toString(16));
  }
};

//exports.start();