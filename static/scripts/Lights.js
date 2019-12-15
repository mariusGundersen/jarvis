import { template } from './util.js';

export default class Lights {
  constructor(element) {
    this.element = element;
    this.element.innerHTML = scenes.map(sceneButton).join('');
  }

  setScene(scene) {
    this.scene = scene;
    for (const button of document.querySelectorAll('button[data-id]')) {
      const name = button.getAttribute('data-id');
      button.setAttribute('data-active', scene == name);
    }
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
