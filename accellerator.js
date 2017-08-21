const mma8452q = require('mma8452q');

mma8452q.initialize(() => {
  console.log(mma8452q.getAcceleration());
});
