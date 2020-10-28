const v3 = require('node-hue-api').v3;

module.exports = class Hub {
  static async create(config) {
    return new Hub(await v3.api.createLocal(config.ipAddress).connect(config.username));
  };

  /**
   * 
   * @param {import('node-hue-api/lib/api/index')} hub 
   */
  constructor(hub) {
    this.hub = hub;
  }

  async listScenes() {
    const scenes = await this.hub.scenes.getAll();
    return scenes
      .sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
      .map(s => s.name)
      .filter((e, i, c) => c.indexOf(e) === i);
  }

  async activateScene(name) {
    const scenes = await this.hub.scenes.getAll();
    await Promise.all(scenes
      .filter(scene => scene.name == name)
      .map(scene => this.hub.scenes.activateScene(scene)));
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
