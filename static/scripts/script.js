import Clock from './Clock.js';
import Weather from './Weather.js';
import BikeMap from './BikeMap.js';
import Lights from './Lights.js';
import Screen from './Screen.js';

// window.onerror = () => document.location.reload();

const clock = new Clock(document.querySelector('#clock'));
const weather = new Weather(document.querySelector('#meteogram'));
const bikeMap = new BikeMap(document.querySelector('#map'));
const lights = new Lights(document.querySelector('#scenes'));
const screen = new Screen();

for (const button of document.querySelectorAll('button[data-id]')) {
  button.addEventListener('click', async e => {
    const name = button.getAttribute('data-id');
    lights.setState(name);
    lights.clearDelay();
    switch (name) {
      case 'Leave':
        return await leaveHome();
      case 'Sleep':
        return await goToBed();
      default:
        return await setLights(name);
    }
  });
}

document.addEventListener('mousedown', async e => {
  clock.enable();
  if (await screen.isOff()) {
    await screen.turnOn();
    await bikeMap.update();
    weather.refresh();
  }

  await screen.delay();
  await screen.turnOff();
  clock.disable();
}, false);

async function goToBed() {
  clock.setMessage('Sov godt &#x1F634;');
  await lights.setScene('Nightlight');
  await lights.delay();
  await lights.setScene('Off');
  await lights.setStatus('sleep');
  clock.setMessage('&nbsp;');
}

async function leaveHome() {
  clock.setMessage('Ha det bra &#x1F44B;');
  await lights.setScene('Nightlight');
  await lights.delay();
  await lights.setScene('Off');
  await lights.setStatus('outside');
  clock.setMessage('&nbsp;');
}

async function setLights(name) {
  clock.setMessage('&nbsp;');
  await lights.setScene(name);
  await lights.setStatus('home');
}

