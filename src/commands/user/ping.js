module.exports = async function (client, message) {
  const m = await message.channel.send("Ping?");
  m.edit(`${m.createdTimestamp - message.createdTimestamp}ms.`);
};