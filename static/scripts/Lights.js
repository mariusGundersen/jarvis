import { Delayer, post, template } from './util.js';

export default class Lights {
  constructor(element) {
    this.element = element;
    this.element.innerHTML = scenes.map(sceneButton).join('');
    this.delayer = new Delayer(60 * 1000);
  }

  setState(state) {
    this.state = state;
    for (const button of document.querySelectorAll('button[data-id]')) {
      const name = button.getAttribute('data-id');
      button.setAttribute('data-active', state == name);
    }
  }

  async delay() {
    await this.delayer.delay();
  }

  async clearDelay() {
    this.delayer.clearDelay();
  }

  async setStatus(status) {
    await post(`/setStatus/${status}`);
  }

  async setDarkerScene(name) {
    await post(`/scene/${name}/only-if-on`);
  }

  async setScene(name) {
    await post(`/scene/${name}`);
  }
}

const scenes = [
  {
    name: 'Relax',
    icon: 'flaticon-living-room'
  },
  {
    name: 'Sleep',
    icon: 'flaticon-bed'
  },
  {
    name: 'Nightlight',
    icon: 'flaticon-moon'
  },
  {
    name: 'Leave',
    icon: 'flaticon-door'
  },
  {
    name: 'Off',
    icon: 'flaticon-turned-off'
  },
];

const sceneButton = (scene) => template`
<button
  class="scene"
  data-id="${scene.name}"
  style="
    color: white
  ">
    <i class="${scene.icon}"></i>
</button>`;
