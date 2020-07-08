const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const auth = require('./auth.json');
var guild;

// Connect to server
client.login(auth.token);

// When bot is connected
client.on('ready', () => {
    guild = getGuild(client);

    printGuild(guild);
    printEmojis(guild);
    printChannels(guild);
    printRoles(guild);
    printMembers(guild);

    getMessages(guild.channels.cache.find(channel => channel.name === 'mods'));
});


// When someone sends a message
client.on('message', message => {
    console.log(message.content);
    message.content = message.content.toLowerCase();

    // Do something with what comes after a command
    if (message.content.startsWith("!say") ) {
        // Get the phrase after the command
        var input = message.content.replace(/\!say /, "");
        message.channel.send(input);
    }

    // Do something with a mentioned user after a command
    if (message.content.startsWith("!enlighten") ) {
        // Check the author's roles to make sure they have the Admin role (optional)
        if (message.member.roles.cache.find(role => role.name === "Admin")) {
            if (message.mentions.users.size) {
                // Add a role to this user
                var role = guild.roles.cache.find(role => role.name === 'enlightened');
                if (role) {
                    var member = guild.members.cache.get(message.mentions.users.first().id);
                    member.roles.add(role);
                }
            }
        }
    }

    // Respond to a message that contains a phrase
    if (message.content.includes("i'm hungry") ) {
        message.channel.send("Enjoy a toasted sandwich!");
    }

    // React to a message
    if (message.content.startsWith('!react') ) {
        // React with a custom emoji
        var emoji = client.emojis.cache.find(emoji => emoji.name === 'EMOJI_NAME_HERE');
        if (emoji) {
            message.react(emoji);
        } else {
            console.log('Could not find custom emoji');
        }
        // React with standard emoji
        message.react('💯');
    }
});

// When there is a reaction
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            return;
        }
    }
    if (reaction._emoji.name == "💯") {
        console.log(user.username + " reacted to Message ID:" + reaction.message.id + " with 💯!");
    }
});

// When a new member joins
client.on('guildMemberAdd', member => {
    console.log(member.user.username + " has joined.");
    var role = guild.roles.cache.get(roleId);
    member.roles.add(role);
});

// Get guild from connection
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

function printRoles(guild)
{
    console.log("\n\nROLES --------------------------------------------------");
    for (var role of guild.roles.cache) {
        console.log(role[1].id + "\t" + role[1].name);
    }
}

function printMembers(guild)
{
    console.log("\n\nMEMBERS --------------------------------------------------");
    for (var member of guild.members.cache) {
        console.log(member[1].user.id + "\t" + member[1].user.username + "#" + member[1].user.discriminator);
    }
}

// Get all messages in a given channel
var messagesArray = [];
function getMessages(channel, beforeMessageId = null) {
    channel.messages.fetch({ limit: 100, before: beforeMessageId })
    .then(messages => {
        var cursorMessageId = null;
        for (var message of messages) {
            // console.log(message)
            var item = {
                id: message[1].id,
                // channel: message[1].channel.id,
                author: message[1].author.id,
                content: message[1].content,
                // created: message[1].createdTimestamp,
                // modified: message[1].editedTimestamp,
                // deleted: message[1].deleted,
            }
            messagesArray.push(item);
            cursorMessageId = message[1].id;
        }
        // We only get 100 messages at a time - check if we need to go to the next page
        console.log(messages.size + " messages fetched");
        if (messages.size > 0 && cursorMessageId != beforeMessageId) {
            console.log("next page with cursor: " + cursorMessageId);
            // Next page!
            setTimeout(() => {getMessages(channel, cursorMessageId)}, 1000);
        } else {
            // We're done, print out the JSON of messages
            console.log(messagesArray); 
        }
    })
    .catch(console.error);
}