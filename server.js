const HueApi = require('node-hue-api').HueApi;
const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');
const GpioPin = require('gpio-promise');

const config = require('./.philips-hue.json');
const api = require('./api.js');

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
      <link rel="stylesheet" href="/static/style.css" />
    </head>
    <body>
      <div id="scenes">
        ${scenes.map(sceneButton)}
      </div>
      <div id="meteogram-wrapper">
        <img id="meteogram" src="https://www.yr.no/place/Norway/Oslo/Oslo/Oslo/meteogram.png" />
      </div>
      <script src="/static/script.js"></script>
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

let sleepTimeout = setTimeout(fallAsleep, 1000*60);
router.post('/awake', async function(ctx){
  await wakeUp();
  clearTimeout(sleepTimeout);
  sleepTimeout = setTimeout(fallAsleep, 1000*60);
})

app.use(serve('./static'));
app.use(router.routes());

app.listen(3000);

const bgLed = new GpioPin(362);
async function wakeUp(){
  await bgLed.out();
  await bgLed.low();
}

async function fallAsleep(){
  await bgLed.in();
}

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
