const request = require('request-promise-native');

module.exports = class Bikes {
  async getStatus() {
    const result = await request('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json', {
      json: true,
      headers: {
        'Client-Identifier': 'mariusgundersen.net-jarvis'
      }
    });

    return result.data.stations;
  }
}
