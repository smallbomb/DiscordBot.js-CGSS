const imagedir = "./src/data/images/lots/";
const config_path = "../config_json/lots.json"
const jsonObj = require(config_path);

module.exports = function (client, message) {
  let ask = undefined;
  let lots = undefined;
  if ((ask = LotsOption(message)) == undefined)
    return;
  lots = GetLots(ask, lots);
  message.reply("想問: \"" + ask + "\"", {
    file: imagedir + lots
  });

  delete require.cache[require.resolve(config_path)];
};

function Help(message) {
  message.channel.send(
    "```\n" +
    "command " + message.content.split(" ")[0] + "\n" +
    "   " + "-help\n" +
    "   " + "-v (顯示每個簽的機率)\n" +
    "   " + "\"吉\"\n" +
    "   " + "\"大凶\"...可以直接選該簽\n" +
    "   " + "\"你想祈求的內容\"\n" +
    "\n感謝Cior圖源提供\n" +
    "```"
  );
}

function ShowProb(message) {
  message.channel.send(
    "```\n" +
    "簽的機率: \n" +
    "   大凶: " + jsonObj.大凶 + "\n" +
    "   凶  : " + jsonObj.兇 + "\n" +
    "\n" +
    "   小吉: " + jsonObj.小吉 + "\n" +
    "   吉  : " + jsonObj.吉 + "\n" +
    "   中吉: " + jsonObj.中吉 + "\n" +
    "   大吉: " + jsonObj.大吉 + "\n" +
    "```"
  );
}

function LotsOption(msg) {
  if (msg.content.split(" ").length < 2) {
    Help(msg);
    return undefined;
  }
  else if (msg.content.split(" ")[1] === "-help") {
    Help(msg);
    return undefined;
  }
  else if (msg.content.split(" ")[1] === "-v") {
    ShowProb(msg);
    return undefined;
  }
  return msg.content.slice(msg.content.split(" ")[0].length);
}

function GetLots(ask, lots) {
  let lotsNumber = Math.floor(Math.random() * 100 + 1);
  if (ask === "大凶")
    lots = "大凶.png";
  else if (ask === "吉")
    lots = "吉.png";
  else if (ask === "中吉")
    lots = "中吉.png";
  else if (ask === "凶")
    lots = "凶.png";
  else if (ask === "小吉")
    lots = "小吉.png";
  else if (ask === "大吉")
    lots = "大吉.png";
  else if (lotsNumber <= parseInt(jsonObj.大凶))
    lots = "大凶.png"; 
  else if (lotsNumber <= parseInt(jsonObj.吉) + parseInt(jsonObj.大凶))
    lots = "吉.png"; 
  else if (lotsNumber <= parseInt(jsonObj.中吉) + parseInt(jsonObj.吉) + parseInt(jsonObj.大凶))
    lots = "中吉.png";
  else if (lotsNumber <= parseInt(jsonObj.凶) + parseInt(jsonObj.中吉) + parseInt(jsonObj.吉) + parseInt(jsonObj.大凶))
    lots = "凶.png"; 
  else if (lotsNumber <= parseInt(jsonObj.小吉) + parseInt(jsonObj.凶) + parseInt(jsonObj.中吉) + parseInt(jsonObj.吉) + parseInt(jsonObj.大凶))
    lots = "小吉.png"; 
  else if (lotsNumber <= parseInt(jsonObj.大吉) + parseInt(jsonObj.小吉) + parseInt(jsonObj.凶) + parseInt(jsonObj.中吉) + parseInt(jsonObj.吉) + parseInt(jsonObj.大凶))
    lots = "大吉.png";

  return lots;
}