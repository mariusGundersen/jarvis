console.log('started server.js');

const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');

const Backend = require('./backend');
const Bikes = require('./Bikes.js');
const Weather = require('./Weather.js');

const debug = process.env.DEBUG == "true" ? { dummy: true } : undefined;

async function run(){
  const backend = await Backend.start(debug);
  const router = new Router();
  const bikes = new Bikes();
  const weather = new Weather();

  router.get('/scene', async ctx => {
    ctx.body = await backend.listScenes();
  });

  router.post('/scene/:name', async ctx => {
    await backend.activateScene(ctx.params.name);
    ctx.body = {
      success: true
    };
  });

  router.post('/scene/:name/only-if-on', async ctx => {
    await backend.activateScene(ctx.params.name, true);
    ctx.body = {
      success: true
    };
  });

  router.get('/bikes', async ctx => {
    ctx.body = await bikes.getStatus();
  });

  router.get('/weather.png', async ctx => {
    ctx.body = weather.getMeteogram();
  });

  router.get('/weather', async ctx => {
    ctx.body = weather.getXml();
  });

  router.post('/setStatus/:status', async ctx => {
    await backend.setStatus(ctx.params.status);
    ctx.status = 200;
  });

  router.post('/screen/:status', async ctx => {
    await backend.setScreen(ctx.params.status === 'on');
    ctx.status = 200;
  });

  router.get('/screen', async ctx => {
    ctx.body = await backend.getScreen();
  });

  const app = new Koa();
  app.use(serve('./static', { maxage: 0 }));
  app.use(router.routes());
  app.listen(3000);
  console.log('listening on port 3000');
}

run().catch(e => console.error(e));