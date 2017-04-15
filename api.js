
module.exports = {
  allOn,
  allOff,
  listScenes,
  activateScene
}

async function listScenes(hub){
  const scenes = await hub.scenes();
  return scenes
    .sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
    .map(s => s.name)
    .filter((e, i, c) => c.indexOf(e) === i);
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