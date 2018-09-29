/*
Simply find and replace instances below with the coin and symbol you want to use!
search and replace with case sensitivity!!
example:
1. cryptofightclub coin   = ethereum
2. CryptoFightClub Coin   = Ethereum
3. cfcc        = eth
4. CFCC        = ETH
*/

'use strict';

const bitcoin = require('bitcoin'); //leave as const bitcoin = require('bitcoin');
const Discord = require('discord.js');
let bot = new Discord.Client();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';


let Regex = require('regex'),
  config = require('config'),
  spamchannels = config.get('moderation').botspamchannels;
let walletConfig = config.get('cryptofightclubd');
const cfcc = new bitcoin.Client(walletConfig); //leave as = new bitcoin.Client(walletConfig)

exports.commands = ['directCommands', 'tipcfcc'];
exports.tipcfcc = {
  usage: '<subcommand>',
  description:
   '__**CryptoFightClub Coin Tipper**__\n    **"bal** : get your balance\n    **"deposit** : get address for your deposits\n    **"withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **"tip <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **"tip private <user> <amount>** : put private before Mentioning a user to tip them privately.\n    **"soak <AMOUNT>** : gives coins to all Active users.\n.   **"rain <AMOUNT>** : gives coins to users who have sent a message recently.\n    **"drizzle <AMOUNT>** : gives coins to the last 5 active users.\n' +
          '    **"price** : get price of CryptoFightClub coin\n    **"block** : get current block height\n    **"supply** : get # of CryptoFightClub coins are in supply\n',
  process: async function(bot, msg, suffix) {
    let tipper = msg.author.id.replace('!', ''),
      words = msg.content
        .trim()
        .split(' ')
        .filter(function(n) {
          return n !== '';
        }),
      subcommand = words.length >= 2 ? words[1] : 'help',
      helpmsg =
        '__**CryptoFightClub Coin Tipper**__\n    **"bal** : get your balance\n    **"deposit** : get address for your deposits\n    **"withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **"tip <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **"tip private <user> <amount>** : put private before Mentioning a user to tip them privately.\n    **"soak <AMOUNT>** : gives coins to all Active users.\n.   **"rain <AMOUNT>** : gives coins to users who have sent a message recently.\n    **"drizzle <AMOUNT>** : gives coins to the last 5 active users.\n' +
          '    **"price** : get price of CryptoFightClub coin\n    **"block** : get current block height\n    **"supply** : get # of CryptoFightClub coins are in supply\n',
      channelwarning = 'Please use <#bot-spam> or DMs to talk to bots.';
    switch (subcommand) {
      case 'help':
        privateorSpamChannel(msg, channelwarning, doHelp, [helpmsg]);
        break;
      case 'balance':
        doBalance(msg, tipper);
        break;
      case 'deposit':
        privateorSpamChannel(msg, channelwarning, doDeposit, [tipper]);
        break;
      case 'withdraw':
        privateorSpamChannel(msg, channelwarning, doWithdraw, [tipper, words, helpmsg]);
        break;
      case 'soak':
        doSoakRainDrizzle(bot, msg, tipper, words, helpmsg, "soak");
        break;
      case 'rain':
        doSoakRainDrizzle(bot, msg, tipper, words, helpmsg, "rain");
        break;
      case 'drizzle':
        doSoakRainDrizzle(bot, msg, tipper, words, helpmsg, "drizzle");
        break;
      default:
        doTip(bot, msg, tipper, words, helpmsg);
    }
  }
};

exports.directCommands = {
  usage: '<subcommand>',
  description:
    '__**CryptoFightClub Coin Tipper**__\n    **"bal** : get your balance\n    **"deposit** : get address for your deposits\n    **"withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **"tip <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **"tip private <user> <amount>** : put private before Mentioning a user to tip them privately.\n    **"soak <AMOUNT>** : gives coins to all Active users.\n.   **"rain <AMOUNT>** : gives coins to users who have sent a message recently.\n    **"drizzle <AMOUNT>** : gives coins to the last 5 active users.\n' +
      '    **$price** : get price of CryptoFightClub coin\n    **"block** : get current block height\n    **"supply** : get # of CryptpFightClub coins are in supply\n',
  process: async function(bot, msg, suffix) {
    let tipper = msg.author.id.replace('$', ''),
    words = msg.content
      .replace('$', '')
      .trim()
      .split(' ')
      .filter(function(n) {
        return n !== '';
      }),
    subcommand = words.length >= 1 ? words[0] : 'help',
    cmdOffset = "-1",
    helpmsg =
      '__**CryptoFightClub Coin Tipper**__\n    **"bal** : get your balance\n    **"deposit** : get address for your deposits\n    **"withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **"tip <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **"tip private <user> <amount>** : put private before Mentioning a user to tip them privately.\n    **"soak <AMOUNT>** : gives coins to all Active users.\n.   **"rain <AMOUNT>** : gives coins to users who have sent a message recently.\n    **"drizzle <AMOUNT>** : gives coins to the last 5 active users.\n' +
        '    **"price** : get price of CryptoFightClub coin\n    **"block** : get current block height\n    **"supply** : get # of CryptoFightClub coins are in supply\n',
    channelwarning = 'Please use <#bot-spam> or DMs to talk to bots.';
    switch (subcommand) {
      case 'tip':
        doTip(bot, msg, tipper, words, helpmsg, cmdOffset);
        break;
      case 'bal':
        doBalance(msg, tipper);
        break;
      case 'deposit':
        privateorSpamChannel(msg, channelwarning, doDeposit, [tipper]);
        break;
      case 'withdraw':
        privateorSpamChannel(msg, channelwarning, doWithdraw, [tipper, words, helpmsg, cmdOffset]);
        break;
      case 'soak':
        doSoakRainDrizzle(bot, msg, tipper, words, helpmsg, "soak", cmdOffset);
        break;
      case 'rain':
        doSoakRainDrizzle(bot, msg, tipper, words, helpmsg, "rain", cmdOffset);
        break;
      case 'drizzle':
        doSoakRainDrizzle(bot, msg, tipper, words, helpmsg, "drizzle", cmdOffset);
        break;
      case 'price':
        getPrice(bot, msg);
        break;
      case 'block':
        getBlock(bot, msg);
        break;
      case 'avatar':
        getavatar(bot, msg, words);
        break;
      // case 'weight':
      //   getWeight(bot, msg);
      //   break;
      case 'supply':
        getSupply(bot, msg);
        break;
      default:
        privateorSpamChannel(msg, channelwarning, doHelp, [helpmsg]);
    }
  }
};

function privateorSpamChannel(message, wrongchannelmsg, fn, args) {
  if (!inPrivateorSpamChannel(message)) {
    message.reply(wrongchannelmsg);
    return;
  }
  fn.apply(null, [message, ...args]);
}

function doHelp(message, helpmsg) {
  message.author.send(helpmsg);
}

function doBalance(message, tipper) {
  cfcc.getBalance(tipper, 1, function(err, balance) {
    if (err) {
      message.reply('Error getting CryptoFightClub balance.').then(message => message.delete(5000));
    } else {
      message.reply('You have **' + balance + ' CFCC** :moneybag:');
    }
  });
}

function doDeposit(message, tipper) {
  getAddress(tipper, function(err, address) {
    if (err) {
      message.reply('Error getting your CryptoFightClub deposit address.').then(message => message.delete(5000));
    } else {
      message.reply('Your CryptoFightClub (CFCC) address is ' + address);
    }
  });
}

function doWithdraw(message, tipper, words, helpmsg, cmdOffset) {
  cmdOffset = cmdOffset?cmdOffset:"+0";
  if (words.length < eval("4"+cmdOffset)) {
    doHelp(message, helpmsg);
    return;
  }

  var address = words[eval("2"+cmdOffset)],
    amount = getValidatedAmount(words[eval("3"+cmdOffset)]);

  if (amount === null) {
    message.reply("I don't know how to withdraw that many CryptoFightClub coins...").then(message => message.delete(5000));
    return;
  }

  cfcc.getBalance(tipper, function(err, balance) {
    if (amount < balance) {
      cfcc.sendFrom(tipper, address, Number(amount-0.00001), function(err, txId) {
        if (err) {
          message.reply("Balance Error: " + err.message).then(message => message.delete(5000));
        } else {
          message.reply('You withdrew ' + amount + ' CFCC to ' + address + '\n' + txLink(txId) + '\n');
        }
      });
    } else {
      message.reply("Account has insufficient funds").then(message => message.delete(5000));
    }
  });

}

function doTip(bot, message, tipper, words, helpmsg, cmdOffset) {
  cmdOffset = cmdOffset?cmdOffset:"+0";
  if (words.length < eval("4"+cmdOffset) || !words) {
    doHelp(message, helpmsg);
    return;
  }
  var prv = false;
  var amountOffset = eval("3"+cmdOffset);
  if (words.length >= eval("5"+cmdOffset) && words[1] === 'private') {
    prv = true;
    amountOffset = eval("4"+cmdOffset);
  }

  let amount = getValidatedAmount(words[amountOffset]);

  if (amount === null) {
    message.reply("I don't know how to tip that many CryptoFightClub coins...").then(message => message.delete(5000));
    return;
  }
  if (!message.mentions.users.first()){
       message
        .reply('Sorry, I could not find a user in your tip...')
        .then(message => message.delete(5000));
        return;
      }
  if (message.mentions.users.first().id) {
    cfcc.getBalance(tipper, function(err, balance) {
      if (amount < balance) {
        sendCFCC(bot, message, tipper, message.mentions.users.first().id.replace('!', ''), amount, prv);
      } else {
        message.reply("Account has insufficient funds").then(message => message.delete(5000));
      }
    });
  } else {
    message.reply('Sorry, I could not find a user in your tip...').then(message => message.delete(5000));
  }
}

function doSoakRainDrizzle(bot, message, tipper, words, helpmsg, tipType, cmdOffset) {
  cmdOffset = cmdOffset?cmdOffset:"+0";
  if (words.length < eval("3"+cmdOffset) || !words) {
    doHelp(message, helpmsg);
    return;
  }
  var prv = false;
  var amountOffset = eval("2"+cmdOffset);
  if (words.length >= eval("4"+cmdOffset) && words[1] === 'private') {
      prv = true;
      amountOffset = eval("3"+cmdOffset);
  }

  let amount = getValidatedAmount(words[amountOffset]);

  if (amount === null) {
    message.reply("I don't know how to tip that many CryptoFightClub coins...").then(message => message.delete(5000));
    return;
  } else if (amount < 0.0001){
    message.reply("Atleast 0.0001 CFCC is required to rain").then(message => message.delete(5000));
    return;
  }

  cfcc.getBalance(tipper, function(err, balance){
    if(amount < balance){
      let serverid = message.channel.guild.id;
      let members = bot.guilds.get(serverid).members;
      let online = [];
      members.filter(m => {
        if(m.user.presence.status === 'online' && m.user.bot === false && tipper !== m.user.id){
          online.push(m.user);
        }
      });

      if(tipType === "soak") {
        soak(amount, online, onlineUserResponse);
      } else if(tipType === "rain"){
        rain(amount, online, message, onlineUserResponse);
      } else if (tipType === "drizzle"){
        drizzle(amount, online, message, onlineUserResponse);
      }
    } else {
      message.reply("Account has insufficient funds").then(message => message.delete(5000));
    }
    function onlineUserResponse(onlineID, noUserMessage, tippedMessage, setUsernames){
        let shareAmount = amount/onlineID.length;
        if(!onlineID.length){
        message.reply(noUserMessage);
      } else {
        let addresses = {}, i=0;
        onlineID.forEach(function(id){
          getAddress(id, function(err, address) {
            if (err) {
              message.reply("GET address Error: " +err.message).then(message => message.delete(5000));
            } else {
              i++;
              addresses[address] = shareAmount;
              if(onlineID.length === i || i % 100 === 0){
                  sendAll(tipper, addresses, tippedMessage, onlineID.length, i, setUsernames);
                  addresses = {};
              }
            }
          })
        });
      }
    }
    function sendAll (tipper, data, tippedMessage, tl, ind, setUsernames){
        cfcc.sendMany(tipper, data, 2, 'Nemo From Example.com', function(res, tr){
            console.log(res);
            console.log(tr);
        });
        if(tl === ind){
          message.channel.send(tippedMessage);
          if(setUsernames && setUsernames.length > 1){
              for (let j = 1; j < setUsernames.length; j++) {
                  message.channel.send(setUsernames[j]);
              }
            // setUsernames.forEach(function(sun){
              // sendDSRMessages(message, tippedMessage + " " + sun, 0xFAA61B, []);
            // })
          }
          // else {
            // sendDSRMessages(message, tippedMessage, 0xFAA61B, []);
          // }
        }
    }
  });
}

function soak(amount, online, callback){
  let onlineID = [];
  let onlineUsername = "";
  let i=0;
  let setUsernames = [];
  online.forEach(function (user) {
      onlineID.push(user.id);
      onlineUsername = onlineUsername + " <@" + user.id + ">";
      i++;
      if(i === 50){
        setUsernames.push(onlineUsername);
        onlineUsername = "";
      }
  });
  setUsernames.push(onlineUsername);
  callback(onlineID, onlineID.length + " users currently online. No CFCC is rained",
      ":thunder_cloud_rain: CryptoFightClub Coins are falling from the sky!!! :thunder_cloud_rain: \n**" +
      amount/onlineID.length + " CFCC** soaked on " + setUsernames[0], setUsernames);
}

function rain(amount, online, message, callback){
  // users online && msg in last 10 minutes - limit to 5 users
  let onlineID = [];
  let onlineUsername = "";
  let currentTime = new Date().getTime();
  online.forEach(function (user) {
    if (!user.lastMessage) {
      const collector = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 10000 });
      collector.on('collect', message => {
        if(message.channel.parentID === user.lastMessage.channel.parentID && currentTime - message.createdTimestamp < 180000) {
          onlineID.push(user.id);
          onlineUsername = onlineUsername + " <@" + user.id + ">"
        }
        collector.stop("Got my message");
      })
    } else {
      if(message.channel.parentID === user.lastMessage.channel.parentID && currentTime - message.createdTimestamp < 180000) {
        onlineID.push(user.id);
        onlineUsername = onlineUsername + " <@" + user.id + ">"
      }
    }
  });
  callback(onlineID, "No new messages, since I woke up", ":cloud_rain: CryptoFightClub Coins are raining from the sky!!! :cloud_rain: \n" +
      "**" + amount/onlineID.length + " CFCC** rained down on " + onlineUsername + " :rocket:");
}

function drizzle(amount, online, message, callback){
  // users online && msg in last 10 minutes - limit to 5 users
  let onlineUsersList = [];
  let onlineUsername = "";
  let currentTime = new Date().getTime();
  online.forEach(function (user) {
    if (!user.lastMessage) {
      const collector = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 10000 });
      collector.on('collect', message => {
        if(message.channel.parentID === user.lastMessage.channel.parentID && currentTime - message.createdTimestamp < 60000) {
          onlineUsersList.push({id: user.id, timestamp: message.createdTimestamp});
        }
        collector.stop("Got my message");
      })
    } else {
      if(message.channel.parentID === user.lastMessage.channel.parentID && currentTime - message.createdTimestamp < 60000) {
        onlineUsersList.push({id: user.id, timestamp: user.lastMessage.createdTimestamp});
      }
    }
  });
  let sortedOnlineUsersList = onlineUsersList.sort(compareDesc);
  let top5 = sortedOnlineUsersList.slice(0, 5);

  let onlineID = top5.map(function (user) {
    onlineUsername = onlineUsername + " <@" + user.id + ">";
    return user.id;
  });
  callback(onlineID,"No new messages, since I woke up", ":white_sun_rain_cloud: CryptoFightClub Coins are drizzling from the sky!!! :white_sun_rain_cloud: \n" +
      "**" + amount/onlineID.length + " CFCC** rained down on " + onlineUsername + " :rocket:");
}

function getPrice(bot, msg){
  getDataFromAPI("https://maplechange.com:443//api/v2/tickers/CryptoFightClub%20.json", true, function(data){
    let result = JSON.parse(data);
    if (result !== "undefined") {
      if (result.BTC_CFCC) {
        sendEmbedMessages(msg, "", 3447003, [{
          name: "maplechange - CFCC Price",
          value: "**" + result.BTC_CFCC.last + "** BTC/CFCC"
        }])
      } else {
        msg.reply("Price is not set by buyers/sellers")
      }
    }
  });
}

function getBlock(bot, msg){
  getDataFromAPI("http://174.138.54.194/api/getblockcount", true, function(result){
    if (result !== "undefined") {
      if (result) {
        sendEmbedMessages(msg, "", 0x00AE86, [{
          name: "CryptoFightClub Coin - Current BLOCK",
          value: "Block height: **" + result + "**"
        }])
      } else {
        msg.reply("Price is not set by buyers/sellers")
      }
    }
  });
}

function getWeight(bot, msg){
  getDataFromAPI("https://", false, function(result){
    if (result !== "undefined") {
      if (result) {
        sendEmbedMessages(msg, "", 0xF55555, [{
          name: "CryptoFightClub Coin - Current Staking weight",
          value: "Staking Weight: **" + result + "**"
        }])
      } else {
        msg.reply("Price is not set by buyers/sellers")
      }
    }
  });
}

function getSupply(bot, msg){
  getDataFromAPI("http://174.138.54.194/ext/getmoneysupply", true, function(result){
    if (result !== "undefined") {
      if (result) {
        sendEmbedMessages(msg, "", 0xF55555, [{
          name: "CryptoFightClub Coin - Supply",
          value: "Supply: **" + result + "** CryptoFightClub Coins"
        }])
      } else {
        msg.reply("Price is not set by buyers/sellers")
      }
    }
  });
}

function getavatar(bot, msg, words){
  let desc;
  if(words.length > 1 && msg.mentions.users){
    for(var user of msg.mentions.users){
      desc = "";
      if(!user[1].avatarURL){
        desc = user[1].username+"'s profile picture is not available. So **It's ME**"
      }
      sendEmbedNameAndPic(msg, user[1].username, 0x00FF00, user[1].avatarURL || msg.client.user.avatarURL, desc)
    }
  } else {
    desc = "";
    if(!msg.author.avatarURL){
      desc = "Your profile picture is not available. So **It's ME**"
    }
    sendEmbedNameAndPic(msg, msg.author.username, 0x00FF00, msg.author.avatarURL || msg.client.user.avatarURL, desc)
  }
}

function getDataFromAPI(url, sync, callback){
  let xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", url, sync); // true for asynchronous
  xmlHttp.send(null);
}

function sendEmbedMessages(msg, description, color, fields) {
  let embed = new Discord.RichEmbed()
    .setTitle("CryptoFightClub Coin")
    .setAuthor(msg.client.user.username, msg.client.user.avatarURL)
    .setColor(color)
    .setDescription(description)
    .setFooter("© CryptoFightClub Coin", msg.client.user.avatarURL)
    // .setImage("https://imgur.com/gMoWgBq")
.setThumbnail("https://i0.wp.com/www.mbird.com/wp-content/uploads/2013/01/Upward-Trend.png")
    .setTimestamp()
    .setURL("https://CryptoFightClubCo.in/");
  fields.forEach(function(f){
    embed = embed.addField(f.name, f.value)
  });

  msg.channel.send(embed)
// color: 3447003, // blue
}

function sendDSRMessages(msg, description, color, fields) {
  let embed = new Discord.RichEmbed()
    .setColor(color)
    .setDescription(description)
    .setFooter("© CryptoFightClub Coin", msg.client.user.avatarURL)
    // .setImage ("https://imgur.com/gMoWgBq")
    .setTimestamp()
  fields.forEach(function(f){
    embed = embed.addField(f.name, f.value)
  });

  msg.channel.send(embed)
// color: 3447003, // blue
}

function sendEmbedNameAndPic(msg, heading, color, url, description){
    let embed = new Discord.RichEmbed()
        .setTitle(heading)
        .setColor(color)
        .setFooter("© CryptoFightClub Coin", msg.client.user.avatarURL)
        .setDescription(description)
        .setImage(url)
        .setTimestamp()
        .setURL("https://CryptoFightClubCo.in/");

    msg.channel.send(embed)
}

function sendCFCC(bot, message, tipper, recipient, amount, privacyFlag) {
  getAddress(recipient.toString(), function(err, address) {
    if (err) {
      message.reply("GET address Error: " +err.message).then(message => message.delete(5000));
    } else {
      cfcc.sendFrom(tipper, address, Number(amount), 1, null, null, function(err, txId) {
        if (err) {
          message.reply("Send from Error: " +err.message).then(message => message.delete(5000));
        } else {
          if (privacyFlag) {
            let userProfile = message.guild.members.find('id', recipient);
            var iimessage =
              ' You got privately tipped ' +
              amount +
              ' CFCC\n' +
              txLink(txId) +
              '\n' +
              'DM me `"help` for cfccTipper instructions.';
            userProfile.user.send(iimessage);
            var imessage =
              ' You privately tipped ' +
              userProfile.user.username +
              ' ' +
              amount +
              ' CFCC\n' +
              txLink(txId) +
              '\n' +
              'DM me `"help` for cfccTipper instructions.';
            message.author.send(imessage);

            if (
              message.content.startsWith(' private ')
            ) {
              message.delete(1000); //Supposed to delete message
            }
          } else {
            var iiimessage =
              ' tipped <@' +
              recipient +
              '> ' +
              amount +
              ' CFCC\n' +
              txLink(txId) +
              '\n' +
              'DM me `"help` for cfccTipper instructions.';
              message.reply(iiimessage);
          }
        }
      });
    }
  });
}

function getAddress(userId, cb) {
  cfcc.getAddressesByAccount(userId, function(err, addresses) {
    if (err) {
      cb(err);
    } else if (addresses.length > 0) {
      cb(null, addresses[0]);
    } else {
      cfcc.getNewAddress(userId, function(err, address) {
        if (err) {
          cb(err);
        } else {
          cb(null, address);
        }
      });
    }
  });
}

function inPrivateorSpamChannel(msg) {
  if (msg.channel.type == 'dm' || isSpam(msg)) {
    return true;
  } else {
    return false;
  }
}

function isSpam(msg) {
  return spamchannels.includes(msg.channel.id);
};

function compareDesc(a,b) {
    if (a.timestamp < b.timestamp)
        return 1;
    if (a.timestamp > b.timestamp)
        return -1;
    return 0;
}

function getValidatedAmount(amount) {
  amount = amount.trim();
  if (amount.toLowerCase().endsWith('cfcc')) {
    amount = amount.substring(0, amount.length - 3);
  }
  return amount.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;
}

function txLink(txId) {
  return http://174.138.54.194/tx/ + txId;
}


