const discord = require('discord.js');
const CommandRegistry = require('./registry.js');
class Client extends discord.Client {
  constructor() {
    super();

    this.commandarray = [];

    this.registry = function (path) { CommandRegistry(this, path) };

    this.messagesParse = function (message) { MessagesParse(this, message) };
  }
}

function MessagesParse(Client, message) {
  let command = message.content.split(" ")[0];
  for (let i = 0; i < Client.commandarray.length; i++) {
    if (command.toLowerCase() === Client.commandarray[i].commandname.toLowerCase()) {
      let Run = require(Client.commandarray[i].path);
      Run(Client, message);
      delete require.cache[require.resolve(Client.commandarray[i].path)];
      break;
    }
  }
}

module.exports = Client;