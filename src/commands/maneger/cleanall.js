const ownerID = require('../../certificate.json').ownerID;

module.exports = async function (client, message) {
  if (message.author.id === ownerID) {
    if (message.content.split(" ")[1] === undefined) {
      await message.channel.fetchMessages({
          limit: new Number(100)
        })
        .then(messages => {
          let msg_array = messages.array();
          msg_array = msg_array.filter(m => m.id !== message.id);
          if (msg_array.length == 1) msg_array.map(m => m.delete().catch(console.error));
          else if (msg_array.length >= 2) message.channel.bulkDelete(msg_array, true);
          else;
        })
        .catch(console.error);
    } else if (message.content.split(" ")[1] === "-f") {
      await message.channel.fetchMessages({
          limit: new Number(message.content.split(" ")[2] === undefined ? 10 : message.content.split(" ")[2])
        })
        .then(messages => {
          let msg_array = messages.array();
          msg_array = msg_array.filter(m => m.id !== message.id);
          msg_array.map(m => m.delete().catch(console.error));
        })
        .catch(console.error);
    } else {
      Help();
      return;
    };
    await message.delete(1000);
    message.channel.send("clean done");
  }


  function Help() {
    message.author.send(
      "```\n" +
      "command cleanall\n" +
      "  cleanall [-f [nums]]\n" +
      "     nums: default 10\n"+
      "```"
    );
  }
};