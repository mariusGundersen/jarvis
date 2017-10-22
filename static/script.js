let cancelSleep = null;
for(const button of document.querySelectorAll('button[data-id]')){
  button.addEventListener('click', async e => {
    const scene = button.getAttribute('data-id');
    if(cancelSleep) cancelSleep();
    if(scene === 'Sleep'){
      await setScene('Nightlight');
      let time = 60;
      button.textContent = time;
      const sleepIntval = setInterval(async () => {
        time--;
        button.textContent = time;
        if(time === 0){
          await setScene('Sleep');
          cancelSleep();
        }
      }, 1000);
      cancelSleep = () => {
        button.textContent = 'Sleep';
        clearInterval(sleepIntval);
        cancelSleep = null;
      }
    }else{
      await setScene(scene);
    }
  });
}

async function setScene(name){
  await fetch(`/scene/${name}`, {
    method: 'POST'
  });
}

async function refreshMeteogram() {
  const result = await fetch('https://www.yr.no/sted/Norge/Oslo/Oslo/Oslo/meteogram.png', {cache: 'reload'});
  const blob = await result.blob();
  document.querySelector('#meteogram').src = URL.createObjectURL(blob);
};

document.querySelector('#meteogram').addEventListener('click', refreshMeteogram);

refreshMeteogram();

let isAsleep = false;

document.addEventListener('mousedown', e => {
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