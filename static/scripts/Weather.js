export default class Weather {
  constructor(element) {
    this.element = element;
    this.element.addEventListener('click', () => this.refresh());
    this.refresh();
  }

  async refresh() {
    this.element.src = 'weather.png?v=' + Date.now();
  }
}
