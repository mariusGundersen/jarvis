const { promises: fs } = require('fs');

module.exports = class Screen {
  constructor({ dummy = false } = { dummy: false }) {
    if (dummy) {
      this.dummmyValue = true;
    }
  }

  async get() {
    if (!this.bgLed) {
      return this.dummmyValue;
    }

    return this.bgLed.direction() == 'out';
  }

  async on() {
    console.log('turn on screen');
    await fs.writeFile('/sys/class/backlight/rpi_backlight/bl_power', '0', 'ascii');
  }

  async off() {
    console.log('turn off screen');
    await fs.writeFile('/sys/class/backlight/rpi_backlight/bl_power', '1', 'ascii');
  }
};

function logError(e) {
  console.error(e);
}