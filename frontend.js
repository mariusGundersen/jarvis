
const scenes = [
  {
    name: 'Off',
    background: '#223',
    color: 'white'
  },
  {
    name: 'Sleep',
    background: 'linear-gradient(to right, #7d7e7d 0%,#222233 0%,#4e2c0b 100%)',
    color: 'white'
  },
  {
    name: 'Nightlight',
    background: '#4e2c0b',
    color: 'white'
  },
  {
    name: 'Relax',
    background: '#e3bc18',
    color: 'black'
  },
  {
    name: 'Bright',
    background: '#ffff00',
    color: 'black'
  }
];

const racks = [
  {
    x: 27,
    y: 34,
    id: 162
  },
  {
    x: 40,
    y: 8,
    id: 183
  },
  {
    x: 39,
    y: 89,
    id: 233
  },
  {
    x: 79,
    y: 59,
    id: 251
  },
  {
    x: 62,
    y: 83,
    id: 196
  },
  {
    x: 27,
    y: 56,
    id: 248
  },
  {
    x: 40,
    y: 46,
    id: 400
  },
  {
    x: 42,
    y: 39,
    id: 418
  }
];

exports.index = () => template`<!doctype html>
  <html>
    <head>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div id="scenes">
        ${scenes.map(sceneButton)}
      </div>
      <div id="meteogram-wrapper">
        ${map(racks)}
        <img id="meteogram" src="https://www.yr.no/place/Norway/Oslo/Oslo/Oslo/meteogram.png" />
      </div>
      <script src="/script.js"></script>
    </body>
  </html>`
;

const map = (racks) => template`<svg id="map" width="535" height="535" viewBox="0 0 100 100" preserveAspectRatio="xMidYMin meet">
  <rect x="0" y="0" width="100" height="100" fill="lightslategray" />
  <path class="river" d="M 90 0 T 82,5 T 80,15 T 70,25 T 55,40 T 60,60 T 55,75 T 40 100"></path>
  <line x1="30" x2="30" y1="0" y2="100"></line>
  <line x1="99" x2="60" y1="0" y2="100"></line>
  <line x1="0" x2="100" y1="30" y2="60" class="ring2"></line>
  <line x1="30" x2="80" y1="15" y2="0"></line>
  <line x1="0" x2="100" y1="88" y2="84"></line>
  <g style="transform: translate(49px, 41px)">
    <path class="home" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z" style="transform: scale(0.1)" />
  </g>
  ${racks.map(bikeStop)}
</svg>`;

const bikeStop = (rack) => template`
<circle cx="${rack.x}" cy="${rack.y}" r="2" class="bike-circle" data-id="${rack.id}" />`;
//<text x="${rack.x}" y="${rack.y}" text-anchor="middle" alignment-baseline="middle" class="bike-text" data-id="${rack.id}">?</text>`;

const sceneButton = (scene) => template`
  <button
    class="scene"
    data-id="${scene.name}"
    style="
      background: ${scene.background};
      color: ${scene.color}
    ">
      ${scene.name}
  </button>`
;

function template(strings, ...objects){
  return String.raw(strings, ...objects.map(o => Array.isArray(o) ? o.join('') : o))
}
