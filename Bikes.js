const request = require('request-promise');
module.exports = class Bikes {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async getStatus() {
    const result = await request('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json', {
      json: true,
      headers: {
        'Client-Identifier': this.apiKey,
        'client-name': 'mariusgundersen.net-jarvis'
      }
    });

    return result.data.stations;
  }
}
