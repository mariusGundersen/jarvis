const HueApi = require('node-hue-api').HueApi;

module.exports = class Hub{
  constructor(config){
    this.hub = new HueApi(config.bridge, config.username);
  }

  async listScenes(){
    const scenes = await this.hub.scenes();
    return scenes
      .sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
      .map(s => s.name)
      .filter((e, i, c) => c.indexOf(e) === i);
  }

  async activateScene(name){
    const scenes = await this.hub.scenes();
    for(const scene of scenes.filter(scene => scene.name == name)){
      await this.hub.activateScene(scene.id);
    }
  }

  async allOn(){
    const lights = await this.hub.getLights();
    console.log(lights);
    for(const light in lights){
      this.hub.light(light).on();
    }
  }

  async allOff(){
    const lights = await this.hub.getLights();
    console.log(lights);
    for(const light in lights){
      this.hub.light(light).off();
    }
  }

  async setStatus(status){
    const schedules = await this.hub.getSchedules();
    console.log(schedules);
  }
}
