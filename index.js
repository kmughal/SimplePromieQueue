const {
  promisify
} = require('util');
const wait = promisify(require('./wait').wait);
const PromiseQueue = require('./promise-queue').PromiseQueue;


const tasks = [
  wait(5),
  wait(9),
  wait(13),
  wait(6)
];


const queue = new PromiseQueue(tasks);

queue.run();