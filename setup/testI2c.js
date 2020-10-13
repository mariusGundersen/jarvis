const i2c = require('../i2c.js');

i2c.initialize().then(async () => {
  while (true) {
    const accel = await i2c.getAcceleration();
    console.log(accel);
  }
})