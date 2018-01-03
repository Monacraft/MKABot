// Welcome to the code, remember to keep a seperate copy for public and dev build
// Yours Truly, Monacraft

const Discord = require("discord.js");
const client = new Discord.Client();
var myID = '396672130479161354';
var devID = '130568487679688704';
var fs = require('fs');
var welcomeChannel = ''; // actual = '389198025530015754'; // devtest ='396668459053744131';
var guildID = ''; // actual = '237582214525616129'; // devtest = '396668459053744128';
var lastMessageID = '';
var started = 0;
var oldMessage = '';
var shutdown = false;
var devUser;
var rolePending = '';
var rolePendingName = 'Membership Pending';
var roleAccept = '';
var roleAcceptName = 'MKA Member';
var accept = '✅';
var fail = '❌';
var notAccepted = [];
var kickedCount = 0;
var acceptedCount = 0;

var acceptText = "I will not ask or offer medical advice";
var acceptMsg = accept + " Congrats! You're now a member of the discord"
var failMsg = fail + ' Error... Please type letter for letter: `' + acceptText + '`';
var welcomeText = `
__** Important Information: **__

You have 10 minutes before you can interact with the members.
Please take this time to read through the #rules_faq and fill out this little form that will help us in assigning you a role as well as help us find an appropriate time for all to hold the discussions.
http://goo.gl/forms/uLAYS1UfKPUSEwxY2

Summary of rules:
1. Asking for **medical advice**, whether through DMs or by asking them over here, is **strictly prohibited** and will **not** be tolerated. Any user who does so will be **immediately banned**.
2. Any member who does **not** fill the form will be kicked within **24 hours** of joining.
3. Please be **respectful of others**, and do not use foul language.

IF YOU ARE EXPERIENCING A SERIOUS, RAPIDLY WORSENING, OR POTENTIALLY LIFE THREATENING SYMPTOMS, PLEASE CALL *911* OR VISIT THE ER.

By entering this server, you accept that this agreement represents the entire understanding between you and the lead moderators concerning the use of this server.
`
var dmText = `
\`\`\`md
Hello again :)
This message is to stress the importance of not <asking> or <giving> medical advice on our discord.
<Note: giving medical consultation over the internet is highly irresponsible and unethical practice, ultimately placing patients in danger>

IF YOU <UNDERSTAND> and <ACCEPT> THIS, please type /* "${acceptText}" * (without the quotes)
IF you do not receive the confirmation response, you will be autokicked in /* 24 hours. *
\`\`\`
`

var token;
client.on('ready', () => {
    client.user.setGame("Welcome to the MKA");
    console.log(`Logged in as ${client.user.tag}!`);


    devUser = client.users.get(devID);
    guildID = '237582214525616129'
    storedGuild = client.guilds.get(guildID);
    welcomeChannel = client.guilds.get(guildID).channels.get('389198025530015754');
    // message.guild.channels.find("name", "channel-name");
    console.log(devUser.username);
    roles = storedGuild.roles.array();
    //console.log(roles);
    for (var i = 0; i < roles.length; i++) {
        if (roles[i].name === rolePendingName) {
            rolePending = roles[i].id;
        }
        if (roles[i].name === roleAcceptName) {
            roleAccept = roles[i].id;
        }
    }
    welcomeChannel.messages.get(welcomeChannel.lastMessageID).delete();
    welcomeChannel.send("Starting Welcome Log");    

});

function autoKick(memberID) {
    for (var i = 0; i < notAccepted.length; i++) {
        if (notAccepted[i] === memberID) {
            var mem = client.guilds.get(guildID).members.get(memberID);
            if (client.guilds.get(guildID).members.get(memberID) !== undefined) {
                if (client.guilds.get(guildID).members.get(memberID).roles.get(rolePending) !== undefined) {
                    console.log("Autokicking: " + mem.user.username + " - " + mem.id);
                    mem.kick("You did not accept the terms and condition (please react tick next time)");
                    kickedCount += 1;
                    console.log("Kicked Count: " + kickedCount);
                } else {
                    console.log(mem.id + ", role manuanly removed");
                }
                notAccepted.splice(i, 1);
            }
        }
    }
    console.log("Not Accepted Count: " + notAccepted.length);
}


var storedGuild;
client.on('message', msg => {
    if (msg.content === "!stats") {
        msg.reply(
            `Bot Stat's (Reset every 24 hours): 
\`\`\`ml
 - Number Autokicked:   ${kickedCount}
 - Number Accepted:     ${acceptedCount}
 - Number Length:       ${leftCount}
 - Number Pending:      ${notAccepted.length}
 - Still to Accept:     ${notAccepted.join(", ")}
\`\`\``)
        msg.delete();
    }
    if (msg.author.id === devID) {
        // This ID is set to Monacraft's ID
        // Dev Commands
        if (msg.content === '!shutdown') {
            if (msg.author.id === devID) {
                shutdown = true;
                msg.reply("Goodbye :')");
            }
        }
        if (msg.content === '!start' && started === 0) {
        }
        if (msg.content === '!ping') {
            msg.reply('Pong!')
        }
        if (msg.content === "!checkrole") {
            console.log(client.guilds.get(guildID).members.get(devID).roles.get(rolePending) !== undefined);
            console.log(client.guilds.get(guildID).members.get(devID).roles.get('21231313'));
            console.log(client.guilds.get(guildID).members.get(devID).roles.get(roleAccept));
        }
        if (msg.content === "!test") {
            console.log('Test Welcome... ' + devUser.username + " with ID: " + devUser.id);

            var guild = client.guilds.get(guildID);
            var thisChannel = guild.channels.get(welcomeChannel);

            msg.guild.fetchMember(msg.author.id).then(member => {
                member.addRole(rolePending);
                notAccepted.push(member.user.id);
                console.log("Not Accepted Count: " + notAccepted.length);
                console.log("Would autokick");
            });
            //setTimeout(autoKick, 60000 * 2, member.user.id);
            thisChannel.send(`⭐ Hello ${msg.author.username} and welcome to the Medical Knowledge Association!`);
            thisChannel.send("Welcome Log");
            msg.author.send(dmText);
            msg.delete();
        }
    }
    if (msg.author.id === myID) {
        if (shutdown) {
            process.exit();
        }
        if (msg.content === "Starting Welcome Log") {
            started = 1;
            msg.edit(welcomeText + '\nAwaiting New Members...');
            lastMessageID = msg.id;
        }
        if (msg.content === "Welcome Log") {
            msg.channel.fetchMessage(lastMessageID).then(message => {
                message.delete();
            }).catch(err => {
                console.log(err);
            })
            msg.edit(welcomeText);
            lastMessageID = msg.id;
        }
    }
    if (started === 1 && msg.channel.type === "dm") {
        var exec = false;
        if (msg.author.id !== myID) {
            if (msg.content === acceptText) {
                exec = true;
                for (var a = 0; a < notAccepted.length; a++) {
                    //console.log(r.id + " : " + notAccepted[a]);
                    if (msg.author.id === notAccepted[a]) {
                        //var m = react.message.guild.members.get(r[u].id);
                        client.guilds.get(guildID).fetchMember(msg.author.id).then(member => {
                            member.removeRole(rolePending);
                            console.log(member.user.username + " accepted conditions");
                            member.addRole(roleAccept);
                            acceptedCount++;
                            msg.author.send(acceptMsg);
                        });
                        notAccepted.splice(a, 1);
                    }
                }
            } else {
                if (!exec) {
                    msg.author.send(failMsg);
                }
            }
        }
    }
});
client.on('guildMemberAdd', member => {
    if (member.guild.id === guildID) {
        if (started === 1) {
            console.log('Welcoming... ' + member.user.username + " with ID: " + member.user.id);

            var guild = client.guilds.get(guildID);
            var thisChannel = guild.channels.get(welcomeChannel);

            member.addRole(rolePending);
            notAccepted.push(member.user.id);
            console.log("Not Accepted Count: " + notAccepted.length);

            setTimeout(autoKick, 60000 * 60, member.user.id);

            thisChannel.send(`⭐ Hello ${member.user} and welcome to the Medical Knowledge Association!`);
            thisChannel.send("Welcome Log");

            member.user.send(dmText);

        } else {
            console.log('Someone joined but I was not started: ' + member.user.username + " : " + member.user.id);
        }
    }
});

var leftCount = 0;
client.on('guildMemberRemove', member => {
    if (started === 1) {

        var guild = client.guilds.get(guildID);
        var removeAt = -1;
        for (var i = 0; i < notAccepted.length; i++) {
            if(notAccepted[i] === member.user.id) {
                leftCount ++;
                removeAt = i;
            }
        }
        if(removeAt > 0) {
            notAccepted.splice(removeAt, 1);
            leftCount++;
            console.log("Someone left");
        }
        console.log("Not Accepted Count: " + notAccepted.length);

    } else {
        console.log('Someone left but I was not started: ' + member.user.username + " : " + member.user.id);
    }
});

/*
client.on('messageReactionAdd', react => {
    if (react.message.channel.id === welcomeChannel) {
        if (react.emoji.name === accept) {
            react.users.map(function (r) {
                for (var a = 0; a < notAccepted.length; a++) {
                    //console.log(r.id + " : " + notAccepted[a]);
                    if (r.id === notAccepted[a]) {
                        //var m = react.message.guild.members.get(r[u].id);
                        react.message.guild.fetchMember(r.id).then(member => {
                            member.removeRole(rolePending);
                            console.log(member.user.username + " accepted conditions");
                            member.addRole(roleAccept);
                        });
                        notAccepted.splice(a, 1);
                    }
                }
            });
            console.log("Not Accepted Count: " + notAccepted.length);
        }
    }
});
*/

/*
fs.readFile('..\\MKABot.token', 'utf8', function (err, data) {
    if (err) throw err;
    token = data;
    client.login(token);
});
*/

client.login(process.env.BOT_TOKEN);
