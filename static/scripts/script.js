let cancelSleep = null;
for(const button of document.querySelectorAll('button[data-id]')){
  button.addEventListener('click', async e => {
    const scene = button.getAttribute('data-id');
    if(cancelSleep) cancelSleep();
    await setStatus(
      scene === 'Leave' ? 'outside' :
      scene === 'Sleep' ? 'sleep' :
      'home');
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
  await post(`/setStatus/${status}`);
}

async function setScene(name){
  await post(`/scene/${name}`);
}

async function refreshMeteogram() {
  meteogramElm.src = 'weather.png?v='+Date.now();
};

meteogramElm.addEventListener('click', refreshMeteogram);

let clockInerval = setInterval(updateClock, 500);

document.addEventListener('mousedown', async e => {
  if(await getJson('/screen') === false){
    await post('/screen/on');
    await updateBikes();
    refreshMeteogram();
    clockInerval = setInterval(updateClock, 500);
  }

  clearTimeout(screenOffTimeout);
  screenOffTimeout = setTimeout(screenOff, 1000*60);

  if (!document.mozFullScreenElement) {
    document.documentElement.mozRequestFullScreen();
  }
}, false);

let screenOffTimeout = setTimeout(screenOff, 1000*60);

mapElm.addEventListener('click', updateBikes);

updateBikes();

async function screenOff(){
  await post('/screen/off');
  clearInterval(clockInerval);
}

function updateClock(){
  timeElm.innerHTML = formatDate(new Date());
}

async function updateBikes(){
  const result = await getJson('/bikes');
  const map = new Map(result.map(r => [r.id.toString(), r.availability]));
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

function post(path){
  return fetch(path, {
    method: 'POST'
  });
}

function getJson(path){
  return fetch(path).then(r => r.json());
}

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

function formatDate(date){
  return `${fix(date.getHours())}:${fix(date.getMinutes())}:${fix(date.getSeconds())}`;
}

function fix(number){
  if(number > 9) return number;
  return '0'+number;
}