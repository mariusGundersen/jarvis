const HueApi = require("node-hue-api").HueApi;
const config = require('./.philips-hue.json');

const hub = new HueApi(config.bridge, config.username);

(async function(){
  const lights = await hub.lights();

  console.log(lights);

  const groups = await hub.groups();

  console.log(groups);

  const scenes = await hub.scenes();

  console.log(scenes.sort((a, b) => a.name < b.name ? 1 : a.name > b.name ? -1 : 0).map(scene => `${scene.name}: ${scene.id}`).join('\n'));

  const result = await off(hub);
  console.log(result);
})();

async function relax(hub){
  return await activateScene(hub, 'Relax')
}

async function off(hub){
  return await activateScene(hub, 'Off');
}

async function nightlight(hub){
  return await activateScene(hub, 'Nightlight');
}

async function activateScene(hub, name){
  const scenes = await hub.scenes();
  for(const scene of scenes.filter(scene => scene.name == name)){
    await hub.activateScene(scene.id);
  }
}

async function allOn(hue){
  const lights = await hue.getLights();
  console.log(lights);
  for(const light in lights){
    hue.light(light).on();
  }
}

async function allOff(hue){
  const lights = await hue.getLights();
  console.log(lights);
  for(const light in lights){
    hue.light(light).off();
  }
}