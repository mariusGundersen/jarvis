const request = require('request-promise');
module.exports = class Bikes {
  constructor(apiKey){
    this.apiKey = apiKey;
  }

  async getStatus(){
    const result = await request('https://oslobysykkel.no/api/v1/stations/availability', {
      json: true,
      headers: {
        'Client-Identifier': this.apiKey
      }
    });

    return result.stations;
  }
}