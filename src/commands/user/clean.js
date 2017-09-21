const ownerID = require('../../certificate.json').ownerID;

module.exports = async function (client, message) {
  if (message.author.id === ownerID) {
    await message.channel.fetchMessages({
        limit: new Number(100)
      })
      .then(messages => {
        let msg_array = messages.array().filter(m => m.author.id === client.user.id);
        if (msg_array.length == 1) msg_array.map(m => m.delete().catch(console.error));
        else if (msg_array.length >= 2) message.channel.bulkDelete(msg_array);
        else;
      })
      .catch(console.error);
    await message.delete(500);
    message.channel.send("clean done");
  }
};