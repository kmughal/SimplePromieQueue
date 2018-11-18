const {
  promisify
} = require('util');
const wait = promisify(require('./wait').wait);
const PromiseQueue = require('./promise-queue').PromiseQueue;
const {
  StreamArray
} = require('./stream-array');

var array = ["One", "two", "Three"];
const stream = new StreamArray(array);
stream.on("data", data => console.log("Reading chunk : ", data));
stream.on("end", _ => console.log("end"));

const tasks = [
  wait(5),
  wait(9),
  wait(13),
  wait(6)
];
const queue = new PromiseQueue(tasks);

queue.run();

const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const filename = "sample.txt";
const exists = promisify(fs.exists);


const doSomeThing = () =>
  Promise.resolve()
  .then(_ => "create a file with a delay!")
  .then(console.log)
  .then(_ => wait(5))
  .then(_ => exists(filename))
  .then(present => present ? unlink(filename) : writeFile("sample.txt", "Hello world"))
  .then(_ => "Completed")
  .then(console.log)
  .catch(console.error);

doSomeThing();

writeFile("sample1.txt", "this is a test file");

const {
  createReadStream,
  createWriteStream
} = require('fs');

const readStream = createReadStream("./sample1.txt");
const writeStream = createWriteStream("./copySampe1.txt");

readStream.pipe(writeStream).on("error", e => console.log(e));


const {
  Cluster
} = require('./cluster-example');

const clusterInstance = new Cluster();
clusterInstance.start();

const writeStream1 = createWriteStream("./input.txt");
const {
  Throttle
} = require('./throttle-stream');

const slowStream = new Throttle();

process.stdin.pipe(slowStream).pipe(writeStream1);

const {
  Shopper
} = require("./shopper");
const {
  Logger
} = require("./logger");
let shopper1 = new Shopper("John");
shopper1.addShoppingList("Pen");
shopper1.addShoppingList("Milk");

let shopper2 = new Shopper("Paul");
shopper2 = shopper1.clone();
shopper2.name = "Paul";

Logger.log(shopper1);
Logger.log(shopper2);


const {
  Iterator
} = require("./iterator");

const inventory = new Iterator([{
    name: "Pen",
    qty: 10
  },
  {
    name: "Rubber",
    qty: 5
  },
  {
    name: "Books",
    qty: 140
  },
  {
    name: "Milk",
    qty: 2
  },
  {
    name: "Tea",
    qty: 100
  },
]);

inventory.last().print();
inventory.next().print();
inventory.first().print();
//node --trace_gc .

// will dump Scavenge which is not bad as compared to Mark-sweep