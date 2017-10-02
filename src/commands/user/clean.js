const two_week_milliseconds = 60 * 60 * 24 * 7 * 2 * 1000;

module.exports = async function (client, message) {
  let msg_array = await message.channel.fetchMessages({ limit: 100 });
  msg_array = msg_array.array().filter(old_m => old_m.author.id === client.user.id && old_m.id !== message.id && Date.now() - old_m.createdTimestamp < two_week_milliseconds);
  if (msg_array.length == 1) msg_array.map(async m => await m.delete().catch(console.error));
  else if (msg_array.length >= 2) await message.channel.bulkDelete(msg_array, true).catch(console.error);

  await message.delete(1000);
  message.channel.send("clean done");
};