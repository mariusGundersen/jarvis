const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');

const backend = require('./backend');
const frontend = require('./frontend');

const router = new Router();

router.get('/', async function(ctx){
  ctx.type = 'html';
  ctx.body = frontend.index();
});

router.get('/scene', async function(ctx){
  ctx.body = await backend.listScenes();
});

router.post('/scene/:name', async function(ctx){
  await backend.activateScene(ctx.params.name);
  ctx.body = {
    success: true
  };
});

router.post('/awake', async function(ctx){
  await backend.wakeUp();
});

router.post('/sleep', async function(ctx){
  await backend.fallAsleep();
});

backend.start().then(function(){
  const app = new Koa();
  app.use(serve('./static'));
  app.use(router.routes());
  app.listen(3000);
  console.log('listening on port 3000');
}).catch(e => console.error(e));