const cluster = require('cluster');
const os = require('os');
const express = require('express');

class Cluster {

  constructor(port = 3500) {
    this.numberOfCors = os.cpus().length;
    this.port = port;
    this.app = express();
  }

  start() {
    if (cluster.isMaster) {
      console.log('cluster is master');
      this.createChildProcesses();
      this.registerNotificationEvent();
    } else {
      this.startServer();
    }
  }

  handleNotification(cmd) {
    console.log(`Message received from express : ${JSON.stringify(cmd)}`);
  }

  startServer() {
    this.app.get('*', (req, res) => {
      res.send(200);
      process.send({
        cmd: 'request',
        date: new Date().toISOString()
      });
    });

    this.app.listen(this.port);
  }

  createChildProcesses() {
    for (let i = 0; i < this.numberOfCors; i++) {
      cluster.fork();
    }
  }

  registerNotificationEvent() {
    for (const id in cluster.workers) {
      cluster.workers[id].on('message', this.handleNotification);
    }
  }

}


module.exports.Cluster = Cluster;