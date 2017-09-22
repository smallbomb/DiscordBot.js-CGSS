const ownerID = require('../../certificate.json').ownerID;

module.exports = function (client, message) {
  if (message.author.id === ownerID) {
    let parameter = message.content.split(" ")[1];
    if (parameter === "game") {
      client.user.setPresence({
        afk: false,
        status: "online",
        game: {
          name: message.content.split(" ")[2] === undefined ? "デレステ" : message.content.split(" ")[2],
          url: message.content.split(" ")[3] === undefined ? undefined : message.content.split(" ")[3]
        }
      });
    }
    else if (parameter === "invisible") {
      client.user.setPresence({
        status: "invisible"
      });
    }
    else {
      Help(message);
    }
  }
};

function Help(message) {
  message.channel.send(
    "```\n" +
    "command " + message.content.split(" ")[0] + "\n" +
    "  game [gamename [gameURL]]\n" +
    "  invisible\n" +
    "```"
  );
}