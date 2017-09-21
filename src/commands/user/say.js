module.exports = function (client, message) {
  let tempMsg = message;
  message.delete();
  tempMsg.channel.send(tempMsg.content.slice('say'.length));
};
