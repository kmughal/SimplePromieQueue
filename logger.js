class Logger {
  constructor() {
    this.logs = [];
  }

  log(message) {
    this.logs.push(message);
    console.log(`Data: ${new Date().toISOString()},${message}`);
  }
}

module.exports.Logger = new Logger();

// Example of Singleton.