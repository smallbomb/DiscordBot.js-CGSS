const ownerID = require('../../certificate.json').ownerID;

module.exports = async function (client, message) {
  if (message.author.id === ownerID) {
    message.channel.fetchMessages({
        limit: new Number(100)
      })
      .then(messages => {
        let msg_array = messages.array();
        msg_array = msg_array.filter(m => m.author.id === client.user.id && m.id !== message.id);
        if (msg_array.length == 1) msg_array.map(m => m.delete().catch(console.error));
        else if (msg_array.length >= 2) message.channel.bulkDelete(msg_array, true);
        else;
      })
      .catch(console.error);
    await message.delete(1000);
    message.channel.send("clean done");
  }
};