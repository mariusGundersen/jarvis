const request = require('request');
module.exports = class Weather {
  getMeteogram() {
    return request('https://www.yr.no/place/Norway/Oslo/Oslo/Oslo/meteogram.png', {
    });
  }
}