// Welcome to the code, remember to keep a seperate copy for public and dev build
// Yours Truly, Monacraft

const Discord = require("discord.js");
const client = new Discord.Client();
var myID = '396672130479161354';
var devID = '130568487679688704';
var fs = require('fs');
var welcomeChannel = '396668459053744131';
var guildID = '396668459053744128';
var started = 0;
var oldMessage = '';
var OLDwelcomeText = `
You have 10 minutes before you can interact with the members.
Please take this time to read through the #rules_faq and fill out this little form that will help us in assigning you a role as well as help us find an appropriate time for all to hold the discussions. https://goo.gl/tZjoRz


Summary of rules:
1. Asking for **medical advice**, whether through DMs or by asking them over here, is **strictly prohibited** and will **not** be tolerated. Any user who does so will be **immediately banned**.
2. Any member who does **not** fill the form will be kicked within **24 hours** of joining.
3. Please be **respectful of others**, and do not use foul language.

IF YOU ARE EXPERIENCING A SERIOUS, RAPIDLY WORSENING, OR POTENTIALLY LIFE THREATENING SYMPTOMS, PLEASE CALL *911* OR VISIT THE ER.

By entering this server, you accept that this agreement represents the entire understanding between you and the lead moderators concerning the use of this server.
`
var welcomeText = `
\`\`\`cs
You have 10 minutes before you can interact with the members.
Please take this time to read through the rules and fill out this little form that will help us in assigning you a role as well as help us find an appropriate time for all to hold the discussions.

Summary of rules:
1. Asking for 'medical advice', whether through DMs or by asking them over here, is 'strictly prohibited' and will 'not' be tolerated. Any user who does so will be 'immediately banned'.
2. Any member who does 'not' fill the form will be kicked within '24 hours' of joining.
3. Please be 'respectful of others', and do not use foul language.

IF YOU ARE EXPERIENCING A SERIOUS, RAPIDLY WORSENING, OR POTENTIALLY LIFE THREATENING SYMPTOMS, PLEASE CALL *911* OR VISIT THE ER.

By entering this server, you accept that this agreement represents the entire understanding between you and the lead moderators concerning the use of this server.
\`\`\`
https://goo.gl/tZjoRz and more in: #rules_faq
`

var token;
client.on('ready', () => {
    client.user.setGame("Welcome to the MKA");
    console.log(`Logged in as ${client.user.tag}!`);
});

var shutdown = false;
var devUser;
client.on('message', msg => {
    if (msg.author.id === devID) {
        // This ID is set to Monacraft's ID
        // Dev Commands
        if (msg.content === '!shutdown') {
            if (msg.author.id === devID) {
                shutdown = true;
                msg.reply("Goodbye :')");
            }
            if (msg.content === '!ping') {
                msg.reply('Pong!')
            }
        }
        if (msg.content === '!start') {
            devUser = msg.author;
            console.log(devUser);
            msg.delete();
            msg.channel.send("Starting Welcome Log");
        }
        if (msg.content === "!test") {
            console.log('Test Welcome... ' + devUser.username + " with ID: " + devUser.id);
            var lm = client.user.lastMessage;
            var thisChannel = lm.channel;
            client.user.lastMessage.delete();
            thisChannel.send(`Hello ${devUser} and welcome to the Medical Knowledge Association!`);
            thisChannel.send(welcomeText);
            msg.delete();
        }
    }
    if (msg.author.id === myID) {
        if (shutdown) {
            process.exit();
        }
        if (msg.content === "Starting Welcome Log") {
            started = 1;
            msg.edit(welcomeText);
        }
    }
});
client.on('guildMemberAdd', member => {
    if (member.guild.id === guildID) {
        if (started === 1) {
            console.log('Welcoming... ' + member.user.username + " with ID: " + member.user.id);
            var lm = client.user.lastMessage;
            var thisChannel = lm.channel;
            client.user.lastMessage.delete();
            thisChannel.send(`Hello ${member.user} and welcome to the Medical Knowledge Association!`);
            thisChannel.send(welcomeText);
        } else {
            console.log('Someone joined but I was not started: ' + member.user.username + " : " + member.user.id);
        }
    }
});


fs.readFile('..\\MKABot.token', 'utf8', function (err, data) {
    if (err) throw err;
    token = data;
    client.login(token);
});