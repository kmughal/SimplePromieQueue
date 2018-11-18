const {
  Readable
} = require('stream');

class StreamArray extends Readable {

  constructor(array) {
    //super({encoding: "UTF-8"});
    super({
      objectMode: true
    });
    this.array = array;
    this.index = 0;
  }

  _read() {
    if (this.index > this.array.length) {
      return this.push(null);
    }

    const chunk = {
      value: this.array[this.index],
      index: this.index
    };

    this.push(chunk);
    this.index++;
  }
}

module.exports.StreamArray = StreamArray;