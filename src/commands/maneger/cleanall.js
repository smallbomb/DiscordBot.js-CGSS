const ownerID = require('../../certificate.json').ownerID;

module.exports = async function (client, message) {
  if (message.author.id === ownerID) {
    let temp = client.guilds.find('id', message.guild.id).channels.find('id', message.channel.id);

    console.log(temp);
    return;
    await message.channel.bulkDelete(10000);
    await message.delete(500);
    message.channel.send("cleanAll done");
  }
};