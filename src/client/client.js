const discord = require('discord.js');
const CommandRegistry = require('./registry.js');
class Client extends discord.Client {
  constructor() {
    super();
    this.commandarray = [];
    this.registry = function (path) {
      CommandRegistry(this, path);
    };
    this.messagesParse = function (message) {
      let command = message.content.split(" ")[0];
      for (let i = 0; i < this.commandarray.length; i++) {
        if (command.toLowerCase() === this.commandarray[i].commandname.toLowerCase()) {
          let Run = require(this.commandarray[i].path);
          Run(this, message);
          delete require.cache[require.resolve(this.commandarray[i].path)];
          break;
        }
      }
    };
  }
}

module.exports = Client;