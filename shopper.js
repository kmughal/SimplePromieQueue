class Shopper {
  constructor(name = 'Khurram Shahzad') {
    this._name = name;
    this._shoppingList = [];
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get shoppingList() {
    return this._shoppingList.join(" ");
  }

  addShoppingList(shoppingItem) {
    this._shoppingList.push(shoppingItem);
  }

  clone() {

    const proto = Object.getPrototypeOf(this);
    const cloned = Object.create(proto);

    cloned._name = this._name;
    cloned._shoppingList = [...this._shoppingList];

    return cloned;
  }
}


module.exports.Shopper = Shopper;