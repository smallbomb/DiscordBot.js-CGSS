const optset = require('getopt-c'); // if you need it.
module.exports = function (client, message) {
  Help(message);
};

function Help(message) {
  message.channel.send(
    "```\n" +
    "command " + message.content.split(" ")[0] + " 未完成\n" +
    "```"
  );
}