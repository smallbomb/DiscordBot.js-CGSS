const fs = require('fs');
const optset = require('getopt-c');
const images = require('images');
const drawJson = requireUncached("../config_json/draw.json");
const path_root = process.cwd();
const basicbase = 100 // lowest 0.0x%

module.exports = function (client, message) {
  let card = [];
  let cardpool = undefined;
  let mergeImageBuffer = undefined;
  let userOpt = undefined;
  let count = 0;
  if ((userOpt = DrawOtionParser(message)) === undefined) return;

  cardpool = setCardPool(userOpt.pool_index);
  for (let i = 0; i < userOpt.count; i++) { 
    if (i === 9 && !card.find(c => {return c.type === "SSR" || c.type === "SR"})) // check one SR or SSR at least? 
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
    "command " + message.content.split(" ")[0] + "(暫時把計算和紀錄砍掉..回復時間未知)\n" +
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
  if (str === "SSR")
    prob = Math.floor(Math.random() * cardpool.SSRprob) + 1;
  else if (str === "SR")
    prob = Math.floor(Math.random() * cardpool.SRprob) + cardpool.SSRprob + 1;
  else if (str === "R")
    prob = Math.floor(Math.random() * cardpool.Rprob) + cardpool.SSRprob + cardpool.SRprob + 1;
  else
    prob = Math.floor(Math.random() * (cardpool.SSRprob + cardpool.SRprob + cardpool.Rprob)) + 1;
   
  if (prob <= cardpool.SSRprob) {
    if (prob <= cardpool.bo_SSRprob) {
      Card.type = "bounsSSR";
      Card.name = cardpool.bo_SSR[Math.floor(Math.random() * cardpool.bo_SSR.length)]; // bounsSSR
    }
    else {
      Card.type = "SSR";
      Card.name = cardpool.SSR[Math.floor(Math.random() * cardpool.SSR.length)];
    }
  }
  else if (prob <= cardpool.SSRprob + cardpool.SRprob) {
    if (prob <= cardpool.SSRprob + cardpool.bo_SRprob) {
      Card.type = "bounsSR";
      Card.name = cardpool.bo_SR[Math.floor(Math.random() * cardpool.bo_SR.length)]; // bounsSR
    }
    else { 
      Card.type = "SR";
      Card.name = cardpool.SR[Math.floor(Math.random() * cardpool.SR.length)];
    }
  }
  else if (prob <= cardpool.SSRprob + cardpool.SRprob + cardpool.Rprob) {
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
  let cardpool = {
    SSRprob: parseFloat(drawJson.SSRprob) * basicbase,
    SRprob: parseFloat(drawJson.SRprob) * basicbase,
    Rprob: parseFloat(drawJson.Rprob) * basicbase,
    bo_SSRprob: 0,
    bo_SRprob: 0,
    bo_SSR: undefined,
    bo_SR: undefined,
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
  else {
    if (drawJson.cardpool[i].type === "DoubleSpecial") {
      cardpool.Rprob -= cardpool.SSRprob;
      cardpool.SSRprob *= 2;
    }
    // === bouns SSR/SR prob ===
    cardpool.bo_SSRprob = parseFloat(drawJson.cardpool[i].bounsSSRprob) * basicbase; 
    cardpool.bo_SRprob = parseFloat(drawJson.cardpool[i].bounsSRprob) * basicbase; 
    // === bouns SR/SR ===
    cardpool.bo_SSR = getAllFileName(path_root + drawJson.defaultPath_bounsSSR + index + "/");
    cardpool.bo_SR = getAllFileName(path_root + drawJson.defaultPath_bounsSR + index + "/");
    // === default SSR ===
    cardpool.SSR = getAllFileName(path_root + drawJson.defaultPath_cute + "SSR/", cardpool.bo_SSR);
    cardpool.SSR.push.apply(cardpool.SSR, getAllFileName(path_root + drawJson.defaultPath_cool + "SSR/", cardpool.bo_SSR));
    cardpool.SSR.push.apply(cardpool.SSR, getAllFileName(path_root + drawJson.defaultPath_passion + "SSR/", cardpool.bo_SSR));
    // === default SR ===
    cardpool.SR = getAllFileName(path_root + drawJson.defaultPath_cute + "SR/", cardpool.bo_SR);
    cardpool.SR.push.apply(cardpool.SR, getAllFileName(path_root + drawJson.defaultPath_cool + "SR/", cardpool.bo_SR));
    cardpool.SR.push.apply(cardpool.SR, getAllFileName(path_root + drawJson.defaultPath_passion + "SR/", cardpool.bo_SR));
    // === default R ===
    cardpool.R = getAllFileName(path_root + drawJson.defaultPath_cute + "R/");
    cardpool.R.push.apply(cardpool.R, getAllFileName(path_root + drawJson.defaultPath_cool + "R/"));
    cardpool.R.push.apply(cardpool.R, getAllFileName(path_root + drawJson.defaultPath_passion + "R/"));
    // if (drawJson.cardpool[i].type === "Normal") {
    // }
    // else if (drawJson.cardpool[i].type === "Special") {
    // }
    // else if (drawJson.cardpool[i].type === "DoubleSpecial") {
    // }
  }
  return cardpool;
}

function getAllFileName(path, cardpool) {
  // if the cardpool include same SSR/SR(bouns) card, it is not added to array
  let array = [];
  fs.readdirSync(path).forEach(file => {
    if (file === undefined);
    else if (cardpool === undefined)
      array.push(path + file); 
    else if (!cardpool.find(pool => {return pool.includes(file)})) 
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
  let parse = optset(("garbage_str " + message.content).split(/ +/g), 'hc:n:i:');
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
  let info = "```\n";
  // index
  info += "卡池編號: " + drawJson.cardpool[i].index + "\n";
  // name
  info += "卡池名稱: " + drawJson.cardpool[i].cardname + "\n";
  // type
  if (drawJson.cardpool[i].type === "Normal") info += "卡池類型: 常駐\n";
  else if (drawJson.cardpool[i].type === "Special") info += "卡池類型: 限定\n";
  else if (drawJson.cardpool[i].type === "DoubleSpecial") info += "卡池類型: 灰限\n";
  else info += "卡池類型: " + drawJson.cardpool[i].type + "\n";
  // date
  info += "開始時間: " + drawJson.cardpool[i].date + "\n";
  info += "```";
  message.channel.send(info);
}