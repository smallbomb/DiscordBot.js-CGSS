const request = require('request'); // if you need it.
module.exports = function (client, message) {
  let url;
  if ((url = CgssOtionParser(message)) === undefined) return;
  console.log(url);
  request({
    url: url,
    method: "GET"
  }, function(error, response, body) {
    if (error || JSON.parse(body).api_error) {
      message.channel.send("<@" + message.author.id + "> " + "ID可能有錯誤");
      return;
    }
    userObj = JSON.parse(body);
    console.log(userObj.comment);
  });
 
};

function CgssOtionParser(message) {
  let url = undefined;
  let id = /^[0-9]\d+$/; // ID is 9bit number.
  let i = message.content.split(" ").length - 1; // id index
  if (i < 1) Help(message);
  else if (message.content.split(" ")[i].length !== 9 || !id.test(message.content.split(" ")[i])) Help(message);
  else url = "https://deresute.me/" + message.content.split(" ")[i] + "/json";
  return url;
}

function Help(message) {
  message.channel.send(
    "```\n" +
    "command " + message.content.split(" ")[0] + "\n" +
    "   ID: your cgss id\n" +
    "```"
  );
}