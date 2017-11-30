const fs = require('fs');
const optset = require('getopt-c');
const images = require('images');
const path_root = process.cwd();
const drawJson = requireUncached(path_root + "/src/data/config_json/draw.json");
const basicbase = 100 // lowest 0.0x%
const testModeCount = 1000000;

module.exports = function (client, message) {
  let card = [];
  let cardpool = undefined;
  let mergeImageBuffer = undefined;
  let userOpt = undefined;
  let count = 0;
  if ((userOpt = DrawOtionParser(message)) === undefined) return;

  cardpool = setCardPool(userOpt.pool_index);
  
  if (userOpt.testMode) 
    userOpt.count = parseInt(testModeCount);

  for (let i = 0; i < userOpt.count; i++) { 
    if (userOpt.bugMode)
      card.push(GetACard(cardpool, "SSR"));
    else if (!userOpt.testMode && i === 9 && !card.find(c => {return c.type === "SSR" || c.type === "SR"})) // check one SR or SSR at least? 
      card.push(GetACard(cardpool, "SR"));
    else
      card.push(GetACard(cardpool));
  }

  if (userOpt.testMode) {
    let numOfSSR = 0, numOfSR = 0, numOfR = 0;
    let numOfboSSR = 0, numOfboSR = 0;
    for (let i = 0 ; i < userOpt.count; i++) {
      if (card[i].type === "bounsSSR") numOfboSSR++;
      else if (card[i].type === "SSR" || card[i].type === "double_bounsSSR") numOfSSR++;
      else if (card[i].type === "bounsSR") numOfboSR++;
      else if (card[i].type === "SR" || card[i].type === "SR") numOfSR++;
      else if (card[i].type === "R") numOfR++;
    }
    message.channel.send("<@" + message.author.id + ">" +
      "```\n" +
      "抽到所有SSR卡共 " + addThousandComma(numOfboSSR + numOfSSR) + "張(約" + (Math.floor((numOfboSSR + numOfSSR) / userOpt.count * 1000000) / 10000) + "%)" + " ; 抽到本次加成SSR卡 " + addThousandComma(numOfboSSR) + "張(約" + (Math.floor(numOfboSSR / userOpt.count * 1000000) / 10000) + "%)\n" +
      "抽到所有SR卡共 " + addThousandComma(numOfboSR + numOfSR) + "張(約" + (Math.floor((numOfboSR + numOfSR) / userOpt.count * 1000000) / 10000) + "%)" + " ; 抽到本次加成SR卡 " + addThousandComma(numOfboSR) + "張(約" + (Math.floor(numOfboSR / userOpt.count * 1000000) / 10000) + "%)\n" +
      "抽到所有R卡共 " + addThousandComma(numOfR) + "張(約" + (Math.floor(numOfR / userOpt.count * 1000000) / 10000) + "%)\n" +
      "\n共" + addThousandComma(numOfboSSR + numOfSSR + numOfboSR + numOfSR + numOfR) + "張\n" +
      "```"
    );
  }
  else {
    mergeImageBuffer = MergeCard(card);
    message.channel.send("<@" + message.author.id + ">", {
      file: mergeImageBuffer
    });
  }
};

function Help(message) {
  message.channel.send(
    "```\n" +
    "command " + message.content.split(" ")[0] + "(暫時把計算和紀錄砍掉..回復時間未知)\n" +
    "   -h       :help\n" +
    "   -b       :bug mode\n" +
    "   -t       :測試機率用(抽" + addThousandComma(testModeCount) + "抽，不附圖)\n" +
    "   -c choose:數字, 選一個卡池1~" + drawJson.cardpool.length + "(default: " + drawJson.cardpool.length + "號卡池)\n" +
    "   -n num   :數字, 數量1~10(default: 10)\n" +
    "   -i info  :卡池資訊\n" +
    "      info  :\"all\" or \"數字編號\"\n" +
    "\n" +
    "Example:\n" +
    "   draw\n" +
    "   draw -b -c 3\n" +
    "   draw -t -c 2\n" +
    "   draw -n 7 -c 3\n" +
    "   draw -i 4\n" +
    "   draw -c 1\n" +
    "   draw -i all\n" +
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
    else if (cardpool.sp_bo_SSR !== undefined && prob <= cardpool.bo_SSRprob * 2) {
      Card.type = "double_bounsSSR";
      Card.name = cardpool.sp_bo_SSR[Math.floor(Math.random() * cardpool.sp_bo_SSR.length)]; // DoubleBo_SSR, only double special pool
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
    sp_bo_SSR: undefined,
    bo_SSR: undefined,
    bo_SR: undefined,
    SSR: undefined,
    SR: undefined,
    R: undefined
  };
  if (drawJson.cardpool[i].type === "SingleColor") {
    if (drawJson.cardpool[i].name === "Cute") {
      cardpool.SSR = getAllFileName(path_root + drawJson.defaultPath_cute + "SSR/");
      cardpool.SR = getAllFileName(path_root + drawJson.defaultPath_cute + "SR/");
      cardpool.R = getAllFileName(path_root + drawJson.defaultPath_cute + "R/");
    }
    else if (drawJson.cardpool[i].name === "Cool") {
      cardpool.SSR = getAllFileName(path_root + drawJson.defaultPath_cool + "SSR/");
      cardpool.SR = getAllFileName(path_root + drawJson.defaultPath_cool + "SR/");
      cardpool.R = getAllFileName(path_root + drawJson.defaultPath_cool + "R/");
    }
    else if (drawJson.cardpool[i].name === "Passion") {
      cardpool.SSR = getAllFileName(path_root + drawJson.defaultPath_passion + "SSR/");
      cardpool.SR = getAllFileName(path_root + drawJson.defaultPath_passion + "SR/");
      cardpool.R = getAllFileName(path_root + drawJson.defaultPath_passion + "R/");
    }
  }
  else {
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
    // === DoubleSpecial setting ===
    if (drawJson.cardpool[i].type === "DoubleSpecial") {
      cardpool.sp_bo_SSR = getAllFileName(path_root + drawJson.defaultPath_doubleSpecialSSR, cardpool.bo_SSR);
      cardpool.Rprob -= cardpool.SSRprob; 
      cardpool.SSRprob *= 2; 
    }
  }
  return cardpool;
}

function getAllFileName(path, cardpool) {
  // if the cardpool include same SSR/SR(bouns) card, it is not added to array
  let array = [];
  fs.readdirSync(path).forEach(file => {
    if (file === undefined || file === ".gitignore");
    else if (cardpool === undefined)
      array.push(path + file);
    else if (!cardpool.find(pool => { return pool.includes(file) }))
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
    testMode: false,
    bugMode: false,
    pool_index: drawJson.cardpool.length,
    count: 10
  }
  // =============
  let N = /^[0-9]*[1-9][0-9]*$/; // N: natural number
  let parse = optset(("garbage_str " + message.content).split(/ +/g), 'hbtc:n:i:');
  while ((opt = parse.getopt()) !== undefined) {
    switch (opt.option) {
      case 'h':
        Help(message);
        return undefined;
      case 'c':
        if (opt.arg !== undefined && N.test(opt.arg) && opt.arg <= drawJson.cardpool.length) drawOpt.pool_index = parseInt(opt.arg);
        else {
          Help(message);
          return undefined;
        }
        break;
      case 'n':
        if (opt.arg !== undefined && N.test(opt.arg) && opt.arg <= 10) drawOpt.count = parseInt(opt.arg);
        else {
          Help(message);
          return undefined;
        }
        break;
      case 'i':
        if (opt.arg !== undefined && opt.arg.toLowerCase() === "all" || (N.test(opt.arg) && opt.arg <= drawJson.cardpool.length))
          ShowCardPoolInfo(message, opt.arg);
        else
          Help(message);
        return undefined;
      case 'b':
        drawOpt.bugMode = true;
        break;
      case 't':
        drawOpt.testMode = true;
        break;
      default:
        Help(message);
        return undefined;
    }
  }

  return drawOpt;
}

function ShowCardPoolInfo(message, arg) {
  let info = "```\n";
  if (arg.toLowerCase() === "all") {
    for (let i = 0; i < drawJson.cardpool.length; i++) {
      if (i !== 0) info += "\n";
      // index
      info += "卡池編號: " + drawJson.cardpool[i].index + "\n";
      // name
      if (drawJson.cardpool[i].name === undefined) {
        info += "卡池名稱: "
        fs.readdirSync(path_root + drawJson.defaultPath_bounsSSR + drawJson.cardpool[i].index + "/").forEach(file => {
          if (file !== undefined)
            info += file.slice(0, file.lastIndexOf(".")) + ", ";
        });
        info = info.slice(0, info.length - 2) + "\n";
      }
      else
        info += "卡池名稱: " + drawJson.cardpool[i].name + "\n";
      // date
      drawJson.cardpool[i].date !== undefined ? info += "開始時間: " + drawJson.cardpool[i].date + "\n" : "";
      // type
      if (drawJson.cardpool[i].type === "Normal") info += "卡池類型: 常駐\n";
      else if (drawJson.cardpool[i].type === "Special") info += "卡池類型: 限定\n";
      else if (drawJson.cardpool[i].type === "DoubleSpecial") info += "卡池類型: 灰限\n";
      else if (drawJson.cardpool[i].type === "SingleColor") info += "卡池類型: 單色池\n";
    }
  }
  else {
    let i = arg - 1;
    let bo_SSR = [];
    // date
    drawJson.cardpool[i].date !== undefined ? info += "開始時間: " + drawJson.cardpool[i].date + "\n" : "";
    // name
    if (drawJson.cardpool[i].name === undefined) {
      info += "卡池名稱: "
      fs.readdirSync(path_root + drawJson.defaultPath_bounsSSR + drawJson.cardpool[i].index + "/").forEach(file => {
        if (file !== undefined) {
          bo_SSR.push(file.slice(0, file.lastIndexOf(".")));
          info += file.slice(0, file.lastIndexOf(".")) + ", ";
        }
      });
      info = info.slice(0, info.length - 2) + "\n";
    }
    else
      info += "卡池名稱: " + drawJson.cardpool[i].name + "\n";
    // type
    if (drawJson.cardpool[i].type === "SingleColor") {
      info += "卡池類型: 單色池\n";
      info += "機率: (SSR:" + drawJson.SSRprob + ", SR:" + drawJson.SRprob + ", R:" + drawJson.Rprob + ")\n";
      if (drawJson.cardpool[i].name === "Cute") SSR = getAllFileName(path_root + drawJson.defaultPath_cute + "SSR/");
      else if (drawJson.cardpool[i].name === "Cool") SSR = getAllFileName(path_root + drawJson.defaultPath_cool + "SSR/");
      else if (drawJson.cardpool[i].name === "Passion") SSR = getAllFileName(path_root + drawJson.defaultPath_passion + "SSR/");
      info += "  SSR一共有" + SSR.length + "張, 故每張SSR機率為" + Math.floor(parseFloat(drawJson.SSRprob) * basicbase / SSR.length) / basicbase + "%\n";
    }
    else if (drawJson.cardpool[i].type === "Normal") {
      info += "卡池類型: 常駐\n";
      info += "機率: (SSR:" + drawJson.SSRprob + ", SR:" + drawJson.SRprob + ", R:" + drawJson.Rprob + ")\n";
      for (let j = 0; j < bo_SSR.length; j++)
        info += "   " + parseFloat(drawJson.cardpool[i].bounsSSRprob) / bo_SSR.length + "% " + bo_SSR[j] + "\n";
    }
    else if (drawJson.cardpool[i].type === "Special") {
      info += "卡池類型: 限定\n";
      info += "機率: (SSR:" + drawJson.SSRprob + ", SR:" + drawJson.SRprob + ", R:" + drawJson.Rprob + ")\n";
      for (let j = 0; j < bo_SSR.length; j++)
        info += "   " + parseFloat(drawJson.cardpool[i].bounsSSRprob) / bo_SSR.length + "% " + bo_SSR[j] + "\n";
    }
    else if (drawJson.cardpool[i].type === "DoubleSpecial") {
      info += "卡池類型: 灰限\n";
      info += "機率: (SSR:" + parseFloat(drawJson.SSRprob) * 2 + ".0%, SR:" + drawJson.SRprob + ", R:" + (parseFloat(drawJson.Rprob) - parseFloat(drawJson.SSRprob)) + ".0%)\n";
      for (let j = 0; j < bo_SSR.length; j++) 
        info += "   " + parseFloat(drawJson.cardpool[i].bounsSSRprob) / bo_SSR.length + "% " + bo_SSR[j] + "\n";
    }
  }
  info += "```";
  message.channel.send(info);
}

function addThousandComma(number) {
  let num = number.toString();
  let pattern = /(-?\d+)(\d{3})/;

  while (pattern.test(num))
    num = num.replace(pattern, "$1,$2");

  return num;
}