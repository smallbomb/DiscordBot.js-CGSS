module.exports = async function (client, message) {
  const m = await message.channel.send("你的聲音我聽見了!");
  m.edit(`你的聲音我聽見了! 大概在${m.createdTimestamp - message.createdTimestamp}ms後聽見的`);
};