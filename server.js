const HueApi = require('node-hue-api').HueApi;
const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');

const config = require('./.philips-hue.json');
const api = require('./api.js');
const screen = require('./screen.js');
const accelerometer = require('./accelerometer.js');

const hub = new HueApi(config.bridge, config.username);

const app = new Koa();

const router = new Router();

router.get('/', async function(ctx){
  const scenes = [
    {
      name: 'Off',
      background: '#223',
      color: 'white'
    },
    {
      name: 'Nightlight',
      background: '#4e2c0b',
      color: 'white'
    },
    {
      name: 'Relax',
      background: '#e3bc18',
      color: 'black'
    },
    {
      name: 'Bright',
      background: '#ffff00',
      color: 'black'
    }
  ];
  ctx.type = 'html';
  ctx.body = template`<!doctype html>
  <html>
    <head>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div id="scenes">
        ${scenes.map(sceneButton)}
      </div>
      <div id="meteogram-wrapper">
        <img id="meteogram" src="https://www.yr.no/place/Norway/Oslo/Oslo/Oslo/meteogram.png" />
      </div>
      <script src="/script.js"></script>
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

router.post('/awake', async function(ctx){
  await screen.wakeUp();
})

app.use(serve('./static'));
app.use(router.routes());

app.listen(3000);
console.log('listening on port 3000');

accelerometer.start(async function(){
  await screen.wakeUp();
  await api.allOn(hub);
})

function sceneButton(scene){
  return template`
  <button
    class="scene"
    data-id="${scene.name}"
    style="
      background: ${scene.background};
      color: ${scene.color}
    ">
      ${scene.name}
    </button>
  `
}

function template(strings, ...objects){
  return String.raw(strings, ...objects.map(o => Array.isArray(o) ? o.join('') : o))
}
