const request = require('request');
module.exports = class Weather {
  async getMeteogram(){
    const result = await request('https://www.yr.no/place/Norway/Oslo/Oslo/Oslo/meteogram.png', {
    });

    return result;
  }
}