const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.login(auth.token);

client.on('ready', () => {
    var guild = getGuild(client);
    printGuild(guild);
    console.log(guild);
    printEmojis(guild);
    printChannels(guild);
    printMembers(guild);

    // getMessages(guild.channels.cache.get('725524078282145806'));
});

client.on('message', message => {
    console.log(message.content);
    message.content = message.content.toLowerCase();

    postReaction(message);
});

function postReaction(message) {
    if (message.content.includes('react') ) {
        message.react('726121176803311718');
    }
}

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

function printEmojis(guild)
{
    console.log("\n\nEMOJIS -------------------------------------------------");
    for (var emoji of guild.emojis.cache) {
        console.log(emoji[1].id + "\t" + emoji[1].name);
    }
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
            // console.log(message)
            var item = {
                id: message[1].id,
                channel: message[1].channel.id,
                author: message[1].author.id,
                content: message[1].content,
                created: message[1].createdTimestamp,
                modified: message[1].editedTimestamp,
                deleted: message[1].deleted,
            }
            messagesArray.push(item);
            cursorMessageId = message[1].id;
        }
        console.log(messages.size + " messages fetched");
        if (messages.size > 0 && cursorMessageId != beforeMessageId) {
            console.log("next page with cursor: " + cursorMessageId);
            setTimeout(() => {getMessages(channel, cursorMessageId)}, 1000);
        } else {
            console.log(messagesArray); 
        }
    })
    .catch(console.error);
}