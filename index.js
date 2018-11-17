const {
  promisify
} = require('util');
const wait = promisify(require('./wait').wait);
const PromiseQueue = require('./promise-queue').PromiseQueue;
const {StreamArray} = require('./stream-array');

var array = ["One" , "two" , "Three"];
const stream = new StreamArray(array);
stream.on("data" , data => console.log("Reading chunk : " , data));
stream.on("end" , _ => console.log("end"));


const tasks = [
  wait(5),
  wait(9),
  wait(13),
  wait(6)
];
const queue = new PromiseQueue(tasks);

queue.run();



//node --trace_gc .

// will dump Scavenge which is not bad as compared to Mark-sweep