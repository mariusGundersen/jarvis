const {promisify} = require('util');
const onoff = require('onoff');

module.exports = class Gpio extends onoff.Gpio{
  constructor(...args){
    super(...args);

    this.read = promisify(super.read);
    this.write = promisify(super.write);
  }

  async out(){
    this.setDirection('out');
  }

  async in(){
    this.setDirection('in');
  }
}