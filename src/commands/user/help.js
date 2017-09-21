module.exports = function (client, message) {
  let newArray = client.commandarray.group(function (item) {
    return item.group;
  });
 
  let helpstr = "```";
  helpstr += "Command list:\n"
  for (let i = 0; i < newArray.length; i++) {
    helpstr += "   " + newArray[i].key + " type:\n";
    for (let j = 0; j < newArray[i].data.length; j++) {
      helpstr += "      " + newArray[i].data[j].commandname + "\n";
    }
  }
  helpstr += "```";
  message.author.send(helpstr);
};

Object.defineProperty(Array.prototype, 'group', {
  enumerable: false,
  value: function (key) {
    let map = {};
    this.forEach(function (e) {
      let k = key(e);
      map[k] = map[k] || [];
      map[k].push(e);
    });
    return Object.keys(map).map(function (k) {
      return {key: k, data: map[k]};
    });
  }
});