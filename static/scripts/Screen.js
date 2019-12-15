import { post, getJson, Delayer } from "./util.js";


export default class Screen {
  constructor() {
    this.delayer = new Delayer(60 * 1000);
  }

  async delay() {
    await this.delayer.delay();
  }

  async isOn() {
    return await getJson('/screen');
  }

  async isOff() {
    return await this.isOn() === false;
  }

  async turnOn() {
    await post('/screen/on');
  }

  async turnOff() {
    await post('/screen/off');
  }
}