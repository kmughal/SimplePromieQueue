const {Duplex} = require('stream');


class Throttle  extends Duplex {

  constructor(delay = 10) {
    super();
    this.delay = delay;
  }

  _read() {

  }

  _write(chunk,encoding,callback) {
      this.push(chunk);
      setTimeout(callback, this.delay);
  }

  _final() {
    this.push(null);
  }
}

module.exports.Throttle = Throttle;