const optset = require('getopt-c');
const argv = require('shell-quote');
const fs = require('fs');
const cert = require('../../certificate.json');
const ownerID = cert.ownerID;
const prefix = cert.prefix;
const jsonGame = cert.game;

module.exports = function (client, message) {
  if (message.author.id === ownerID) {
    if ((userOpt = UserOption(message)) === undefined) return;
    jsonGame.expiry_date = (Date.now() + 1800 * 1000).toString();
    jsonGame.userID = message.author.id;
    jsonGame.userName = message.author.username;
    jsonGame.name = userOpt.name === undefined ? "" : userOpt.name;
    jsonGame.url = userOpt.url === undefined ? "" : userOpt.url;
    cert.game = jsonGame;
    fs.writeFileSync("./src/certificate.json", JSON.stringify(cert), "utf8");
    client.user.setPresence({
      afk: false,
      status: userOpt.status,
      game: {
        name: userOpt.name,
        url: userOpt.url,
      }
    });
  }
};

function Help(message) {
  message.channel.send(
    "```\n" +
    "command " + message.content.split(" ")[0] + "\n" +
    "  -n, --name gamename\n" +
    "  -u, --url  url\n" +
    "  -i, --invisible\n" +
    "  -c, --clean\n" +
    "```"
  );
}

function ShowStatus(message) {
  let expiry = new Date(parseInt(jsonGame.expiry_date));
  message.channel.send(
    "```\n" +
    "目前使用者: " + jsonGame.userName + "\n" +
    "正在玩: " + jsonGame.name + "\n" +
    "網址: " + jsonGame.url + "\n" +
    "到期時間: " + (jsonGame.expiry_date === "" ? "" : (expiry.getMonth() + 1) + "/" + (expiry.getDay() + 1) + " " + expiry.getHours() + ":" + expiry.getMinutes() + ":" + expiry.getSeconds()) + "\n" +
    "```"
  );
}

function Clean(message) {
  jsonGame.expiry_date = "";
  jsonGame.userID = "";
  jsonGame.userName = "";
  jsonGame.name = "";
  jsonGame.url = "";
  cert.game = jsonGame;
  fs.writeFileSync("./src/certificate.json", JSON.stringify(cert), "utf8");
  message.author.send("OK!");
}

function optObj() {
  obj = [{
    name: 'name',
    has_arg: true,
    val: 'n'
  },
  {
    name: 'url',
    has_arg: true,
    val: 'u'
  },
  {
    name: 'invisible',
    has_arg: false,
    val: 'i'
  },
  {
    name: 'status',
    has_arg: false,
    val: 's'
  },
  {
    name: 'clean',
    has_arg: false,
    val: 'c'
  }
  ];
  return obj
}

function UserOption(message) {
  let useropt = {
    name: prefix + "help",
    url : undefined,
    status : "online"
  }
  let parse = optset(argv.parse("garbage_str " + message.content), 'i:n:u:cs', optObj());
  while ((opt = parse.getopt_long()) !== undefined) {
    switch (opt.option) {
      case 'i':
        useropt.status = "invisible";
        break;
      case 'n':
        useropt.name = opt.arg;
        break;
      case 'u':
        useropt.url = opt.arg;
        break;
      case 'c':
        Clean(message);
        return undefined;
      case 's':
        ShowStatus(message);
        return undefined;
      default:
        Help(message);
        return undefined;
    }
  }
  return useropt;
}

