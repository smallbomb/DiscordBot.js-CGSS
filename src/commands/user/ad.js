const optset = require('getopt-c');
const argv = require('shell-quote');
const fs = require('fs');
const cert = require('../../certificate.json');
const prefix = cert.prefix;
const jsonGame = cert.game;

module.exports = function (client, message) {
  if ((userOpt = UserOption(message)) === undefined) return;
  if (IsCheckOK(message, userOpt)) {
    client.user.setPresence({
      afk: false,
      status: userOpt.status,
      game: {
        name: userOpt.name,
        url: userOpt.url,
      }
    });
  }
  else {
    ShowStatus(message);
  }
};

function ShowStatus(message) {
  let expiry = new Date(parseInt(jsonGame.expiry_date));
  message.channel.send(
    "```\n" +
    "目前使用者: " + jsonGame.userName + "\n" +
    "正在玩: " + jsonGame.name + "\n" +
    "網址: " + jsonGame.url + "\n" +
    "到期時間: " + (expiry.getMonth() + 1) + "/" + (expiry.getDay() + 1) + " " + expiry.getHours() + ":" + expiry.getMinutes() + ":" + expiry.getSeconds() + "\n" +
    "```"
  );
}

function IsCheckOK(message, userOpt) {
  if (jsonGame.expiry_date === "") {
    jsonGame.expiry_date = (Date.now() + 1800 * 1000).toString();
    jsonGame.userID = message.author.id;
    jsonGame.userName = message.author.username;
    jsonGame.name = userOpt.name === undefined ? "" : userOpt.name;
    jsonGame.url = userOpt.url === undefined ? "" : userOpt.url;
  }
  else if (parseInt(jsonGame.expiry_date) - Date.now() < 0) {
    jsonGame.expiry_date = (Date.now() + 1800 * 1000).toString();
    jsonGame.userID = message.author.id;
    jsonGame.userName = message.author.username;
    jsonGame.name = userOpt.name === undefined ? "" : userOpt.name;
    jsonGame.url = userOpt.url === undefined ? "" : userOpt.url;
  }
  else if (jsonGame.userID === message.author.id) {
    jsonGame.name = userOpt.name === undefined ? "" : userOpt.name;
    jsonGame.url = userOpt.url === undefined ? "" : userOpt.url;
  }
  else return false;

  cert.game = jsonGame;
  fs.writeFileSync("./src/certificate.json", JSON.stringify(cert), "utf8");
  return true;
}

function Help(message) {
  message.channel.send(
    "```\n" +
    "command " + message.content.split(" ")[0] + "\n" +
    "  -n, --name gamename\n" +
    "  -u, --url  url\n" +
    "  -s, --status" +
    "```"
  );
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
      name: 'status',
      has_arg: false,
      val: 's'
    }
  ];
  return obj
}

function UserOption(message) {
  let usropt = {
    name: prefix + "help",
    url: undefined,
    status: "online"
  }
  let parse = optset(argv.parse("garbage_str " + message.content), 'n:u:s', optObj());
  while ((opt = parse.getopt_long()) !== undefined) {
    switch (opt.option) {
      case 'n':
        usropt.name = opt.arg;
        break;
      case 'u':
        usropt.url = opt.arg;
        break;
      case 's':
        ShowStatus(message);
        return undefined;
      default:
        Help(message);
        return undefined;
    }
  }
  return usropt;
}