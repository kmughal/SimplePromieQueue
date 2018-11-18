const cluster = require("cluster");
const os = require("os");
const express = require("express");
const path = require("path");
const {
  stat,
  createWriteStream
} = require("fs");
const {
  promisify
} = require("util");
const {
  Form
} = require("multiparty");
const fileState = promisify(stat);

class Cluster {
  constructor(port = 3500) {
    this.numberOfCors = os.cpus().length;
    this.port = port;
    this.app = express();
  }

  start() {
    if (cluster.isMaster) {
      console.log("cluster is master");
      this.createChildProcesses();
      this.registerNotificationEvent();
    } else {
      this.startServer();
    }
  }

  addMiddlewares() {

  }

  handleNotification(cmd) {
    console.log(`Message received from express : ${JSON.stringify(cmd)}`);
  }

  setResponseForFileDownload() {
    this.app.get("/sample", (req, res) => {
      fileState(path.resolve(__dirname, "sample.txt"))
        .then(s => s.size)
        .then(size => res.set("Content-Size", size))
        .then(_ => res.set("Content-Type", "text/plain"))
        .then(_ => createWriteStream(path.resolve(__dirname, "sample.txt")))
        .then(str => str.pipe(res));
    });
  }

  setResponseForAllOtherRequests() {
    this.app.get("*", (req, res) => {
      res.send(200);
      process.send({
        cmd: "request",
        date: new Date().toISOString()
      });
    });
  }

  setResponseForVideoRequest() {
    this.app.get("/video", async (req, res) => {
      let dummayFilePath = path.resolve(__dirname, "dummy.mp4");
      const {
        size
      } = await fileState(dummayFilePath);
      const range = req.headers.range;
      res.set("Content-Type", "video/mp4");
      if (range) {
        let [start, end] = range.replace(/bytes=/, "").split("-");
        end = end ? parseInt(end, 10) : size - 1;
        start = parseInt(start, 10);
        res.set("Content-Range", `bytes ${start}-${end}/${size}`);
        res.set("Content-Ranges", "bytes");
        res.set("Content-Length", end - start + 1);
        res.sendStatus(206);
        createWriteStream(dummayFilePath, {
          start,
          end
        }).pipe(res);
        return;
      }
      res.sendStatus(200);
      createWriteStream(dummayFilePath).pipe(res);
    });
  }

  setResponseForFileUpload() {
    this.app.get("/upload", (req, res) => {
      res.sendFile(path.resolve(__dirname, "upload.html"));
    });

    this.app.post("/upload", (req, res) => {
      const form = new Form();
      form.on("part", part => {
        part.pipe(createWriteStream(`copy-${part.filename}`))
          .on("close", _ => {
            //res.sendFile(path.resolve(__dirname, "upload-success.html"));
            res.send(`<h1>${part.filename} uploaded`);
          });
      });
      form.parse(req);
    });
  }
  startListening() {
    this.app.listen(this.port, () => {
      console.log("Server running : ", this.port);
    });
  }

  startServer() {
    this.addMiddlewares();
    this.setResponseForFileUpload();
    this.setResponseForFileDownload();
    this.setResponseForAllOtherRequests();
    this.startListening();
  }

  createChildProcesses() {
    for (let i = 0; i < this.numberOfCors; i++) {
      cluster.fork();
    }
  }

  registerNotificationEvent() {
    for (const id in cluster.workers) {
      cluster.workers[id].on("message", this.handleNotification);
    }
  }
}

module.exports.Cluster = Cluster;