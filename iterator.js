const {
  Logger
} = require("./logger");

class Iterator {

  constructor(list) {
    this._list = list;
    this._total = list.length;
    this._index = 0;
  }

  next() {
    this._index++;
    if (this._index >= this._total) {
      this._index = this._total - 1;
    }
    return this;
  }

  prev() {
    this._index--;
    if (this._index < 0) {
      this._index = 0;
    }
    return this;
  }

  first() {
    this._index = 0;
    return this;
  }

  last() {
    this._index = this._total - 1;
    return this;
  }

  print() {
    Logger.log(JSON.stringify(this._list[this._index]));
  }

}

module.exports.Iterator = Iterator;