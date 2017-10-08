for(const button of document.querySelectorAll('button[data-id]')){
  button.addEventListener('click', e => {
    fetch('/scene/'+button.getAttribute('data-id'), {
      method: 'POST'
    });
  });
}

async function refreshMeteogram() {
  const result = await fetch('https://www.yr.no/sted/Norge/Oslo/Oslo/Oslo/meteogram.png', {cache: 'reload'});
  const blob = await result.blob();
  document.querySelector('#meteogram').src = URL.createObjectURL(blob);
  setTimeout(refreshMeteogram, 1000*60*15);
};

refreshMeteogram();

let isAsleep = false;

document.addEventListener('mousedown', e => {
  if(isAsleep){
    updateBikes();
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
    rack.style.fill = fade(availability.bikes/7);
  }
}

updateBikes();

function fade(percentage){
  return percentageToHsl(percentage, 0, 120);
}

function percentageToHsl(percentage, hue0, hue1) {
  var hue = (percentage * (hue1 - hue0)) + hue0;
  return 'hsl(' + hue + ', 100%, 50%)';
}