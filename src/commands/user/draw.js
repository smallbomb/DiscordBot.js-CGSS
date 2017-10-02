const fs = require('fs');
const optset = require('getopt-c');
const images = require('images');
const drawJson = requireUncached("../config_json/draw.json");
const path_root = process.cwd();

module.exports = function (client, message) {
  let card = [];
  let cardpool = undefined;
  let mergeImageBuffer = undefined;
  let userOpt = undefined;
  let count = 0;
  if ((userOpt = DrawOtionParser(message)) === undefined) return;
  
  cardpool = setCardPool(userOpt.pool_index);
  for (let i = 0; i < userOpt.count; i++) {
    if (i === 9 && !card.find(c => { return c.type === "SSR" || c.type === "SR" })) // check one SR or SSR at least? 
      card.push(GetACard(cardpool, "SR"));
    else
      card.push(GetACard(cardpool));
  }
  mergeImageBuffer = MergeCard(card);
  message.channel.send("<@" + message.author.id + ">", {
    file: mergeImageBuffer
  });
};

function Help(message) {
  message.channel.send(
    "```\n" +
    "command " + message.content.split(" ")[0] + "(暫時把計算和紀錄砍掉..回復時間未知,目前只能選單色池1~3)\n" +
    "   -h       :help\n" +
    "   -c chose :數字, 選一個卡池(default: " + drawJson.cardpool.length + "號卡池)\n" +
    "   -n num   :數字, 數量1~10(default: 10)\n" +
    "   -i info  :卡池資訊\n" +
    "      info  :\"all\" or \"數字編號\"\n" +
    "```"
  );
}

function GetACard(cardpool, str) {
  let Card = {
    type: undefined,
    name: undefined
  };
  let prob = undefined;
  let SSRprob = parseInt(drawJson.SSRprob) * 100;
  let SRprob = parseInt(drawJson.SRprob) * 100;
  let Rprob = parseInt(drawJson.Rprob) * 100;
  if (str === "SSR")
    prob = Math.floor(Math.random() * SSRprob) + 1;
  else if (str === "SR")
    prob = Math.floor(Math.random() * SRprob) + SSRprob + 1;
  else if (str === "R")
    prob = Math.floor(Math.random() * Rprob) + SSRprob + SRprob + 1;
  else
    prob = Math.floor(Math.random() * (SSRprob + SRprob + Rprob)) + 1;
  if (prob <= SSRprob) {
    Card.type = "SSR";
    Card.name = cardpool.SSR[Math.floor(Math.random() * cardpool.SSR.length)];
  }
  else if (prob <= SSRprob + SRprob) {
    Card.type = "SR";
    Card.name = cardpool.SR[Math.floor(Math.random() * cardpool.SR.length)];
  }
  else if (prob <= SSRprob + SRprob + Rprob) {
    Card.type = "R";
    Card.name = cardpool.R[Math.floor(Math.random() * cardpool.R.length)];
  }
  return Card;
}


function MergeCard(card) {
  let space = 20;
  let MergeImages = undefined;
  for (let i = 0, width = 0, height = 0; i < card.length; i++) {
    let image_tmp = images(card[i].name);

    if (MergeImages === undefined)
      MergeImages = images(image_tmp.width() * (card.length < 5 ? card.length + 1 : 5) + card.length * space, card.length >= 5 ? image_tmp.height() * 2 + space : image_tmp.height())

    if (i === 5) {
      width = 0;
      height = image_tmp.height() + space;
      MergeImages.draw(image_tmp, width, height);
      width += image_tmp.width() + space;
    }
    else {
      MergeImages.draw(image_tmp, width, height);
      width += image_tmp.width() + space;
    }
  }
  return MergeImages.encode("png");
}

function setCardPool(index) {
  let i = index - 1;
  let path_Bo_SSR = "";
  let path_Bo_SR = "";
  let cardpool = {
    SSR: undefined,
    SR: undefined,
    R: undefined
  };
  if (drawJson.cardpool[i].type === "Cute") {
    cardpool.SSR = getAllFileName(path_root + drawJson.defaultPath_cute + "SSR/");
    cardpool.SR = getAllFileName(path_root + drawJson.defaultPath_cute + "SR/");
    cardpool.R = getAllFileName(path_root + drawJson.defaultPath_cute + "R/");
  }
  else if (drawJson.cardpool[i].type === "Cool") {
    cardpool.SSR = getAllFileName(path_root + drawJson.defaultPath_cool + "SSR/");
    cardpool.SR = getAllFileName(path_root + drawJson.defaultPath_cool + "SR/");
    cardpool.R = getAllFileName(path_root + drawJson.defaultPath_cool + "R/");
  }
  else if (drawJson.cardpool[i].type === "Passion") {
    cardpool.SSR = getAllFileName(path_root + drawJson.defaultPath_passion + "SSR/");
    cardpool.SR = getAllFileName(path_root + drawJson.defaultPath_passion + "SR/");
    cardpool.R = getAllFileName(path_root + drawJson.defaultPath_passion + "R/");
  }
  else if (drawJson.cardpool[i].type === "Normal") {
    drawJson.defaultPath_cute;
    drawJson.defaultPath_cool;
    drawJson.defaultPath_passion;
  }
  else if (drawJson.cardpool[i].type === "Special") {
    drawJson.defaultPath_cute;
    drawJson.defaultPath_cool;
    drawJson.defaultPath_passion;
    drawJson.defaultPath_Bo_SSR;
    drawJson.defaultPath_Bo_SR;
  }
  else if (drawJson.cardpool[i].type === "DoubleSpecial") {
    drawJson.defaultPath_cute;
    drawJson.defaultPath_cool;
    drawJson.defaultPath_passion;
    drawJson.defaultPath_Bo_SSR;
    drawJson.defaultPath_Bo_SR;
  }
  return cardpool;
}

function getAllFileName(path) {
  let array = [];
  fs.readdirSync(path).forEach(file => {
    if (file !== undefined)
      array.push(path + file);
  });
  return array;
}

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

function DrawOtionParser(message) {
  // default value
  let drawOpt = {
    pool_index: drawJson.cardpool.length,
    count: 10
  }
  // =============
  let N = /^[0-9]*[1-9][0-9]*$/; // N: natural number
  let parse = optset(("garbage_str " + message.content).split(/ +/g), 'hi:c:i:');
  while ((opt = parse.getopt()) !== undefined) {
    switch (opt.option) {
      case 'h':
        Help(message);
        return undefined;
      case 'c':
        if (N.test(opt.arg) && opt.arg <= drawJson.cardpool.length) drawOpt.pool_index = parseInt(opt.arg);
        else {
          Help(message);
          return undefined;
        }
        break;
      case 'n':
        if (N.test(opt.arg) && opt.arg <= 10) drawOpt.count = parseInt(opt.arg);
        else {
          Help(message);
          return undefined;
        }
        break;
      case 'i':
        if (opt.arg.toLowerCase() === "all" || (N.test(opt.arg) && opt.arg <= drawJson.cardpool.length))
          ShowCardPoolInfo(opt.arg);
        else
          Help(message);
        return undefined;
      default:
        Help(message);
        return undefined;
    }
  }

  return drawOpt;
}

function ShowCardPoolInfo() {
  ;
}