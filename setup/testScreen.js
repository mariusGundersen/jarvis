const Screen = require('../Screen.js')

Promise.resolve().then(async () => {
  const screen = new Screen();

  const status = await screen.get();
  console.log('status', status);

  if (status) {
    await screen.off();
  } else {
    await screen.on();
  }
});