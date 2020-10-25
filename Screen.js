const { promises: fs } = require('fs');

module.exports = class Screen {
  constructor({ dummy = false } = { dummy: false }) {
    if (dummy) {
      this.dummmyValue = true;
    }
  }

  async get() {
    if (this.dummmyValue !== undefined) return this.dummmyValue;
    const result = await fs.readFile('/sys/class/backlight/rpi_backlight/bl_power', 'ascii');
    return result.includes('0');
  }

  /**
   * 
   * @param {boolean} value 
   */
  async set(value) {
    if (this.dummmyValue !== undefined) {
      this.dummmyValue = value
    } else {
      await fs.writeFile('/sys/class/backlight/rpi_backlight/bl_power', value ? '0\n' : '1\n', 'ascii');
    }
  }

  async on() {
    console.log('turn on screen');
    this.set(true);
  }

  async off() {
    console.log('turn off screen');
    this.set(false);
  }
};
