const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const PREFIX = ">"

function generateHex() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], { filter: audioonly }));

    server.queue.shift();

    server.dispatcher.on("end", function () {
        if (server.queue[0]) play(connection, message)
        else connection.disconnect();
    });
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
    bot.user.setGame("Playing woah")
});

bot.on("guildMemberAdd", function (member) {
    member.guild.defaultChannel.send("Welcome to " + member.guild.name + " " + member.toString())
});

bot.on("message", async (message) => {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);

    var moron= message.mentions.members.first();

    switch (args[0].toLowerCase()) {
        case "kick":
            moron.kick().then((member) => {
                    message.channel.send(moron.displayName + "is and guy that was kicked by " + message.author.toString());
            }).catch(() => {
                message.channel.send("Ou nooo i can't do anythingo");
            });
            break;
        case "say":
        const sayMessage = args.join(" ");
        message.delete().catch(O_o=>{}); 
        message.channel.send(sayMessage);
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
