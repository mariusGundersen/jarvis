const GpioPin = require('./Gpio');

module.exports = class Screen{
  constructor({dummy = false} = {dummy: false}){
    if(dummy) return;
    this.bgLed = new GpioPin(362, 'out');
  }

  async wakeUp(){
    console.log('wake up');
    if(!this.bgLed) return;
    await this.bgLed.out().catch(logError);
    await this.bgLed.low().catch(logError);
  }

  async fallAsleep(){
    console.log('fall asleep');
    if(!this.bgLed) return;
    await this.bgLed.in().catch(logError);
  }
};

function logError(e){
  console.error(e);
}