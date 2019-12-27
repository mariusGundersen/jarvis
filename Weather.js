const request = require('request');
module.exports = class Weather {
  getMeteogram() {
    return request('https://www.yr.no/place/Norway/Oslo/Oslo/Oslo/meteogram.png');
  }

  getXml() {
    return request('https://www.yr.no/place/Norway/Oslo/Oslo/Oslo/forecast_hour_by_hour.xml');
  }
}