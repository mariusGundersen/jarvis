import Clock from './Clock.js';
import Lights from './Lights.js';
import Meteogram from './Meteogram.js';
import Screen from './Screen.js';

// window.onerror = () => document.location.reload();

const clock = new Clock(document.querySelector('#clock'));
const lights = new Lights(document.querySelector('#scenes'));
const screen = new Screen();
const meteogram = new Meteogram(document.querySelector('#weather'));

meteogram.load();

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
    meteogram.load();
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

