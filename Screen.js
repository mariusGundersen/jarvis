const GpioPin = require('./Gpio');

module.exports = class Screen{
  constructor({dummy = false} = {dummy: false}){
    if(dummy) {
      this.dummmyValue = true;
      return;
    }
    this.bgLed = new GpioPin(362, 'out');
  }

  async get(){
    if(!this.bgLed) {
      return this.dummmyValue;
    }

    return this.bgLed.direction() == 'out';
  }

  async on(){
    console.log('turn on screen');
    if(!this.bgLed) {
      this.dummmyValue = true;
      return;
    }

    await this.bgLed.out().catch(logError);
    await this.bgLed.low().catch(logError);
  }

  async off(){
    console.log('turn off screen');
    if(!this.bgLed) {
      this.dummmyValue = false;
      return;
    }

    await this.bgLed.in().catch(logError);
  }
};

function logError(e){
  console.error(e);
}