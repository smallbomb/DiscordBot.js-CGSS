const ownerID = require('../../certificate.json').ownerID;
const two_week_milliseconds = 60 * 60 * 24 * 7 * 2 * 1000;

module.exports = async function (client, message) {
  if (message.author.id === ownerID) {
    if (message.content.split(" ")[1] === undefined) {
      let msg_array = await message.channel.fetchMessages({ limit: 100 });
      msg_array = msg_array.array().filter(old_m => old_m.id !== message.id && Date.now() - old_m.createdTimestamp < two_week_milliseconds);
      if (msg_array.length == 1) msg_array.map(async m => await m.delete().catch(console.error));
      else if (msg_array.length >= 2) await message.channel.bulkDelete(msg_array, true).catch(console.error);
      else;
    }
    else if (message.content.split(" ")[1] === "-f") {
      let msg_array = await message.channel.fetchMessages({
        limit: message.content.split(" ")[2] === undefined ? 10 : message.content.split(" ")[2]
      });
      msg_array = msg_array.array().filter(m => m.id !== message.id);
      msg_array.map(async m => await m.delete().catch(console.error));
    }
    else
      return Help(message);

    await message.delete(500);
  }
};

function Help(message) {
  message.channel.send(
    "```\n" +
    "command " + message.content.split(" ")[0] + "\n" +
    "  -f  : force 10\n" +
    "  -f nums\n" +
    "```"
  );
}