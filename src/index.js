const Discord = require('./client/chihiro.js');
const fs = require('fs');
const client = new Discord.Client();
// === command file ===
client.registry(__dirname + '/commands/user');
client.registry(__dirname + '/commands/maneger');
// === end command file ===

// The token of your bot - https://discordapp.com/developers/applications/me
var cert = requireUncached('./certificate.json');
client.login(cert.token);
// finish


client.on('ready', async() => {
  console.log(`Logged in as ${client.user.tag} !`);
  cert = requireUncached('./certificate.json');
  let newPresenceObj = {
    afk: false,
    game: {
      name: cert.prefix + "help"
    }
  }
  await client.user.setPresence(newPresenceObj);
});

client.on('message', message => {
  cert = requireUncached('./certificate.json');
  let prefix = cert.prefix;
  if (message.author.bot || message.channel.type !== "text") return;
  else {
    fs.access(__dirname + '/commands/secret/secret.js', function (err) {
      if (err) console.log(err);
      else {
        let secret = require('./commands/secret/secret.js');
        secret(client, message);
      }
    });
  }

  if (!message.content.startsWith(prefix)) return;
  else {
    message.content = message.content.slice(prefix.length);
    client.messagesParse(message);
  }
});

client.on('guildMemberAdd', member => {
  let firstTextCh = member.guild.channels.filter(c => c.type === "text" && c.permissionsFor(member.guild.me).has("SEND_MESSAGES")).sort((a, b) => a.position - b.position || a.id - b.id).first();
  if (firstTextCh === undefined) return;
  firstTextCh.send(`歡迎${member} 進來就別再出去瞜`);
});

client.on('guildMemberRemove', member => {
  let firstTextCh = member.guild.channels.filter(c => c.type === "text" && c.permissionsFor(member.guild.me).has("SEND_MESSAGES")).sort((a, b) => a.position - b.position || a.id - b.id).first();
  if (firstTextCh === undefined) return;
  firstTextCh.send(`${member} 離開了.....?`);
});

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}





// // Create an event listener for messages
// client.on('message', message => {
//   let prefix = cert.prefix;
//   // our new check:
//   if (!message.content.startsWith(prefix) || message.author.bot) return;
//   // [rest of the code]

//   let command = message.content.split(" ")[0];

//   // If the message is "ping"
//   if (command === (prefix + 'ping')) {
//     // Send "pong" to the same channel
//     message.channel.send('pong');
//   } else if (command === (prefix + 'test1')) {
//     message.reply(message.author.avatarURL);
//   } else if (command === (prefix + 'test2')) {
//     message.channel.send(message.channel.id);
//   } else if (command === (prefix + 'test3')) {
//     message.channel.send(message.channel.type);
//   } else if (command === (prefix + 'test4')) {
//     message.delete(2000)
//       .then() // Success
//       .catch(console.error); // Log error
//   } else if (command === (prefix + 'test5')) {
//     message.channel.send(client.ping);
//   } else if (command === (prefix + 'test6')) {
//     message.edit(123, {
//       embed: {
//         title: "hello",
//         url: "http://google.com",
//         color: 3447003
//       }
//     });
//   } else if (command === (prefix + 'test7')) {
//     message.channel.fetchMessages({
//         limit: new Number(100)
//       })
//       .then(messages => {
//         let msg_array = messages.array();
//         msg_array = msg_array.filter(m => m.author.id === client.user.id);
//         if (msg_array.length == 1) msg_array.map(m => {
//           m.delete().catch(console.error)
//         });
//         else if (msg_array.length >= 2) message.channel.bulkDelete(msg_array);
//         else;
//       })
//       .catch(console.error);
//     message.delete(2000);
//   } else if (command === (prefix + 'test8')) {
//     message.author.send("Hello!");
//   } else if (command === (prefix + 'test9')) {
//     let id = "325146065282007040";
//     let content = "smallbomb";
//     const EditMessage = async(id, content) => {
//       const Message = await message.channel.fetchMessage(id); // Async
//       return Message.edit(content);
//     };
//     EditMessage(id, content);
//   } else if (command === (prefix + 'test10')) {
//     message.channel.send('test2');
//   } else if (command === (prefix + 'test11')) {
//     message.channel.send({
//       embed: {
//         title: "123",
//         author: {
//           name: client.user.username,
//           icon_url: client.user.avatarURL
//         },
//         url: "http://www.google.com",
//         timestamp: new Date(),
//         color: 3447003,
//         footer: {
//           icon_url: message.author.avatarURL,
//           text: "© Example"
//         },
//         description: "This is a test embed to showcase what they look like and what they can do.",
//       }
//     });

//   } else if (command === (prefix + 'test12')) {
//     message.author.createDM()
//       .then()
//       .catch(console.error);
//   } else if (command === (prefix + 'prefix')) {
//     let newPrefix = message.content.split(" ").slice(1, 2)[0];
//     cert.prefix = newPrefix;
//     fs.writeFile("./certificate.json", JSON.stringify(cert), (err) => console.error);
//     message.channel.send(`now Prefix='${newPrefix}'`);
//   } else if (command === (prefix + 'setgame')) {
//     client.user.setPresence({
//       afk: true,
//       status: "dnd",
//       game: {
//         name: "デレステ",
//         url: "https://www.twitch.tv/nmw_tw"
//       }
//     });
//   } else if (command === (prefix + 'neko')) {
//     message.reply("hello", {
//       file: "./neko.jpg"
//     });
//   }

// });