const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const PREFIX = ">"

function generateHex() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

var fortunes = [
    "Yes",
    "No",
    "Maybe",
    "Never",
    "YEEEEEEEEEEEEEEEeeeeeeeeeeeee..............",
    "WOAH",
    "**W O A H**",
    "Fuck you",
    "My master is Kyuubi#1669 (McPunho2)",
    "What?",
    "...",
    "PHIJET PHINNNNEEETZZZZZZZZZZZZZZZZZZZZZ",
    "Nazism is good",
    "I refuse to say anything",
    "I am a good bot, controlled by a program."
];

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function () {
    console.log("Ready");
});

bot.on("guildMemberAdd", function (member) {
    member.guild.channels.find("name", "scripts_nudes_everything").sendMessage(member.toString() + " Welcome!")

    member.addRole(member.guild.roles.find("name", "dank member"));

    member.guild.createRole({
        name: member.user.username,
        color: generateHex(),
        permissions: []
    }).then(function (role) {
        member.addRole(role);
    })
});

bot.on("message", function (message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    var moron= message.mentions.members.first();

    switch (args[0].toLowerCase()) {
        case "cmds":
        message.reply("I have sent you cmds in dms");
		message.author.send("Cmd List: ", ">ping - I will be rude", ">noticeme - You will be noticed", ">info - Info about me",         ">8ball (message) - I will answer!",         ">kick @user - I will kick this user",         ">ban @user - I will ban this user");
        
        break;
        case "kick":
            moron.kick().then((member) => {
                    message.channel.send(":wave: " + moron.displayName + " has been sucessfully kicked :point_right:");
            }).catch(() => {
                message.channel.send("Acess Denied");
            });
            break;
        case "ban":
            moron.ban().then((member) => {
                message.channel.send(moron.displayName + " is an idiot and was banned by " + message.author.toString());
            }).catch(() => {
                message.channel.send("Acess denied sori.");
            });
            break;
        case "noticeme":
            message.channel.sendMessage(message.author.toString() + " You were noticed by the god of memes, now get the fuck out.")
            break;
        case "ping":
            message.channel.sendMessage("Fuck you, i am not saying pong");
            break;
        case "info":
            message.channel.sendMessage("I am a meme bot, created for fun by McPunho2 (Kyuubi#1669).");
            break;
        case "8ball":
            if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
            else message.channel.sendMessage("I can't read that");
            break;
        default:
            message.channel.sendMessage("Invalid command, say **>cmds** for commands.");
    }

});

bot.login(process.env.TOKEN);
