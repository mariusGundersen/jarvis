const v3 = require('node-hue-api').v3
const discovery = v3.discovery;
const hueApi = v3.api;
;
const prompt = require('prompt-promise');
const fs = require('fs');

(async () => {
  const ipAddress = await discoverBridge();
  console.log(ipAddress);
  await prompt('Go press the button, then hit enter');
  const unauthenticatedApi = await hueApi.createLocal(ipAddress).connect();
  const createdUser = await unauthenticatedApi.users.createUser('jarvis', 'raspberri-pi');
  console.log('*******************************************************************************\n');
  console.log('User has been created on the Hue Bridge. The following username can be used to\n' +
    'authenticate with the Bridge and provide full local access to the Hue Bridge.\n' +
    'YOU SHOULD TREAT THIS LIKE A PASSWORD\n');
  console.log(`Hue Bridge User: ${createdUser.username}`);
  console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
  console.log('*******************************************************************************\n');

  // Create a new API instance that is authenticated with the new user we created
  const authenticatedApi = await hueApi.createLocal(ipAddress).connect(createdUser.username);

  // Do something with the authenticated user/api
  const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
  console.log(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);

  const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
  config.hue = { username: createdUser.username, ipAddress, clientKey: createUser.clientkey };
  fs.writeFileSync('config.json', JSON.stringify(config, null, '  '));
  console.log('done');
})();

async function discoverBridge() {
  const discoveryResults = await discovery.nupnpSearch();

  if (discoveryResults.length === 0) {
    console.error('Failed to resolve any Hue Bridges');
    return null;
  } else {
    // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
    return discoveryResults[0].ipaddress;
  }
}
