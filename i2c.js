const i2c = require('i2c');
const address = 0x1C

// Sets full-scale range to +/-2, 4, or 8g. Used to calc real g values.
const GSCALE = 2;

// See the many application notes for more info on setting all of these registers:
// http://www.freescale.com/webapp/sps/site/prod_summary.jsp?code=MMA8452Q
// MMA8452 registers
const OUT_X_MSB = 0x01;
const XYZ_DATA_CFG = 0x0E;
const WHO_AM_I = 0x0D;
const CTRL_REG1 = 0x2A;
const FF_MT_CFG = 0x15;
const FF_MT_SRC = 0x16;
const FF_MT_THS = 0x17;
const FF_MT_COUNT = 0x18;
const CTRL_REG3 = 0x2C;
const CTRL_REG4 = 0x2D;

const ELE = 1<<7;
const OAE = 1<<6;
const ZEFE = 1<<5;
const YEFE = 1<<4;
const XEFE = 1<<3;
const DBCNTM = 1<<7;
const WAKE_FF_MT = 1<<3;
const IPOL = 1<<1;
const INT_EN_FF_MT = 1<<2;

const wire = new i2c(address, {device: '/dev/i2c-1'}); // point to your i2c address, debug provides REPL interface

function read_registers(addressToRead, bytesToRead) {
  return new Promise((res, rej) => wire.readBytes(addressToRead, bytesToRead, (err, bytes) => err ? rej(err) : res(bytes)));
}

function read_register(addressToRead) {
  return new Promise((res, rej) => wire.readBytes(addressToRead, 1, (err, bytes) => err ? rej(err) : res(bytes[0])));
}

// Write a single byte to the register.
function write_register(addressToWrite, dataToWrite) {
  return new Promise((res, rej) => wire.writeBytes(addressToWrite, [dataToWrite], (err) => err ? rej(err) : res()));
}

// Sets the MMA8452 to standby mode. It must be in standby to change most register settings
async function mode_standby() {
  const c = await read_register(CTRL_REG1);
  await write_register(CTRL_REG1, c & ~(0x01)); //Clear the active bit to go into standby
}

// Sets the MMA8452 to active mode. Needs to be in this mode to output data
async function mode_active() {
  const c = await read_register(CTRL_REG1);
  await write_register(CTRL_REG1, c | 0x01); //Set the active bit to begin detection
}

async function getAcceleration() {
  const rawData = await read_registers(OUT_X_MSB, 6);  // Read the six raw data registers into data array

  // Loop to calculate 12-bit ADC and g value for each axis
  const out = [];
  for (let i = 0; i < 3 ; i++) {
    let gCount = (rawData[i*2] << 8) | rawData[(i*2)+1];  //Combine the two 8 bit registers into one 12-bit number

    gCount = (gCount >> 4); //The registers are left align, here we right align the 12-bit integer

    // If the number is negative, we have to make it so manually (no 12-bit data type)
    if (rawData[i*2] > 0x7F) {
      gCount = -(1 + 0xFFF - gCount); // Transform into negative 2's complement
    }

    out[i] = gCount / ((1<<12)/(2*GSCALE));
  }
  return out;
}

async function initialize() {
  const c = await read_register(WHO_AM_I);  // Read WHO_AM_I register
  if (c == 0x2A) { // WHO_AM_I should always return 0x2A
    console.log("MMA8452Q is online...");
  } else {
    throw new Error(`Could not connect to MMA8452Q: ${c}`);
  }

  await mode_standby();  // Must be in standby to change registers

  // Set up the full scale range to 2, 4, or 8g.
  // 00 = 2G, 01 = 4A, 10 = 8G
  await write_register(XYZ_DATA_CFG, GSCALE >> 2);
  await write_register(FF_MT_CFG, ELE | OAE | ZEFE | YEFE);
  await write_register(FF_MT_THS, DBCNTM | 2);
  await write_register(FF_MT_COUNT, 0x80);
  await write_register(CTRL_REG3, WAKE_FF_MT | IPOL);
  await write_register(CTRL_REG4, INT_EN_FF_MT);

  for(let i=0; i<0x31; i++){
    console.log('reg', i.toString(16), (await read_register(i)).toString(16));
  }
  // The default data rate is 800Hz and we don't modify it in this example code
  await mode_active();  // Set to active to start reading
}

async function getInterrupt(){
  return await read_register(FF_MT_SRC);
}

exports.initialize = initialize;
exports.getAcceleration = getAcceleration;
exports.mode_active = mode_active;
exports.mode_standby = mode_standby;
exports.getInterrupt = getInterrupt;