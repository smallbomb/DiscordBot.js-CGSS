// Import the discord.js module
const Discord = require('discord.js');

// Import baseic data
const cert = require("../../certificate.json");

// Create an instance of a Discord client
const chihiro = new Discord.Client();

const token = cert.token;
const prefix = cert.prefix;

chihiro
  .on('ready', () => {
    console.log(`Logged in as ${chihiro.user.tag} !`);
  })
  .on('message', message => {
    if (message.content === prefix + "foo") {
      message.reply("bar");
    }
  });


chihiro.login(token);