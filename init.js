const hue = require("node-hue-api");
const prompt = require('prompt-promise');
const fs = require('fs');

var displayBridges = function(bridge) {
console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};
(async () => {
  const bridges = await hue.upnpSearch(2000);
  console.log(bridges);
  const bridge = bridges[0];
  const api = new hue.HueApi();
  await prompt('Go press the button, then hit enter');
  const username = await api.createUser(bridge.ipaddress);
  console.log('username:', username);
  fs.writeFileSync('.philips-hue.json', JSON.stringify({username, bridge: bridge.ipaddress}));
  console.log('done');
})();