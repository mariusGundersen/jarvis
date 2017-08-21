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
  fetch('/awake', {
    method: 'POST'
  });
}, false);