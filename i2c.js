const i2c = require('i2c');
const address = 0x18;
const wire = new i2c(address, {device: '/dev/i2c-1'}); // point to your i2c address, debug provides REPL interface

wire.scan(function(err, data) {
  // result contains an array of addresses
  console.log(err, data);
});