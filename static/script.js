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
  setTimeout(refreshMeteogram, 10000);
};

refreshMeteogram();

document.addEventListener('mousedown', e => {
  clearTimeout(sleepy);
  sleepy = setTimeout(fallAsleep, 1000*60);
  fetch('/awake', {
    method: 'POST'
  });
}, false);

let sleepy = setTimeout(fallAsleep, 1000*60);

function fallAsleep(){
  fetch('/sleep', {
    method: 'POST'
  });
}