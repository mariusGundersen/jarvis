
export default class Clock {
  constructor(element) {
    this.element = element;
    this.timeElement = element.querySelector('.time');
    this.messageElement = element.querySelector('.message');
    this.enable();
  }

  updateClock() {
    this.timeElement.innerHTML = formatDate(new Date());
  }

  enable() {
    if (this.enabled) return;

    this.updateClock();
    this.interval = setInterval(() => this.updateClock(), 500);
    this.enabled = true;
  }

  disable() {
    if (!this.enabled) return;

    clearInterval(this.inteval);
    this.enabled = false;
  }

  setMessage(message) {
    this.messageElement.innerHTML = message;
  }
}

function formatDate(date) {
  return `${fix(date.getHours())}:${fix(date.getMinutes())}:${fix(date.getSeconds())}`;
}

function fix(number) {
  if (number > 9) return number;
  return '0' + number;
}