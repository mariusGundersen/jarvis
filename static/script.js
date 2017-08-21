for(const button of document.querySelectorAll('button[data-id]')){
  button.addEventListener('click', e => {
    fetch('/scene/'+button.getAttribute('data-id'), {
      method: 'POST'
    });
  });
}

function refreshMeteogram() {
  document.querySelector('#meteogram').src = 'https://www.yr.no/sted/Norge/Oslo/Oslo/Oslo/meteogram.png?time='+Date.now();
  setTimeout(refreshMeteogram, 10000);
};

refreshMeteogram();

document.addEventListener('mousedown', e => {
  fetch('/awake', {
    method: 'POST'
  });
}, false);