module.exports = function (client, message) {
  let tempMsg = message;
  message.delete();
  tempMsg.channel.send(tempMsg.content.slice(tempMsg.content.split(" ")[0].length));
};
