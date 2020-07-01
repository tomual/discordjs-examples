const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.login(auth.token);

client.on('ready', () => {
    var guild = getGuild(client);
    printGuild(guild);
    printChannels(guild);
    printMembers(guild);

    getMessages(guild.channels.cache.get('724442665093038110'));
});

function getGuild(client) {
    var guildId = client.guilds.cache.keys().next().value;
    var guild = client.guilds.cache.get(guildId);
    return guild;
}

function printGuild(guild)
{
    console.log("\n\nGUILD ----------------------------------------------------");
    console.log(guild.id + "\t" + guild.name);
}

function printChannels(guild)
{
    console.log("\n\nCHANNELS -------------------------------------------------");
    for (var channel of guild.channels.cache) {
        console.log(channel[1].id + "\t" + channel[1].type + "\t" + channel[1].name);
    }
}

function printMembers(guild)
{
    console.log("\n\nMEMBERS --------------------------------------------------");
    for (var member of guild.members.cache) {
        console.log(member[1].user.id + "\t" + member[1].user.username + "#" + member[1].user.discriminator);
    }
}

var messagesArray = [];
function getMessages(channel, beforeMessageId = null) {
    channel.messages.fetch({ limit: 100, before: beforeMessageId })
    .then(messages => {
        var cursorMessageId = null;
        for (var message of messages) {
            console.log(message); 
            messagesArray.push(message[1].content);
            cursorMessageId = message[1].id;
        }
        console.log(messages.size);
        if (messages.size > 0 && cursorMessageId != beforeMessageId) {
            console.log("next page - " + cursorMessageId);
            setTimeout(() => {getMessages(channel, cursorMessageId)}, 1000);
        } else {
            console.log(JSON.stringify(messagesArray)); 
        }
    })
    .catch(console.error);
}