const Accel = require('../Accelerometer');

var accel = new Accel();

let counter = 0;

accel.start({
    async onMotion() {
        console.log('moved', counter++);
    }
}).catch(e => console.error(e));