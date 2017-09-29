const optset = require('getopt-c');
const images = require('images');
const jsonObj = requireUncached("../config_json/draw.json");

module.exports = function (client, message) {
  let card = undefined;
  let userOpt = DrawOtionParser(message);
  // let images1 = images("./src/data/images/lots/凶.png");
  // let images2 = images("./src/data/images/lots/大凶.png");
  // let merge_images = images(images1.width() + 10 + images2.width(), images1.height()).draw(images1, 0, 0).draw(images2, images1.width()+10, 0);
  // merge_images.save("output.jpg");
  return ;
  for (let i = 0; i < userOpt.drawcount; i++) {
    card = GetACard(userOpt.pool_index, "SSR");
  




  }
};

function Help(message) {
  message.channel.send(
    "```\n" +
    "command " + message.content.split(" ")[0] + "\n" +
    "```"
  );
}

function GetACard(index, str) {
  let cardType = undefined;
  if (str === "SSR")
    cardType = Math.floor(Math.random() * 100 + 15);
  else if (str === "SR")
    return;
  else if (str === "R")
    return;
}

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

function DrawOtionParser(message) {
  let r = /^[0-9]*[1-9][0-9]*$/; // N: natural number
  // default value
  let drawcount = 10;
  let pool_index = jsonObj.cardpool.length;
  // =============
  let parse = optset(("garbage_str " + message.content).split(/ +/g), 'hi:c:');
  while ((opt = parse.getopt()) !== undefined) {
    switch (opt.option) {
      case 'h':
        Help(message);
        return undefined;
      case 'i':
        if(r.test(opt.arg) && opt.arg > jsonObj.cardpool.length) {
          Help(message);
          return undefined;
        }
        pool_index = opt.arg;
        break;
      case 'c':
        if (r.test(opt.arg) && opt.arg <= 10) drawcount = parseInt(opt.arg);
        else return undefined ;
        break;
      default:
        Help(message);
        return undefined;
    }
  }

  return {
    pool_index: pool_index,
    drawcount: drawcount,
  };
}