const logUpdate = require('log-update');
const todX = require('./helpers').todX;


class PromiseQueue {

  constructor(promises = [], concurrent = 1) {
    this.concurrent = concurrent;
    this.tasks = promises;
    this.completed = [];
    this.running = [];
    this.total = this.tasks.length;
  }

  get canRunMore() {
    return this.tasks.length && (this.running.length < this.concurrent);
  }

  tasksGraph() {
    const {
      tasks,
      completed,
      running
    } = this;
    logUpdate(`
      tasks : ${tasks.map(todX)},
      running : ${running.map(todX)},
      completed : ${completed.map(todX)}
    `);
  }

  run() {
    while (this.canRunMore) {
      const promise = this.tasks.shift();

      promise.then(_ => {
        this.completed.push(this.running.shift());
        this.tasksGraph();
        this.run();
      });

      this.running.push(promise);
      this.tasksGraph();
    }
  }
}


module.exports.PromiseQueue = PromiseQueue;