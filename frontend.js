
const scenes = [
  {
    name: 'Off',
    background: '#223',
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
        <img id="meteogram" src="https://www.yr.no/place/Norway/Oslo/Oslo/Oslo/meteogram.png" />
      </div>
      <script src="/script.js"></script>
    </body>
  </html>`
;

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
