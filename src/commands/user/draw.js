const imagedir = "./src/data/images/draw/";
const config_path = "../config_json/draw.json"

module.exports = function (client, message) {
  let card = undefined;
  card = GetACard("");

};

function Help(message) {
  message.channel.send(
    "```\n" +
    "command " + message.content.split(" ")[0] + "\n" +
    "```"
  );
}

function GetACard(str) {
  let jsonObj = require(config_path);
  let BounsSSRprob = parseFloat(jsonObj.BounsSSRprob) * 100;
  let BounsSRprob = parseFloat(jsonObj.BounsSRprob) * 100;
  let SSRprob = parseFloat(jsonObj.SSRprob) * 100;
  let SRprob = parseFloat(jsonObj.SRprob) * 100;
  let Rprob = parseFloat(jsonObj.Rprob) * 100; // SSRprob + SRprob + Rprob 1~10000

  delete require.cache[require.resolve(config_path)];
}