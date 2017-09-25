// imagedir-path
const imagedir = "./src/data/images/draw/";
const bounsSSR_path = imagedir + "BounsSSR/";
const bounsSR_path = imagedir + "BounsSR/";
const SSR_path = imagedir + "SSR/";
const SR_path = imagedir + "SR/";
const R_path = imagedir + "R/";
// config-path
const config_path = "../config_json/draw.json"
// import images 
const images = require('images');

module.exports = function (client, message) {
  let card = undefined;
  let user_drawcount = 1;
  for (let i = 0; i < user_drawcount; i++) {
    card = GetACard("SSR");





  }
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

  let cardType = undefined;
  if (str === "SSR")
    cardType = Math.floor(Math.random() * 100 + 15);
  else if (str === "SR")
    return;
  else if (str === "R")
    return;
  delete require.cache[require.resolve(config_path)];
}