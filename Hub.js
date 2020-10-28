const v3 = require('node-hue-api').v3;

module.exports = class Hub {
  static async create(config) {
    return new Hub(await v3.api.createLocal(config.ipAddress).connect(config.username));
  };

  /**
   * 
   * @param {import('node-hue-api/lib/api/Api')} hub 
   */
  constructor(hub) {
    this.hub = hub;
  }

  async getGroupScenes(){
    const scenes = await this.hub.scenes.getAll();

    return await Promise.all(scenes
      .filter(s => s.type === 'GroupScene')
      .map(async s => [s.name, s.group, (await this.hub.groups.getGroup(s.group)).state.all_on]));
  }

  async getRooms(){
    const groups = await this.hub.groups.getRooms();

    return groups
      .map(g => [g.name, g.state]);
  }

  async listScenes() {
    const scenes = await this.hub.scenes.getAll();
    return scenes
      .sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
      .map(s => s.name)
      .filter((e, i, c) => c.indexOf(e) === i);
  }

  async activateScene(name, onlyIfOn=false) {
    const scenes = await this.hub.scenes.getAll();
    const targetScenes = scenes.filter(s => s.name === name);

    await Promise.all(targetScenes
      .map(async scene => {
        if(onlyIfOn){
          const group = await this.hub.groups.getGroup(scene.group);
          if(group.state.all_on){
            await this.hub.scenes.activateScene(scene);
          }
        }else{
          await this.hub.scenes.activateScene(scene);
        }
      }));
  }

  async allOn() {
    const groups = await this.hub.groups.getAll();
    await Promise.all(groups.map(group => this.hub.groups.setGroupState(group, { on: true })));
  }

  async allOff() {
    const groups = await this.hub.groups.getAll();
    await Promise.all(groups.map(group => this.hub.groups.setGroupState(group, { on: false })));
  }

  async wakeUpInMorning(sleep) {
    const weekdayBeedroom = 1;
    const weekendBedroom = 3;
    const weekdayHallway = 8;
    const status = sleep ? 'enabled' : 'disabled';
    await this.hub.updateSchedule(weekdayBeedroom, { status });
    await this.hub.updateSchedule(weekendBedroom, { status });
    await this.hub.updateSchedule(weekdayHallway, { status });
  }
}
