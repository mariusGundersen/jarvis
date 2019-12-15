import Clock from './Clock.js';
import Weather from './Weather.js';
import BikeMap from './BikeMap.js';
import Lights from './Lights.js';
import { delay, post, getJson } from './util.js';

// window.onerror = () => document.location.reload();

const clock = new Clock(document.querySelector('#clock'));
const weather = new Weather(document.querySelector('#meteogram'));
const bikeMap = new BikeMap(document.querySelector('#map'));
const lights = new Lights(document.querySelector('#scenes'));

for (const button of document.querySelectorAll('button[data-id]')) {
  button.addEventListener('click', async e => {
    const scene = button.getAttribute('data-id');
    lights.setScene(scene);
    switch (scene) {
      case 'Leave':
        clock.setMessage('Ha det bra &#x1F44B;');
        await fadeOff();
        if (lights.scene !== scene) return;
        await setStatus('outside');
        clock.setMessage('&nbsp;');
      case 'Sleep':
        clock.setMessage('Sov godt &#x1F634;')
        await fadeOff();
        if (lights.scene !== scene) return;
        await setStatus('sleep');
        clock.setMessage('&nbsp;');
      default:
        clock.setMessage('&nbsp;');
        await setScene(scene);
        await setStatus('home');
    }
  });
}

async function fadeOff() {
  await setScene('Nightlight');
  await delay(60 * 1000);
  await setScene('Off');
}

async function setStatus(status) {
  await post(`/setStatus/${status}`);
}

async function setScene(name) {
  await post(`/scene/${name}`);
}

document.addEventListener('mousedown', async e => {
  clock.enable();
  if (await getJson('/screen') === false) {
    await post('/screen/on');
    await bikeMap.update();
    weather.refresh();
  }

  clearTimeout(screenOffTimeout);
  screenOffTimeout = setTimeout(screenOff, 1000 * 60);

  if (!document.mozFullScreenElement) {
    document.documentElement.mozRequestFullScreen();
  }
}, false);

let screenOffTimeout = setTimeout(screenOff, 1000 * 60);

async function screenOff() {
  await post('/screen/off');
  clock.disable();
}
