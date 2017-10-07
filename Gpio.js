const onoff = require('onoff');

module.exports = class Gpio extends onoff.Gpio{
  constructor(...args){
    super(...args);
  }

  async read(){
    return new Promise((res, rej) => super.read((err, val) => err ? rej(err) : res(val)));
  }

  async write(value){
    return new Promise((res, rej) => super.write(value, (err, val) => err ? rej(err) : res(val)));
  }

  async out(){
    this.setDirection('out');
  }

  async in(){
    this.setDirection('in');
  }
}