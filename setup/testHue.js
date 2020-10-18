const Hue = require('../Hub');
const config = require('../config.json');

Hue.create(config.hue).then(async hub => {
  console.log('created');
  const scenes = await hub.listScenes();
  console.log(scenes);
  console.log('activate scene...');
  await hub.activateScene('Relax');
  console.log('...activate scene');
  console.log('all off...')
  await hub.allOff();
  console.log('...all off');
  console.log('all on...');
  await hub.allOn();
  console.log('...all on');
})