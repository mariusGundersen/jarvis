let cancelSleep = null;
for(const button of document.querySelectorAll('button[data-id]')){
  button.addEventListener('click', async e => {
    const scene = button.getAttribute('data-id');
    if(cancelSleep) cancelSleep();
    await setStatus(scene === 'Leave' ? 'outside' : 'home');
    if(scene === 'Sleep' || scene === 'Leave'){
      await setScene('Nightlight');
      await delay(60*1000, token => cancelSleep = token);
      await setScene('Off');
    }else{
      await setScene(scene);
    }
  });
}

async function setStatus(status){
  await fetch(`/setStatus/${status}`, {
    method: 'POST'
  })
}

async function setScene(name){
  await fetch(`/scene/${name}`, {
    method: 'POST'
  });
}

let requestCounter = 0;

async function refreshMeteogram() {
  requestCounter++;
  const result = await fetch('https://www.yr.no/sted/Norge/Oslo/Oslo/Oslo/meteogram.png?v?'+requestCounter, {cache: 'no-store'});
  const blob = await result.blob();
  document.querySelector('#meteogram').src = URL.createObjectURL(blob);
};

document.querySelector('#meteogram').addEventListener('click', refreshMeteogram);

refreshMeteogram();

let isAsleep = false;

document.addEventListener('mousedown', e => {
  if (!document.mozFullScreenElement) {
    document.documentElement.mozRequestFullScreen();
  }

  if(isAsleep){
    updateBikes();
    refreshMeteogram();
    fetch('/awake', {
      method: 'POST'
    });
  }
  clearTimeout(sleepy);
  isAsleep = false;
  sleepy = setTimeout(fallAsleep, 1000*60);
}, false);

let sleepy = setTimeout(fallAsleep, 1000*60);

function fallAsleep(){
  isAsleep = true;
  fetch('/sleep', {
    method: 'POST'
  });
}

async function updateBikes(){
  const result = await fetch('/bikes');
  const racks = await result.json();
  const map = new Map(racks.map(r => [r.id.toString(), r.availability]));
  for(const rack of document.querySelectorAll('.bike-text')){
    const availability = map.get(rack.getAttribute('data-id'));
    rack.textContent = availability.bikes;
  }
  for(const rack of document.querySelectorAll('.bike-circle')){
    const availability = map.get(rack.getAttribute('data-id'));
    const percentage = availability.bikes < 7
      ? availability.bikes/7*0.9
      : 0.9 + 0.1*(1 - 1/(availability.bikes - 6));
    rack.style.fill = fade(percentage);
  }
}

document.querySelector('#map').addEventListener('click', updateBikes);

updateBikes();

function fade(percentage){
  return percentageToHsl(percentage, 0, 120);
}

function percentageToHsl(percentage, hue0, hue1) {
  var hue = (percentage * (hue1 - hue0)) + hue0;
  return 'hsl(' + hue + ', 100%, 50%)';
}

async function delay(ms, setToken = () => {}){
  return new Promise(res => {
    const timeout = setTimeout(res, ms);
    setToken(() => clearTimeout(timeout));
  });
}