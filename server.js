const HueApi = require('node-hue-api').HueApi;
const Koa = require('koa');
const Router = require('koa-router');

const config = require('./.philips-hue.json');
const api = require('./api.js');

const hub = new HueApi(config.bridge, config.username);

const app = new Koa();

const router = new Router();

const style = `
* {
  margin: 0;
  padding: 0;
}

body {
  display: flex;
  flex-direction: column;
  background: black;
}

#scenes {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 25px;
}

#scenes .scene {
  display: block;
  flex: 1 0 auto;
  text-align: center;
  padding: 25px;
  background: #223;
  border: none;
  color: #777;
  font-weight: bold;
}

#meteogram-wrapper {
  display: flex;
  justify-content: center;
}
`;

const script = `
for(const button of document.querySelectorAll('button[data-id]')){
  button.addEventListener('click', e => {
    fetch('/scene/'+button.getAttribute('data-id'), {
      method: 'POST'
    });
  });
}

function refreshMeteogram() {
  document.querySelector('#meteogram').src = 'https://www.yr.no/place/Norway/Oslo/Oslo/Oslo/meteogram.png?time='+Date.now();
  setTimeout(refreshMeteogram, 10000);
};

refreshMeteogram();
`;

router.get('/', async function(ctx){
  const scenes = [
    {
      name: 'Off',
      background: '#223'
    },
    {
      name: 'Nightlight',
      background: '#4e2c0b'
    },
    {
      name: 'Relax',
      background: '#e3bc18'
    },
    {
      name: 'Bright',
      background: '#ffff00'
    }
  ];
  ctx.type = 'html';
  ctx.body = template`<!doctype html>
  <html>
    <head>
      <style>
        ${style}
      </style>
    </head>
    <body>
      <div id="scenes">
        ${scenes.map(sceneButton)}
      </div>
      <div id="meteogram-wrapper">
        <img id="meteogram" src="https://www.yr.no/place/Norway/Oslo/Oslo/Oslo/meteogram.png" />
      </div>
      <script>
        ${script}
      </script>
    </body>
  </html>`;
});

router.get('/scene', async function(ctx){
  const scenes = await api.listScenes(hub);
  ctx.body = scenes;
});

router.post('/scene/:name', async function(ctx){
  await api.activateScene(hub, ctx.params.name);
  ctx.body = {
    success: true
  };
});

app.use(router.routes());

app.listen(3000);

function sceneButton(scene){
  return template`
  <button class="scene" data-id="${scene.name}" style="background: ${scene.background}">${scene.name}</button>
  `
}

function template(strings, ...objects){
  return String.raw(strings, ...objects.map(o => Array.isArray(o) ? o.join('') : o))
}