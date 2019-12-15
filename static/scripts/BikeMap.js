import { template, getJson } from './util.js';

export default class BikeMap {
  constructor(element) {
    this.element = element;
    this.element.innerHTML = bikeMap(racks);
    this.element.addEventListener('click', () => this.update());
    this.update();
  }

  async update() {
    const result = await getJson('/bikes');
    const map = new Map(result.map(r => [r.station_id, r]));
    for (const rack of this.element.querySelectorAll('.bike-text')) {
      const availability = map.get(rack.getAttribute('data-id'));
      rack.textContent = availability.num_bikes_available;
    }
    for (const rack of this.element.querySelectorAll('.bike-circle')) {
      const availability = map.get(rack.getAttribute('data-id'));
      const percentage = calculatePercentage(availability);
      rack.style.fill = fade(percentage);
    }
  }
}

function calculatePercentage({ num_bikes_available }) {
  if (num_bikes_available < 7) {
    return num_bikes_available / 7 * 0.9;
  }

  return 0.9 + 0.1 * (1 - 1 / (num_bikes_available - 6));
}

function fade(percentage) {
  return percentageToHsl(percentage, 0, 120);
}

function percentageToHsl(percentage, hue0, hue1) {
  var hue = (percentage * (hue1 - hue0)) + hue0;
  return 'hsl(' + hue + ', 100%, 50%)';
}

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

const bikeMap = (racks) => template`
  <rect x="0" y="0" width="100" height="100" fill="black" />
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
`;

const bikeStop = (rack) => template`
  <circle cx="${rack.x}" cy="${rack.y}" r="2" class="bike-circle" data-id="${rack.id}" />`;
  //<text x="${rack.x}" y="${rack.y}" text-anchor="middle" alignment-baseline="middle" class="bike-text" data-id="${rack.id}">?</text>`;
