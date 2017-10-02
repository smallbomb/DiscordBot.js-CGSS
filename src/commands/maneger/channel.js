const ownerID = require('../../certificate.json').ownerID;

module.exports = function (client, message) {
  if (message.author.id === ownerID) {
    console.log("author=" + message.guild.member(message.author).nickname);
    console.log("guild_id=" + message.guild.id);
    console.log("channel_id=" + message.channel.id);
    console.log("message_id=" + message.id);
  }
};