const optset = require('getopt-c'); // if you need it.
const argv = require('shell-quote'); // if you need it.
module.exports = function (client, message) {
  // your write command code...
  Help(message);

};

function Help(message) {
  message.channel.send(
    "```\n" +
    "command " + message.content.split(" ")[0] + "\n" +
    "```"
  );
}