const onoff = require('onoff');

module.exports = class Gpio extends onoff.Gpio {
  async out() {
    this.setDirection('out');
  }

  async in() {
    this.setDirection('in');
  }

  async low() {
    await this.write(0);
  }

  async high() {
    await this.write(1);
  }
}